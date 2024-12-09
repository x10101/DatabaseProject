// 發送請求取得使用者資訊
async function fetchUserInfo() {
  try {
      const response = await fetch('/user_info', { method: 'GET' });

      if (response.ok) {
          const user = await response.json();
          /*
          // 顯示使用者資訊
          document.getElementById('user-info').innerHTML = `
              <p>使用者名稱: ${user.username}</p>
              <p>電子郵件: ${user.email}</p>
          `;
          */
      } else if (response.status === 401) {
          // 未登入，跳轉至登入頁面
          const data = await response.json();
          window.location.href = data.redirect;
      } else {
          // 處理其他錯誤
          //document.getElementById('status').textContent = "無法載入使用者資訊";
      }
  } catch (error) {
      //document.getElementById('status').textContent = "伺服器錯誤，請稍後再試";
  }
}

// 網頁加載後執行
window.onload = fetchUserInfo();






window.onload = function () {
  // 預設顯示 "All" 訂單內容，並為 All 按鈕加上 active 類別
  showOrders("all");

  // 登出按鈕事件監聽
  document.querySelector(".logout-btn").addEventListener("click", function () {
    alert("登出成功！");
    // 可加入跳轉或清除登入狀態的邏輯
  });
};

function showOrders(type) {
  // 隱藏所有的訂單內容
  document.querySelectorAll(".order-group").forEach((group) => {
    group.style.display = "none";
  });

  // 移除所有按鈕的 active 樣式
  document.querySelectorAll(".order-tabs td").forEach((tab) => {
    tab.classList.remove("active");
  });

  // 顯示對應的訂單內容
  if (type === "all") {
    document.getElementById("all-orders").style.display = "block";
  } else if (type === "buy") {
    document.getElementById("buy-orders").style.display = "block";
  } else if (type === "sell") {
    document.getElementById("sell-orders").style.display = "block";
  }

  // 為當前選擇的按鈕添加 active 樣式
  const selectedTab = document.querySelector(
    `td[onclick="showOrders('${type}')"]`
  );
  selectedTab.classList.add("active");
}
