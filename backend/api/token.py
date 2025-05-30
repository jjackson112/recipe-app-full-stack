from functools import wraps
import jwt
from flask import request, jsonify
from user_auth_model import User
import os
from jwt import ExpiredSignatureError, InvalidTokenError # improve error handling to specifically catch JWT errors

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Get taken from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            token = auth_header.split(" ")[1] if " " in auth_header else auth_header

        if not token:
            return jsonify ({'error': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'error': 'User not found!'}), 404
        except ExpiredSignatureError:
            return jsonify({'error': "Token is invalid or expired!"}), 401
        except InvalidTokenError:
            return jsonify({'error': "Invalid token!"}), 401
        except Exception as e:
            return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

        return f(current_user, *args, **kwargs)
    return decorated