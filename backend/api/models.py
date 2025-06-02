# models.py
from extensions import db   # only import db, not app
#from flask_sqlalchemy import SQLAlchemy

# db = SQLAlchemy()

class Recipe(db.Model):
    __tablename__ = 'recipes'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(75), nullable=False, default='Uncategorized')
    cooking_time = db.Column(db.Text, nullable=True, default='5 mins')
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=True, default='Delicious. You need to try it!')
    image_url = db.Column(db.String(1000), nullable=True, default="https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")
    servings = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Recipe(id={self.id}, title='{self.title}', description='{self.description}', servings={self.servings})"
    # for websockets - converts Recipe object into a dictionary so it can turn into JSON
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'cooking_time': self.cooking_time,
            'ingredients': self.ingredients,
            'instructions': self.instructions,
            'servings': self.servings,
            'description': self.description,
            'image_url': self.image_url,
            'user_id' : self.user_id
        }
