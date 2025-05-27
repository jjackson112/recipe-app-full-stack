import json
import psycopg2
from psycopg2.extras import execute_values

# Load your recipes.json file
with open("recipes.json", "r") as f:
    recipes = json.load(f)

# Connect to your Render PostgreSQL database
conn = psycopg2.connect(
    "postgresql://recipe_db_v96b_user:Dt12GhvYwKigS5U3Fz3WiKR0RHyNn9LB@dpg-d0q6p33e5dus73efjno0-a.ohio-postgres.render.com/recipe_db_v96b")  # replace with your Render DB URL
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
