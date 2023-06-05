FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /users-service

COPY ./requirements.txt /users-service/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /users-service/requirements.txt

COPY ./app /users-service/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
