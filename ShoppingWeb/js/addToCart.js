// 加入購物車功能
async function addToCart(productId, quantity) {
    try {
        const response = await fetch('/add_to_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: productId, quantity: quantity }),
        });

        if (response.status === 401) {
            // 使用者未登入，跳轉至登入頁面
            alert("請先登入再加入購物車");
            window.location.href = '/loginfirst.html';
        } else if (!response.ok) {
            // 其他錯誤
            const errorData = await response.json();
            alert(`錯誤: ${errorData.error}`);
        } else {
            // 成功加入購物車
            const result = await response.json();
            alert(result.message);
            loadCart(); // 重新載入購物車內容
        }
    } catch (error) {
        console.error("加入購物車失敗", error);
        alert("加入購物車失敗，請稍後再試");
    }
}
