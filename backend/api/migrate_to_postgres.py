from flask import Flask
import os
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from models import db, Recipe  # use your real Python filename here

# === Create Flask app BEFORE using it ===
app = Flask(__name__)

# === Ensure absolute path to SQLite DB ===
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, 'recipes.db')
sqlite_uri = f'sqlite:///{db_path}'

# configure SQLAlchemy with SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = sqlite_uri
db.init_app(app)

# Connect to SQLite (your current database)
sqlite_engine = create_engine(sqlite_uri)
SQLiteSession = sessionmaker(bind=sqlite_engine)
sqlite_session = SQLiteSession()

# Connect to PostgreSQL (your Render DB URL or local PG if testing)
# Example format: 'postgresql://username:password@host:port/databasename'
postgres_url = os.environ.get('SQLALCHEMY_DATABASE_URI')
postgres_engine = create_engine(postgres_url)
PostgresSession = sessionmaker(bind=postgres_engine)
postgres_session = PostgresSession()

# ❗Must run everything within Flask's application context
with app.app_context():
    # Confirm SQLite DB file exists
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"SQLite DB not found at {db_path}")

    # Print tables for sanity check
    inspector = inspect(sqlite_engine)
    tables = inspector.get_table_names()
    print("SQLite tables found:", tables)
    if 'recipe' not in tables:
        raise Exception("Table 'recipe' not found in SQLite. Did you run init_sqlite.py?")

    # Create tables in PostgreSQL (if not already created)
    db.metadata.create_all(bind=postgres_engine)

    # Fetch all recipes from SQLite
    recipes = sqlite_session.query(Recipe).all()

    # Insert each into PostgreSQL
    for recipe in recipes:
        new_recipe = Recipe(
            title=recipe.title,
            category=recipe.category,
            cooking_time=recipe.cooking_time,
            ingredients=recipe.ingredients,
            instructions=recipe.instructions,
            description=recipe.description,
            image_url=recipe.image_url,
            servings=recipe.servings
        )
        postgres_session.add(new_recipe)

# Commit to PostgreSQL
postgres_session.commit()

print(f"Migrated {len(recipes)} recipes from SQLite to PostgreSQL.")

# Close sessions
sqlite_session.close()
postgres_session.close()
