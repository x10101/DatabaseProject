async function loadProducts() {
    try {
        const response = await fetch('/products', { method: 'GET' });
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const products = await response.json();
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // 清空列表
        
        // 渲染每個商品
        products.forEach(product => {
            const item = `
                <div class="product-item">
                    <img src="images/R10 $ 39,900.png" alt="EOS R10" />

                    <p class="product_name">
                        <span class="name"><a href="#">${product.product_name}</a></span>
                        <span class="price">${product.price}</span>
                    </p>

                    <!-- 加入購物車區域 -->
                    <div class="action-area">
                        <div class="quantity-control">
                        <button class="btn-decrease">-</button>
                        <input type="text" class="quantity" value="1" readonly />
                        <button class="btn-increase">+</button>
                        </div>
                        <button class="add-to-cart" onclick="addToCart(${product.product_id})">加入購物車</button>
                    </div>
                </div>
            `;
            productList.innerHTML += item;
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// 頁面載入時執行
window.onload = loadProducts;