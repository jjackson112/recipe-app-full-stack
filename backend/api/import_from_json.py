import json
from api import app, db  # Use app and db from api.py
from models import Recipe

def import_recipes_from_json(json_path="recipes.json"):
    with app.app_context():
        db.create_all()  # Ensure tables exist

        with open(json_path, "r", encoding="utf-8") as file:
            data = json.load(file)
            for item in data:
                if not Recipe.query.filter_by(title=item.get("title")).first():
                    recipe = Recipe(
                        title=item.get("title"),
                        category=item.get("category"),
                        cooking_time=item.get("cooking_time"),
                        ingredients=item.get("ingredients"),
                        instructions=item.get("instructions"),
                        description=item.get("description"),
                        image_url=item.get("image_url"),
                        servings=item.get("servings")
                    )
                    db.session.add(recipe)

            db.session.commit()
            print("Data import completed.")

# Run the import
if __name__ == "__main__":
    import_recipes_from_json()
