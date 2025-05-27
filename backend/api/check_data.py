from sqlalchemy import create_engine, text
import os

db_path = os.path.abspath('recipes.db')
engine = create_engine(f'sqlite:///{db_path}')

with engine.connect() as conn:
    result = conn.execute(text("SELECT * FROM recipe"))
    rows = result.fetchall()
    print(f"Found {len(rows)} rows in 'recipe':")
    for row in rows:
        print(row)
