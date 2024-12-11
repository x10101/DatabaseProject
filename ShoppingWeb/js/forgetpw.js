document.getElementById('submit-reset-password').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
  
    // 簡單驗證
    if (!username || !newPassword || !confirmPassword) {
      alert('請填寫所有欄位！');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('兩次輸入的密碼不一致！');
      return;
    }
  
    try {
      // 發送請求到後端
      const response = await fetch('/reset_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, newPassword }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
        window.location.href = '/login.html'; // 重置密碼後跳轉至登入頁面
      } else {
        alert(`錯誤: ${result.error}`);
      }
    } catch (error) {
      console.error('重置密碼失敗:', error);
      alert('伺服器錯誤，請稍後再試');
    }
  });
  