"""
WSGI config for Hostel Allocation & Roommate Matching System.
"""
import os
from django.core.wsgi import get_wsgi_application

_is_cloud = bool(os.getenv('RAILWAY_ENVIRONMENT') or os.getenv('RAILWAY_SERVICE_ID') or os.getenv('RENDER'))
os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'config.settings.production' if _is_cloud else 'config.settings.development'
)

application = get_wsgi_application()

