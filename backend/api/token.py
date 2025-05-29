from functools import wraps
import jwt
from flask import request, jsonify
from user_auth_model import User
import os

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Get taken from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            token = auth_header.split(" ")[1] if " " in auth_header else auth_header

        if not token:
            return jsonify ({'error', 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify ({'error': "Token is invalid or expired!"}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated