from functools import wraps
from flask import jsonify
from user_auth_model import User
from extensions import db
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def token_required(f):
    @wraps(f) # preserve function metadata 
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if not user:
              return jsonify({'error':'User not found!'}), 404
            return f(user, *args, **kwargs)
        except Exception as e:
           return jsonify({'error': 'Invalid or missing token'}), 401 # For debugging, you can log the exception server-side
    return decorated