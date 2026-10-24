import os
import sys

# Set current directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaheshkar_backend.settings')

# Get Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
