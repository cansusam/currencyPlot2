from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import sqlite3
from sqlite3 import Error
from datetime import datetime
import atexit
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
CORS(app)

URL = 'https://www.freeforexapi.com/api/live'
DB = "finApp.db"
listOfRatios = ["USDTRY", "EURUSD", "USDXAU"]
seperator = ','
params = seperator.join(listOfRatios)
PARAMS = {'pairs':params}
last_data = {}


@app.route("/fin/data", methods=['POST','OPTIONS'])
def analyse_sentiment():
    currency = request.values['currency']
    conn = create_connection(DB)
    if conn is not None and currency in listOfRatios:
        return jsonify(
            data=select_all_currency(conn, currency)
        )
    else:
        return jsonify(
            error="Cannot create the database connection."
        )


def create_connection(db_file):
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)

    return None


def create_currency_tables(conn):
    for cur_name in listOfRatios:
        sql_create_currency_table = """ CREATE TABLE IF NOT EXISTS """ + cur_name + """ (
                                           id integer PRIMARY KEY,
                                           rate text,
                                           timestamp text
                                       ); """
        create_table(conn, sql_create_currency_table)


def create_table(conn, create_table_sql):
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)


def create_instance(conn, table_name, currency):
    sql = ''' INSERT INTO ''' + table_name + ''' (rate,timestamp)
              VALUES(?,?) '''
    cur = conn.cursor()
    cur.execute(sql, currency)
    return cur.lastrowid


def select_all_currency(conn, currency):
    cur = conn.cursor()
    cur.execute("SELECT * FROM " + currency)
    all_results = cur.fetchall()
    format_results = []
    for row in all_results:
        format_results.append({"rate": row[1], "timestamp": row[2]})
    return format_results


def select_last_currency(conn, currency):
    cur = conn.cursor()
    cur.execute("select * from " + currency + " order by id desc limit 1;")

    return cur.fetchall()


def combine_last_inserted(conn, currency):
    last_inserted = select_last_currency(conn, currency)
    if len(last_inserted) != 0:
        result = {"rate": float(last_inserted[0][1]), "timestamp": last_inserted[0][2]}
        return result
    return {}


def job():
    conn = create_connection(DB)
    if conn is not None:
        create_currency_tables(conn)
    else:
        print("Error! cannot create the database connection.")
    with conn:
        data = requests.get(url=URL, params=PARAMS).json()
        result = data['rates']
        for currency_name in listOfRatios:
            instance = result[currency_name]
            instance = {"rate": instance["rate"],
                        "timestamp": datetime.fromtimestamp(instance["timestamp"]).strftime('%Y-%m-%d %H:%M:%S')}
            last_instance = combine_last_inserted(conn, currency_name)
            if instance != last_instance:
                create_instance(conn, currency_name, (instance["rate"], instance["timestamp"]))
    return


if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=job, trigger="interval", seconds=60)
    scheduler.start()

    app.run(host='0.0.0.0', port=3010)
    atexit.register(lambda: scheduler.shutdown())
