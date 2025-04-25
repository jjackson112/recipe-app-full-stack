import time
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# set up SQL database - location configured to store the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipes.db'
# create database object by calling SQL Alchemy class
db = SQLAlchemy(app)

if __name__ == '__main__':
    app.run(debug=True)
