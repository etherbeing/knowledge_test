FROM python:3-alpine

RUN apk add --no-cache gettext-dev curl

RUN curl -sSf https://astral.sh/uv/install.sh | sh

# Install a WSGI server to serve our files
RUN uv pip install gunicorn

COPY ./src/ /app/


COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

WORKDIR /app/

COPY ./requirements.txt /app/requirements.txt

# Install your requirements from a requirements.txt file (support for poetry, pipenv should also be included at some point)
RUN uv pip install -r /app/requirements.txt && rm /app/requirements.txt && uv python ./manage.py collectstatic --noinput && uv python ./manage.py migrate

ENTRYPOINT ["/entrypoint.sh"]