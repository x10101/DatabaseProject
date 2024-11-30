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
