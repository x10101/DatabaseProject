document.getElementById('checkout-button').addEventListener('click', async () => {
    try {
        // 獲取購物車內容
        const response = await fetch('/show_cart', { method: 'GET' });
        if (!response.ok) {
            const errorData = await response.json();
            alert(`錯誤: ${errorData.error}`);
            return;
        }
        const cartItems = await response.json();

        // 若購物車為空，提示錯誤
        if (cartItems.length === 0) {
            alert("購物車是空的，無法送出訂單！");
            return;
        }

        // 發送購物車內容至後端
        const checkoutResponse = await fetch('/create_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cart_items: cartItems }),
        });

        if (!checkoutResponse.ok) {
            const errorData = await checkoutResponse.json();
            alert(`錯誤: ${errorData.error}`);
        } else {
            const result = await checkoutResponse.json();
            alert(`訂單送出成功！訂單編號：${result.order_id}`);
            // 清空購物車內容
            loadCart();
        }
    } catch (error) {
        console.error("送出訂單失敗", error);
        alert("送出訂單失敗，請稍後再試");
    }
});
