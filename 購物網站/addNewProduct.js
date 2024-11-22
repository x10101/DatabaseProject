document.addEventListener('DOMContentLoaded', function() {
    // 初始化本地存儲的商品數據
    let products = JSON.parse(localStorage.getItem('products')) || [];
  
    // 商品表單提交處理
    const addProductForm = document.getElementById('addProductForm');
    addProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
  
        // 獲取表單數據
        const brand = document.getElementById('productBrand').value;
        const name = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const quantity = document.getElementById('productQuantity').value;     
        const description = document.getElementById('productDescription').value;  // 獲取商品說明
        const imageFile = document.getElementById('productImage').files[0];
  
        // 使用 FileReader 讀取圖片
        const reader = new FileReader();
        reader.onload = function(e) {
            // 創建新商品對象
            const newProduct = {
                id: Date.now(),
                name: name,
                price: price,
                brand: brand,
                description: description,  // 加入商品說明
                quantity: quantity,        // 加入商品數量
                image: e.target.result,
                active: true
            };
  
            // 添加到商品列表
            products.push(newProduct);
  
            // 保存到本地存儲
            localStorage.setItem('products', JSON.stringify(products));
  
            // 返回 My Shop 頁面
            window.location.href = 'my_shop.html';
        };
  
        if (imageFile) {
            reader.readAsDataURL(imageFile);
        }
    });
});
