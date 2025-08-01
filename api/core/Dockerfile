FROM python:3-alpine

RUN apk add --no-cache gettext-dev curl

RUN curl -sSf https://astral.sh/uv/install.sh | sh

# Install a WSGI server to serve our files
RUN uv pip install gunicorn

COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

COPY ./ /app/

WORKDIR /app/

# Install your requirements from a requirements.txt file (support for poetry, pipenv should also be included at some point)
RUN pip install -r ${REQUIREMENTS_BASE_FOLDER}/requirements.txt


ENTRYPOINT ["/entrypoint.sh"]