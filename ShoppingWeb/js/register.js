// 綁定事件 (為表單綁定 submit 事件)
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // 防止表單默認提交行為，改用 JS 發送資料

    // 獲取表單資料
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // 確認密碼是否一致
    if (password !== confirmPassword) {
        alert('密碼與確認密碼不一致，請重新輸入');
        return; // 停止執行
    }

    try {
        // 發送請求
        const response = await fetch('http://127.0.0.1:5000/register', {                 // 使用 fetch API 發送 HTTP POST 請求到後端 /register 路徑
            method: 'POST',                                         // 指定請求方法為 POST
            headers: { 'Content-Type': 'application/json' },        // 告訴伺服器這是 JSON 格式的資料
            body: JSON.stringify({ username, email, password }),    // 將 username、email 和 password 包裝成 JSON 字符串傳送
        });
        const result = await response.json();   // 使用 response.json() 解析後端回應的 JSON 資料
        alert(response);
        if (response.ok) {                      // 成功處理
            alert(result.message);
            window.location.href = '/login';    // 註冊成功後跳轉到登入頁面
        } else {                                // 錯誤處理
            alert(result.error);
        }
    }
    // 錯誤捕獲 
    catch (error) {
        alert('伺服器錯誤，請稍後再試');
    }
});