from extensions import db # focuses on users only
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

# UserMixin provides the methods Flask-Login needs (is_authenticated, is_active)
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)