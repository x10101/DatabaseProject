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
            "SELECT member_ID, password FROM member WHERE email = ?",
            (email,)
        )
        member_ID, hashed_password = cursor.fetchone()        # 取得第一筆查詢結果
        '''
        print("member")
        print(member_name)
        print("password:")
        print(hashed_password)
        '''
        cursor.close()
        db_conn.close()

        if hashed_password and check_password_hash(hashed_password, password):  # 驗證密碼是否正確
            session['user_id'] = member_ID  # 設置 session，表示用戶已登入
            return jsonify({"message": "登入成功"}), 200
        else:
            return jsonify({"error": "用戶名或密碼錯誤"}), 401
    except Exception as e:
        return jsonify({"error": f"伺服器錯誤: {e}"}), 500

# 使用者登出
@app.route('/logoutWeb', methods=['POST'])
def logout():
    """使用者登出功能"""
    try:
        session.clear()  # 清除伺服器端的 session 資料
        response = jsonify({"message": "登出成功"})  # 返回 JSON 格式的成功訊息
        response.set_cookie('session', '', expires=0)  # 清除瀏覽器的 session cookie
        return response
    except Exception as e:
        return jsonify({"error": "登出失敗", "message": str(e)}), 500

# 查詢使用者資訊
@app.route('/user_info', methods=['GET'])
def user_info():
    if 'user_id' not in session:  # 未登入，跳轉到登入頁面
        return jsonify({"redirect": "/loginfirst.html"}), 401
    
    try:
        # 查詢使用者資訊
        db_conn = conn()
        cursor = db_conn.cursor()
        cursor.execute("SELECT member_ID, memberName, email FROM member WHERE member_ID = ?", (session['user_id'],))
        user = cursor.fetchone()
        cursor.close()
        db_conn.close()

        if user:
            return jsonify({
                "id": user.member_ID,
                "username": user.memberName,
                "email": user.email
            }), 200
        else:
            return jsonify({"error": "使用者不存在"}), 404
    except Exception as e:
        return jsonify({"error": f"伺服器錯誤: {e}"}), 500

# 取得所有商品
@app.route('/products', methods=['GET'])
def get_products():
    try:
        # 獲取查詢參數
        search_query = request.args.get('search', '').strip()

        db_conn = conn()
        cursor = db_conn.cursor()

        if search_query:
            # 如果有查詢參數，執行模糊搜尋
            cursor.execute("""
                SELECT product_ID, name, price 
                FROM product 
                WHERE released = 1 AND name LIKE ?
            """, (f'%{search_query}%',))
        else:
            # 沒有參數，返回所有商品
            cursor.execute("""
                SELECT product_ID, name, price 
                FROM product 
                WHERE released = 1
            """)

        products = cursor.fetchall()
        cursor.close()
        db_conn.close()

        # 格式化結果
        product_list = [
            {"product_id": row[0], "product_name": row[1], "price": row[2]}
            for row in products
        ]

        return jsonify(product_list)
    except Exception as e:
        return jsonify({"error": "無法獲取商品", "message": str(e)}), 500

    
# 加入購物車 API
@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    if 'user_id' not in session:
        return jsonify({"error": "未登入"}), 401

    user_id = session['user_id']
    data = request.json
    product_id = data.get('product_id')
    quantity = data.get('quantity')

    try:
        db_conn = conn()
        cursor = db_conn.cursor()

        # 檢查商品是否存在
        cursor.execute("SELECT COUNT(*) FROM product WHERE product_ID = ? AND released = 1", (product_id,))
        if cursor.fetchone()[0] == 0:
            return jsonify({"error": "商品不存在或未上架"}), 404

        # 檢查購物車是否已有該商品
        cursor.execute("SELECT amount FROM cart WHERE customer_ID = ? AND product_ID = ?", (user_id, product_id))
        result = cursor.fetchone()

        if result:
            # 若商品已存在於購物車，更新數量
            cursor.execute("""
                UPDATE cart
                SET amount = amount + ?
                WHERE customer_ID = ? AND product_ID = ?
            """, (quantity, user_id, product_id))
        else:
            # 否則新增一筆商品至購物車
            cursor.execute("""
                INSERT INTO cart (customer_ID, product_ID, amount)
                VALUES (?, ?, ?)
            """, (user_id, product_id, quantity))

        db_conn.commit()
        cursor.close()
        db_conn.close()

        return jsonify({"message": "成功加入購物車"})
    except Exception as e:
        return jsonify({"error": "內部伺服器錯誤", "message": str(e)}), 500


# 列印購物車
@app.route('/show_cart', methods=['GET'])
def get_cart():
    if 'user_id' not in session:
        return jsonify({"error": "未登入"}), 401

    user_id = session['user_id']

    try:
        db_conn = conn()
        cursor = db_conn.cursor()
        # 查詢使用者購物車的商品資訊
        cursor.execute("""
            SELECT p.product_ID, p.name, p.price, c.amount
            FROM cart c
            JOIN product p ON c.product_ID = p.product_ID
            WHERE c.customer_ID = ?
        """, (user_id,))
        cart_items = cursor.fetchall()
        cursor.close()
        db_conn.close()

        # 將結果轉換為 JSON 格式
        return jsonify([{
            "product_id": item[0],
            "product_name": item[1],
            "price": int(item[2]),
            "quantity": item[3]
        } for item in cart_items])
    except Exception as e:
        return jsonify({"error": "伺服器錯誤", "message": str(e)}), 500

