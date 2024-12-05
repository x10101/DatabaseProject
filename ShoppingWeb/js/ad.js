function showFullscreen(img) {
  const fullscreen = document.getElementById("fullscreen");
  const fullscreenImg = document.getElementById("fullscreen-img");

  fullscreenImg.src = img.src; // 將圖片的來源設定為全屏圖片
  fullscreen.style.display = "flex"; // 顯示全屏區域
}

function closeFullscreen() {
  const fullscreen = document.getElementById("fullscreen");
  fullscreen.style.display = "none"; // 關閉全屏區域
}
