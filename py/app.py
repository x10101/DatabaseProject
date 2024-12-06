'''
導入模組
Flask: 建立 web 應用程序，提供路由和處理 HTTP 請求。
    render_template: 渲染 HTML 模板，用於前端與後端交互。
    request: 處理 HTTP 請求，允許獲取 GET/POST 的數據。
    redirect, url_for: 用於實現 URL 重定向。
    session: 處理用戶的會話數據 (例如登入狀態) 。
    jsonify: 將 Python 資料結構轉換為 JSON 格式，通常用於 API 回應。
werkzeug.security: 提供密碼的加密 (generate_password_hash) 和驗證 (check_password_hash)。
pyodbc: 用於連接和操作 SQL Server 資料庫。
'''
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, flash, redirect, url_for
import pyodbc
from flask_cors import CORS

app = Flask(__name__)               # 初始化 flask 應用
CORS(app)                           # 允許跨域請求
app.secret_key = 'your_secret_key'  # 設定 session 加密密鑰

# 資料庫連接
def conn():
    try:
        connect = pyodbc.connect(           # 建立與 SQL Server 的連線
            'DRIVER={SQL Server};'        # 指定使用的 SQL Server ODBC 驅動
            'SERVER=WIN-SQL5CNC3OSL;'     # 資料庫伺服器的名稱或 IP 地址
            'DATABASE=DB;'                # 要連接的資料庫名稱
            'Trusted_Connection=yes;'     # 使用 Windows 驗證模式進行連線
        )
        print("連線成功")
        return connect
    except Exception as e:                  # 當連線失敗時，捕獲異常並輸出錯誤訊息
        print(f"連線失敗: {e}")
        return None


# 使用者註冊
@app.route('/register', methods=['POST'])   # 定義了一個名為 /register 的 API 路由，用於處理註冊請求
def register():
    # 從請求中獲取資料
    data = request.json                 # 接收 JSON 格式的資料
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # 簡單資料驗證
    if not username or not email or not password:
        return jsonify({"error": "請填寫完整的註冊資料"}), 400

    # 加密密碼
    hashed_password = generate_password_hash(password)

    try:
        # 資料庫操作
        db_conn = conn()                # 獲取資料庫連接
        cursor = db_conn.cursor()       # 使用游標執行 SQL 查詢
        cursor.execute(                 # 執行 SQL 語句，將用戶資料插入資料庫中的 users 表
            "INSERT INTO member (membername, email, password) VALUES (?, ?, ?)",
            (username, email, hashed_password)
        )
        db_conn.commit()                # 提交更改，將資料儲存到資料庫
        cursor.close()                  # 關閉游標
        db_conn.close()                 # 關閉資料庫連接

        return jsonify({"message": "註冊成功"}), 201
    # 資料庫錯誤處理
    except pyodbc.IntegrityError as e:
        if "UNIQUE" in str(e):
            return jsonify({"error": "用戶名或電子郵件已存在"}), 409
        return jsonify({"error": "資料庫操作失敗"}), 500
    # 伺服器錯誤處理
    except Exception as e:
        return jsonify({"error": f"伺服器錯誤: {e}"}), 500

# 使用者登入
@app.route('/loginWeb', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "請填寫完整登入資訊"}), 400

    try:
        # 資料庫操作
        db_conn = conn()                # 建立資料庫連接
        cursor = db_conn.cursor()       # 建立游標
        cursor.execute(                 # 查詢用戶資料
            "SELECT password FROM member WHERE email = ?",
            (email)
        )
        email = cursor.fetchone()
        cursor.close()
        db_conn.close()

        if email and check_password_hash(email[0], password):  # 驗證密碼是否正確
            session['email'] = email  # 設置 session，表示用戶已登入
            return jsonify({"message": "登入成功"}), 200
        else:
            return jsonify({"error": "用戶名或密碼錯誤"}), 401
    except Exception as e:
        return jsonify({"error": f"伺服器錯誤: {e}"}), 500










# 啟動 flask 應用
if __name__ == '__main__':      # 確認程式是被直接執行，而非作為模組被導入
    app.run(debug=True, host='0.0.0.0', port=5000)         # 啟動 Flask 開發伺服器 (開啟除錯模式)

'''
# test
for rule in app.url_map.iter_rules():
    print(f"Route: {rule} -> {rule.endpoint}")
'''