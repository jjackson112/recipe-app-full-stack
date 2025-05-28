# manual_migrate.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Recipe
from extensions import db

# Manually access metadata from db
Base = db.Model.metadata

# Your Render PostgreSQL URI
DATABASE_URL = "postgresql://recipe_db_v96b_user:Dt12GhvYwKigS5U3Fz3WiKR0RHyNn9LB@dpg-d0q6p33e5dus73efjno0-a.ohio-postgres.render.com/recipe_db_v96b"
engine = create_engine(DATABASE_URL)

# Create table
Base.create_all(engine)

# Optional: Insert JSON data
import json
Session = sessionmaker(bind=engine)
session = Session()

with open("recipes.json") as f:
    data = json.load(f)
    for item in data:
        recipe = Recipe(**item)
        session.add(recipe)

session.commit()
session.close()

print("Migration completed.")
