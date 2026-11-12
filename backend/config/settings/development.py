"""
Development settings for Hostel Allocation & Roommate Matching System.
"""
from .base import *  # noqa: F401, F403

DEBUG = True

# Allow Vite dev-server port fallback (5173..5179) in local development only
for _dev_port in range(5174, 5180):
    for _dev_host in ('localhost', '127.0.0.1'):
        _origin = f'http://{_dev_host}:{_dev_port}'
        if _origin not in CORS_ALLOWED_ORIGINS:  # noqa: F405
            CORS_ALLOWED_ORIGINS.append(_origin)  # noqa: F405
        if _origin not in CSRF_TRUSTED_ORIGINS:  # noqa: F405
            CSRF_TRUSTED_ORIGINS.append(_origin)  # noqa: F405

# Internal IPs for debug toolbar (if enabled later)
INTERNAL_IPS = [
    '127.0.0.1',
    'localhost',
]

# Development logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[{asctime}] {levelname} {name}:{lineno} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'WARNING',  # Set to DEBUG to inspect SQL queries
            'propagate': False,
        },
        'apps': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
