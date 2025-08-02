#!/bin/sh
# mkdir -p /var/log/celery/

# python3 -m celery  -A todo beat --logfile=/var/log/celery/beat.log --loglevel=info --pidfile=/tmp/celeryworker.pid --schedule=/tmp/celerybeat-schedule --detach
# python3 -m celery  -A todo worker --logfile=/var/log/celery/worker.log --loglevel=info --pidfile=/tmp/celerybeat.pid --schedule=/tmp/celerybeat-worker --detach

uv run gunicorn todo.wsgi:application --bind :8000 --workers 4 --timeout 20