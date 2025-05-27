import os
from flask import Flask
from models import db

app = Flask(__name__)

# Dynamically build absolute DB path
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, 'recipes.db')
sqlite_uri = f'sqlite:///{db_path}'

app.config['SQLALCHEMY_DATABASE_URI'] = sqlite_uri
db.init_app(app)

with app.app_context():
    db.create_all()
    print("Created tables in SQLite at:", sqlite_uri)
