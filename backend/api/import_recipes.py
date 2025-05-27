import json
import os
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# PostgreSQL connection string
postgres_url = os.environ.get("SQLALCHEMY_DATABASE_URI")
if not postgres_url:
    raise EnvironmentError("Missing SQLALCHEMY_DATABASE_URI environment variable.")

# Load your recipes.json file
with open("recipes.json", "r") as f:
    recipes = json.load(f)

# Connect to your Render PostgreSQL database
conn = psycopg2.connect(postgres_url)
cur = conn.cursor()

# Create a table if it doesn't exist
cur.execute("""
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    ingredients TEXT[],
    instructions TEXT
);
""")

# Prepare data
records = []
for r in recipes:
    ingredients = r["ingredients"]
    if isinstance(ingredients, str):
        ingredients = [i.strip() for i in ingredients.split(",")]
    records.append((
        r["title"],
        ingredients,
        r["instructions"]
    ))

# Bulk insert data
execute_values(cur, """
    INSERT INTO recipes (title, ingredients, instructions)
    VALUES %s
    ON CONFLICT DO NOTHING;
""", records)

conn.commit()
cur.close()
conn.close()

print("Recipes imported successfully.")
