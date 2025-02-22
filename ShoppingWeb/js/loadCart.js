// 格式化價錢為 $10,000 形式
function formatPrice(price) {
    return parseInt(price).toLocaleString('en-US');
}

async function loadCart() {
    try {
        const cartItemsContainer = document.getElementById('cart-content');
        const totalPriceElement = document.getElementById('total-price');
        const emptyCartMessage = document.getElementById('empty-cart-message');

        // 清空購物車內容與相關顯示
        cartItemsContainer.innerHTML = ''; // 清空購物車項目
        totalPriceElement.textContent = '$ 0'; // 重置總價格

        const response = await fetch('/show_cart', { method: 'GET' });

        if (response.status === 401) {
            alert("請先登入以查看購物車");
            window.location.href = '/loginfirst.html';
            return;
        }

        const cartItems = await response.json();
        let totalPrice = 0;

        // 如果購物車沒有商品
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `<p id="empty-cart-message" style="display: block;">購物車目前沒有商品。</p>`;
            return;
        }

        // 插入每個商品到購物車中
        cartItems.forEach(item => {
            const cartItem = document.createElement('li');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="images/${item.product_id}.png" alt="${item.product_name}" class="cart-image">
                <div class="cart-item-details">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.product_name}</span>
                        <span class="cart-item-price">$${formatPrice(item.price)}</span>
                    </div>
                    <div class="quantity-control">
                        <button class="btn-decrease" onclick="updateCartQuantity(${item.product_id}, -1)">-</button>
                        <input type="text" class="quantity" value="${item.quantity}" readonly>
                        <button class="btn-increase" onclick="updateCartQuantity(${item.product_id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.product_id})">移除</button>
            `;
            cartItemsContainer.appendChild(cartItem);

            // 累計總價格
            totalPrice += item.price * item.quantity;
        });

        // 更新總價格
        totalPriceElement.textContent = `$ ${formatPrice(totalPrice)}`;
    } catch (error) {
        console.error("載入購物車失敗", error);
        alert("無法載入購物車，請稍後再試");
    }
}


async function updateCartQuantity(productId, delta) {
    try {
        const response = await fetch('/update_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: productId, delta }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`錯誤: ${errorData.error}`);
        } else {
            //window.location.reload();
            // 成功更新數量，重新載入購物車
            await loadCart();
        }
    } catch (error) {
        console.error("更新購物車數量失敗", error);
        alert("更新購物車數量失敗，請稍後再試");
    }
}


async function removeFromCart(productId) {
    try {
        const response = await fetch('/remove_from_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: productId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`錯誤: ${errorData.error}`);
        } else {
            //window.location.reload();
            // 等待後端更新成功後，再重新載入購物車
            await loadCart();
        }
    } catch (error) {
        console.error("移除商品失敗", error);
        alert("移除商品失敗，請稍後再試");
    }
}

