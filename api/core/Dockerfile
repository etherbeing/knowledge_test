FROM python:3-alpine

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN apk add --no-cache gettext-dev

# RUN curl -sSf https://astral.sh/uv/install.sh | sh

# ENV PATH=$PATH:$HOME/.cargo/bin

# Install a WSGI server to serve our files
RUN uv pip install --system gunicorn

COPY ./src/ /app/

COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

WORKDIR /app/

COPY ./requirements.txt /app/requirements.txt

# Install your requirements from a requirements.txt file (support for poetry, pipenv should also be included at some point)
RUN uv pip install --system -r /app/requirements.txt && rm /app/requirements.txt && uv run python ./manage.py collectstatic --noinput && mkdir -p /app/database

ENTRYPOINT ["/entrypoint.sh"]