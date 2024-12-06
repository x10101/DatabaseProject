from flask import Flask, render_template, request, jsonify
import pyodbc

app = Flask(__name__)

# 資料庫連線設定
def get_db_connection():
    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=WIN-SQL5CNC3OSL;"  # 資料庫伺服器
        "DATABASE=DB;"  # 資料庫名稱
        "UID=G08WS;"  # 使用者名稱
        "PWD=sPxV=239150;"  # 密碼
    )
    return conn

'''
@app.route('/')
def index():
    return render_template('index.html')

# 查詢資料庫的範例
@app.route('/fetch', methods=['GET'])
def fetch_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM your_table_name")
    rows = cursor.fetchall()
    conn.close()

    # 格式化查詢結果
    data = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
    return jsonify(data)

# 插入資料的範例
@app.route('/add', methods=['POST'])
def add_data():
    name = request.form.get('name')
    price = request.form.get('price')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO your_table_name (name, price) VALUES (?, ?)", (name, price))
    conn.commit()
    conn.close()

    return jsonify({"message": "Data added successfully!"})

if __name__ == '__main__':
    app.run(debug=True)
'''