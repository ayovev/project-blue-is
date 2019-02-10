FROM python:3.7

RUN mkdir -p /analyzer-service

WORKDIR /analyzer-service

COPY requirements.txt ./

RUN pip3 install -r ./requirements.txt

COPY . .

EXPOSE 4000

HEALTHCHECK --interval=1m \
            --timeout=10s \
            --retries=3 \
            CMD curl --fail --silent http://localhost:4000/status || exit 1

CMD ["python","app.py"]