@app.route('/update_cart', methods=['POST'])
def update_cart():
    if 'user_id' not in session:
        return jsonify({"error": "未登入"}), 401

    user_id = session['user_id']
    data = request.json
    product_id = data.get('product_id')
    delta = data.get('delta', 0)

    if not product_id or delta == 0:
        return jsonify({"error": "參數錯誤"}), 400

    try:
        db_conn = conn()
        cursor = db_conn.cursor()

        # 檢查當前商品數量
        cursor.execute("""
            SELECT amount FROM cart
            WHERE customer_ID = ? AND product_ID = ?
        """, (user_id, product_id))
        current_quantity = cursor.fetchone()

        if not current_quantity:
            return jsonify({"error": "商品不存在於購物車"}), 404

        new_quantity = current_quantity[0] + delta

        if new_quantity > 0:
            # 更新數量
            cursor.execute("""
                UPDATE cart
                SET amount = ?
                WHERE customer_ID = ? AND product_ID = ?
            """, (new_quantity, user_id, product_id))
        else:
            # 如果數量減到 0，刪除商品
            cursor.execute("""
                DELETE FROM cart
                WHERE customer_ID = ? AND product_ID = ?
            """, (user_id, product_id))

        db_conn.commit()
        cursor.close()
        db_conn.close()

        return jsonify({"message": "成功更新購物車"})
    except Exception as e:
        return jsonify({"error": "伺服器錯誤", "message": str(e)}), 500

@app.route('/remove_from_cart', methods=['POST'])
def remove_from_cart():
    if 'user_id' not in session:
        return jsonify({"error": "未登入"}), 401

    user_id = session['user_id']
    data = request.json
    product_id = data.get('product_id')

    if not product_id:
        return jsonify({"error": "參數錯誤"}), 400

    try:
        db_conn = conn()
        cursor = db_conn.cursor()

        # 刪除該商品
        cursor.execute("""
            DELETE FROM cart
            WHERE customer_ID = ? AND product_ID = ?
        """, (user_id, product_id))

        if cursor.rowcount == 0:
            return jsonify({"error": "商品不存在於購物車"}), 404

        db_conn.commit()
        cursor.close()
        db_conn.close()

        return jsonify({"message": "商品已從購物車移除"})
    except Exception as e:
        return jsonify({"error": "伺服器錯誤", "message": str(e)}), 500



# 送出訂單 API
@app.route('/create_order', methods=['POST'])
def create_order():
    if 'user_id' not in session:
        return jsonify({"error": "未登入"}), 401

    user_id = session['user_id']
    data = request.json  # 前端傳遞的購物車內容

    try:
        db_conn = conn()
        cursor = db_conn.cursor()

        # 建立訂單主表記錄
        cursor.execute("""
            INSERT INTO orderlist (customer_ID, order_date)
            OUTPUT INSERTED.order_ID
            VALUES (?, CAST(GETDATE() AS DATE))
        """, (user_id,))
        order_id = cursor.fetchone()[0]  # 獲取 SCOPE_IDENTITY() 的結果

        # 將每個購物車項目插入訂單詳情表
        for item in data.get('cart_items', []):
            cursor.execute("""
                INSERT INTO order_details (order_ID, product_ID, quantity)
                VALUES (?, ?, ?)
            """, (order_id, item['product_id'], item['quantity']))

        # 清空購物車
        cursor.execute("DELETE FROM cart WHERE customer_ID = ?", (user_id,))

        db_conn.commit()
        cursor.close()
        db_conn.close()

        return jsonify({"message": "訂單已成功送出", "order_id": order_id})
    except Exception as e:
        return jsonify({"error": "伺服器錯誤", "message": str(e)}), 500
    
@app.route('/get_orders', methods=['GET'])
def get_orders():
    if 'user_id' not in session:
        return jsonify({"error": "未登入"}), 401

    user_id = session['user_id']
    try:
        db_conn = conn()
        cursor = db_conn.cursor()

        # 查詢該用戶的所有訂單
        cursor.execute("""
            SELECT order_ID, order_date FROM orderlist
            WHERE customer_ID = ?
            ORDER BY order_date DESC
        """, (user_id,))
        orders = cursor.fetchall()

        # 查詢每個訂單的詳細內容
        order_details = []
        for order in orders:
            order_id = order[0]
            cursor.execute("""
                SELECT product_ID, quantity FROM order_details
                WHERE order_ID = ?
            """, (order_id,))
            items = cursor.fetchall()

            order_items = []
            for item in items:
                cursor.execute("""
                    SELECT name, price FROM product
                    WHERE product_ID = ?
                """, (item[0],))
                product = cursor.fetchone()
                order_items.append({
                    'product_name': product[0],
                    'quantity': item[1],
                    'price': product[1]
                })

            order_details.append({
                'order_ID': order[0],
                'order_date': order[1],
                'items': order_items
            })

        cursor.close()
        db_conn.close()

        return jsonify({"orders": order_details})

    except Exception as e:
        return jsonify({"error": "伺服器錯誤", "message": str(e)}), 500





















# 啟動 flask 應用
if __name__ == '__main__':      # 確認程式是被直接執行，而非作為模組被導入
    app.run(debug=True, host='0.0.0.0', port=5000)         # 啟動 Flask 開發伺服器 (開啟除錯模式)

'''
# test
for rule in app.url_map.iter_rules():
    print(f"Route: {rule} -> {rule.endpoint}")
'''