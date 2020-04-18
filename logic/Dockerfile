FROM python:3.7

RUN pip3 install --upgrade pip

COPY cur.py /
COPY finApp.db /
COPY requirements.txt /

RUN pip3 install -r ./requirements.txt

WORKDIR .

CMD python3 cur.py
