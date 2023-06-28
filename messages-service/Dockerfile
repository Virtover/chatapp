FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /messages-service

COPY ./requirements.txt /messages-service/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /messages-service/requirements.txt

COPY ./app /messages-service/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8002", "--reload"]