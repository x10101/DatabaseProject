from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, flash, redirect, url_for
import pyodbc

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # 設定 session 加密密鑰

# 資料庫連接
def conn():
    try:
        connect = pyodbc.connect(
            'DRIVER={SQL Server};'
            'SERVER=WIN-SQL5CNC3OSL;'
            'DATABASE=DB;'
            'Trusted_Connection=yes;'
        )
        print("連線成功")
        return connect
    except Exception as e:
        print(f"連線失敗: {e}")
        return None

conn()

if __name__ == '__main__':
    app.run(debug=True)

# 資料庫操作
