document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // 阻止表單默認提交行為

    // 獲取表單資料
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // 發送 POST 請求到後端 /login 路由
        const response = await fetch('/loginWeb', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }), // 傳送 JSON 格式的登入資料
        });

        const result = await response.json(); // 解析後端回應

        if (response.ok) {
            alert(result.message); // 登入成功提示
            window.location.href = '/dashboard'; // 導向登入後的主頁
        } else {
            alert(result.error); // 顯示錯誤提示
        }
    } catch (error) {
        alert('伺服器錯誤，請稍後再試');
    }
});
