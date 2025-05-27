import json
import os
from flask import Flask
from models import db, Recipe

app = Flask(__name__)

# Build absolute path to the SQLite file inside 'instance/'
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, 'instance', 'recipes.db')
sqlite_uri = f'sqlite:///{db_path}'

app.config['SQLALCHEMY_DATABASE_URI'] = sqlite_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    # Ensure table is initialized (no harm if already exists)
    db.create_all()

    # Fetch all recipes
    recipes = Recipe.query.all()

    # Convert to dictionaries
    recipe_list = []
    for recipe in recipes:
        recipe_list.append({
            "title": recipe.title,
            "category": recipe.category,
            "cooking_time": recipe.cooking_time,
            "ingredients": recipe.ingredients,
            "instructions": recipe.instructions,
            "description": recipe.description,
            "image_url": recipe.image_url,
            "servings": recipe.servings
        })

    # Write to JSON
    output_path = os.path.join(BASE_DIR, 'recipes.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(recipe_list, f, indent=4)

    print(f"Exported {len(recipe_list)} recipes to {output_path}")
