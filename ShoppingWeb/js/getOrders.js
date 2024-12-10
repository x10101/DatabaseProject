document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/get_orders', {
            method: 'GET',
            credentials: 'include', // 確保攜帶 cookie 以便於後端驗證用戶
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`錯誤: ${errorData.error || errorData.message}`);
            return;
        }

        const data = await response.json();
        const orders = data.orders;

        if (orders.length === 0) {
            document.getElementById('all-orders').innerHTML = '<p>您尚未有訂單紀錄。</p>';
        } else {
            let orderHTML = '';
            orders.forEach(order => {
                orderHTML += `
                    <div class="order-item" style="border-bottom: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
                        <p style="margin: 5px 0;">訂單編號：${order.order_ID}</p>
                        <p style="margin: 5px 0;">訂單日期：${order.order_date}</p>
                        <h3 style="margin-top: 10px; font-weight: bold;">訂單內容：</h3>
                        <ul style="padding-left: 20px;">
                            ${order.items.map(item => `
                                <li style="margin-bottom: 5px;">
                                    商品名稱：${item.product_name} <br>
                                    數量：${item.quantity} <br>
                                    價格：${item.price} 元
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            });

            document.getElementById('all-orders').innerHTML = orderHTML;
        }
    } catch (error) {
        console.error('無法獲取訂單資料', error);
        alert('伺服器錯誤，請稍後再試');
    }
});
