"""
auth.py — Centralized Authentication & Input Validation Helpers
Provides reusable decorators and sanitizers for all routes.
"""
from functools import wraps
from flask import request, jsonify, g
import firebase_admin.auth
import logging
import os

logger = logging.getLogger(__name__)

# Authorized admin emails (single source of truth)
_ADMIN_EMAILS = {e.strip().lower() for e in os.getenv('ADMIN_EMAILS', 'omprakashmaury24@gmail.com,opmaury001@gmail.com').split(',')}


# ─── Decorator: require_auth ──────────────────────────────────────────────────
def require_auth(f):
    """
    Verifies Firebase ID token from Authorization header.
    Sets g.user_id and g.user_email on success.
    Returns 401 on failure — never leaks exception details to client.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'success': False, 'error': 'Authentication required. Please login.'}), 401

        token = auth_header.split(' ', 1)[1].strip()
        if not token:
            return jsonify({'success': False, 'error': 'Empty token.'}), 401

        try:
            decoded      = firebase_admin.auth.verify_id_token(token, check_revoked=True)
            g.user_id    = decoded['uid']
            g.user_email = decoded.get('email', '').lower()
        except firebase_admin.auth.RevokedIdTokenError:
            return jsonify({'success': False, 'error': 'Session revoked. Please login again.'}), 401
        except firebase_admin.auth.ExpiredIdTokenError:
            return jsonify({'success': False, 'error': 'Session expired. Please login again.'}), 401
        except firebase_admin.auth.InvalidIdTokenError:
            return jsonify({'success': False, 'error': 'Invalid authentication token.'}), 401
        except Exception:
            logger.exception("Unexpected token verification failure")
            return jsonify({'success': False, 'error': 'Authentication failed.'}), 401

        return f(*args, **kwargs)
    return decorated


# ─── Decorator: admin_required ────────────────────────────────────────────────
def admin_required(f):
    """
    Verifies Firebase ID token AND checks that the email is in ADMIN_EMAILS.
    Sets g.user_id and g.user_email on success.
    Returns 401 (bad token) or 403 (not admin) on failure.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'success': False, 'error': 'Missing or invalid token.'}), 401

        token = auth_header.split(' ', 1)[1].strip()
        try:
            decoded      = firebase_admin.auth.verify_id_token(token, check_revoked=True)
            user_email   = decoded.get('email', '').lower()
            g.user_id    = decoded['uid']
            g.user_email = user_email

            if user_email not in _ADMIN_EMAILS:
                logger.warning("Unauthorized admin access attempt by: %s", user_email)
                return jsonify({'success': False, 'error': 'Unauthorized. Admin access required.'}), 403

        except firebase_admin.auth.RevokedIdTokenError:
            return jsonify({'success': False, 'error': 'Session revoked. Please login again.'}), 401
        except firebase_admin.auth.ExpiredIdTokenError:
            return jsonify({'success': False, 'error': 'Session expired. Please login again.'}), 401
        except firebase_admin.auth.InvalidIdTokenError:
            return jsonify({'success': False, 'error': 'Invalid token.'}), 401
        except Exception:
            logger.exception("Admin token verification failed")
            return jsonify({'success': False, 'error': 'Authentication failed.'}), 401

        return f(*args, **kwargs)
    return decorated


# ─── Helpers ──────────────────────────────────────────────────────────────────
def safe_str(val, max_len: int = 200) -> str | None:
    """
    Returns val only if it is a plain string with no MongoDB operator characters.
    SECURITY: Prevents NoSQL injection via query params or JSON fields.
    Returns None for empty, non-string, or suspicious values.
    """
    if not val or not isinstance(val, str):
        return None
    stripped = val.strip()
    if not stripped or stripped.startswith('$') or '{' in stripped or len(stripped) > max_len:
        return None
    return stripped


def validate_object_id(id_str: str) -> bool:
    """
    Returns True only if id_str is a valid 24-char lowercase hex MongoDB ObjectId.
    Prevents injection/crash from malformed IDs.
    """
    if not id_str or not isinstance(id_str, str):
        return False
    return len(id_str) == 24 and all(c in '0123456789abcdefABCDEF' for c in id_str)


def safe_int(val, default=0, min_val=None, max_val=None):
    """Safely convert val to int with bounds check. default can be None."""
    try:
        result = int(val)
        if min_val is not None and result < min_val:
            return default
        if max_val is not None and result > max_val:
            return default
        return result
    except (TypeError, ValueError):
        return default
