from sqlalchemy import create_engine, inspect
import os

db_path = os.path.abspath('recipes.db')
engine = create_engine(f'sqlite:///{db_path}')
inspector = inspect(engine)
tables = inspector.get_table_names()
print("Tables found:", tables)
