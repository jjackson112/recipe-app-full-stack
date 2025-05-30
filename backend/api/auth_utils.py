from functools import wraps
from flask import jsonify
from user_auth_model import User
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def token_required(f):
    @wraps(f) # preserve function metadata 
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            current_user = User.query.get(user_id)
            if not current_user:
              return jsonify({'error':'User not found!'}), 404
        except Exception as e:
           return jsonify({'error': str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated