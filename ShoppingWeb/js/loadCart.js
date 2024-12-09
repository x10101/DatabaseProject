async function loadCart() {
    try {
        const response = await fetch('/show_cart', { method: 'GET' });

        if (response.status === 401) {
            // 尚未登入，跳轉到登入頁面
            alert("請先登入以查看購物車");
            window.location.href = '/loginfirst.html';
            return;
        }

        const cartItems = await response.json();

        // 獲取購物車元素
        const cartItemsContainer = document.getElementById('cart-content');
        const totalPriceElement = document.getElementById('total-price');
        const emptyCartMessage = document.getElementById('empty-cart-message');

        // 清空購物車
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        // 如果購物車沒有商品
        if (cartItems.length === 0) {
            emptyCartMessage.style.display = 'block';
            totalPriceElement.textContent = '$ 0';
            return;
        }

        emptyCartMessage.style.display = 'none'; // 隱藏空購物車訊息

        // 插入每個商品到購物車中
        cartItems.forEach(item => {
            const listItem = `
                <li class="cart-item">
                    <span class="item-name">${item.product_name}</span>
                    <span class="item-quantity">數量: ${item.quantity}</span>
                    <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                </li>
            `;
            cartItemsContainer.innerHTML += listItem;

            // 累計總價格
            totalPrice += item.price * item.quantity;
        });

        // 更新總價格
        totalPriceElement.textContent = `$ ${totalPrice.toFixed(2)}`;
    } catch (error) {
        console.error("載入購物車失敗", error);
        alert("無法載入購物車，請稍後再試");
    }
}

// 在頁面載入時執行
window.onload = loadCart();
