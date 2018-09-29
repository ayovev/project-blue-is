# Use an official Python runtime as a parent image
FROM python:latest

RUN mkdir -p /analyzer-service

WORKDIR /analyzer-service

RUN pip install Flask

EXPOSE 4000

CMD ["python","app.py"]
