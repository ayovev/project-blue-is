FROM python:3.7

RUN mkdir -p /analyzer-service

WORKDIR /analyzer-service

COPY ./requirements.txt /analyzer-service

RUN pip install -r ./requirements.txt

EXPOSE 4000

CMD ["python","app.py"]
