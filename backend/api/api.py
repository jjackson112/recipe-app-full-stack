import eventlet # websocket - socketio expects a prod ready server - Werkzeug is the default Flask server and this allows for websocket use even in dev
eventlet.monkey_patch()

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from extensions import db 
from flask_cors import CORS 
from models import Recipe  # Now importing db and Recipe from models.py
from user_auth_model import User
from flask_migrate import Migrate
from flask_socketio import SocketIO, emit
from flask_login import LoginManager, login_user, logout_user, login_required, current_user

load_dotenv()

# create database object by calling SQL Alchemy class
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key')

# have frontend and backend communicate
CORS(app, resources={r"/*": {"origins": ["https://recipe-app-frontend-gr6b.onrender.com", "http://localhost:3000"]}}, 
    supports_credentials=True,
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"])

# websockets for real time sync
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:3000", "https://recipe-app-frontend-gr6b.onrender.com"]) # allow frontend from anywhere during dev

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('sync_event')
def handle_sync(data):
    if not current_user.is_authenticated:
        return emit('sync_event', data, broadcast=True) # Or emit an error event
    print('Received sync event:', data)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

# set up SQL database - location configured to store the database
# connect to PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)
#db = SQLAlchemy()

# Initialize database and login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True  # Secure must be True for SameSite=None

# create a db model to organize database
# class Recipe(db.Model):
   # id = db.Column(db.Integer, primary_key=True)
   # title = db.Column(db.String(100), nullable=False)
   # category = db.Column(db.String(75), nullable=False, default='Uncategorized')
   # cooking_time = db.Column(db.Text, nullable=True, default='5 mins')
   # ingredients = db.Column(db.Text, nullable=False)
   # instructions = db.Column(db.Text, nullable=False)
   # description = db.Column(db.Text, nullable=True, default='Delicious. You need to try it!')
   # image_url = db.Column(db.String(1000), nullable=True, default="https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")
  #  servings = db.Column(db.Integer, nullable=False)

#    def __repr__(self):
#        return f"Recipe(id={self.id}, title='{self.title}', description='{self.description}', servings={self.servings})"

# connect SQL to web app
with app.app_context():
    db.create_all()
    db.session.commit()

# fetch recipes API
@app.route('/api/recipes', methods=['GET'])
def get_all_recipes():
    recipes = Recipe.query.all()
    recipe_list = []
    for recipe in recipes:
        recipe_list.append({
        'id': recipe.id,
        'cooking_time': recipe.cooking_time,
        'title': recipe.title,
        'category': recipe.category,
        'ingredients': recipe.ingredients,
        'instructions': recipe.instructions,
        'description': recipe.description,
        'image_url': recipe.image_url,
        'servings': recipe.servings
    })

    return jsonify(recipe_list)

# the data object sent over to POST endpoint via front end form - new recipe entry to be saved from the database
@app.route('/api/recipes', methods=['POST'])
@login_required # now only authenticated users can add recipes
def add_recipe():

    data = request.get_json()

    # while in add_recipe function, return a 400 status request if all required fields aren't completed
    required_fields = ['title', 'category', 'cooking_time', 'ingredients', 'instructions', 'servings', 'description', 'image_url']
    for field in required_fields:
        if field not in data or data[field] == "":
            return jsonify({'error':f"Missing required field: '{field}'"}), 400
        
    new_recipe = Recipe(
        title=data ['title'],
        category=data['category'],
        cooking_time=data['cooking_time'],
        ingredients=data ['ingredients'],
        instructions=data ['instructions'],
        servings=data ['servings'],
        description=data ['description'],
        image_url=data['image_url'],
        user_id=current_user.id # <== Associate the recipe with the user
    )
    db.session.add(new_recipe)
    db.session.commit()
    # Emit to all clients
    socketio.emit('sync_event', {
        'type': 'create',
        'payload': new_recipe.to_dict()
    })

# present data in a dictionary so python can transform it back to JSON
# serialization - new id attribute
    new_recipe_data = {
        'id': new_recipe.id,
        'category': new_recipe.category,
        'cooking_time': new_recipe.cooking_time,
        'title': new_recipe.title,
        'ingredients': new_recipe.ingredients,
        'instructions': new_recipe.instructions,
        'servings': new_recipe.servings,
        'description': new_recipe.description,
        'image_url': new_recipe.image_url
    }

    return jsonify({'message': 'Recipe added successfully', 'recipe': new_recipe_data})

# create a PUT endpoint - <int:recipe_id> is a placeholder for variable value, the id of the specific recipe you want to update
@app.route('/api/recipes/<int:recipe_id>', methods=['PUT'])
@login_required # now only authenticated users can edit recipes
def update_recipe(recipe_id):
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404
    data = request.get_json()
# validate the incoming JSON data for required fields
    required_fields = ['title', 'cooking_time', 'category', 'ingredients', 'instructions', 'servings', 'description', 'image_url']
    for field in required_fields:
        if field not in data or data[field] == "":
            return jsonify({'error': f"Missing required field:'{field}'"}), 400

    recipe.title = data['title']
    recipe.category = data['category']
    recipe.cooking_time = data['cooking_time']
    recipe.ingredients = data['ingredients']
    recipe.instructions = data['instructions']
    recipe.servings = data['servings']
    recipe.description = data['description']
    recipe.image_url = data['image_url']
    db.session.commit()

    updated_recipe = {
        'id': recipe.id,
        'category': recipe.category,
        'cooking_time': recipe.cooking_time,
        'title': recipe.title,
        'ingredients': recipe.ingredients,
        'instructions': recipe.instructions,
        'servings': recipe.servings,
        'description': recipe.description,
        'image_url': recipe.image_url
    }
        
    socketio.emit('sync_event', {
    'type': 'update',
    'payload': recipe.to_dict()
    })

    return jsonify({'message': 'Recipe updated successfully', 'recipe': updated_recipe})

# DELETE ENDPOINT - you just need the id of the specific recipe
@app.route('/api/recipes/<int:recipe_id>', methods=['DELETE'])
@login_required # now only authenticated users can delete recipes
def delete_recipe(recipe_id):
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404
    db.session.delete(recipe)
    db.session.commit()

    socketio.emit('sync_event', {
    'type': 'delete',
    'payload': {'id': recipe_id}
    })

    return jsonify({'message': 'Recipe deleted successfully!'})

# REGISTRATION ENDPOINT
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'error': 'Username has already been taken'}), 400

    new_user = User(username=username)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'})

# LOGIN ENDPOINT
@app.route('/api/current_user', methods=['GET'])
@login_required
def get_current_user():
    print(f"Current user: {current_user.username}")
    return jsonify({
        'id': current_user.id,
        'username': current_user.username
    })

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    username = data.get('username')
    password = data.get('password')

    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid username or password'}), 400

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        login_user(user)
        return jsonify({"message": "Logged in successfully."}), 200
    return jsonify({'error': 'Invalid username or password'}), 401

    
# LOGOUT ENDPOINT
@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message' : 'Logged out successfully'})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), allow_unsafe_werkzeug=True)
