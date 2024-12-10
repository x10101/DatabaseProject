// 格式化價錢為 $10,000 形式
function formatPrice(price) {
    return parseInt(price).toLocaleString('en-US');
}

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
                    <img src="images/${product.product_id}.png" alt="EOS R10" />

                    <p class="product_name">
                        <span class="name"><a href="#">${product.product_name}</a></span>
                        <span class="price">$${formatPrice(product.price)}</span>
                    </p>

                    <!-- 加入購物車區域 -->
                    <div class="action-area">
                        <div class="quantity-control">
                            <button class="btn-decrease" onclick="changeQuantity(${product.product_id}, -1)">-</button>
                            <input id="quantity-${product.product_id}" type="text" class="quantity" value="1" readonly />
                            <button class="btn-increase" onclick="changeQuantity(${product.product_id}, 1)">+</button>
                        </div>
                        <button class="add-to-cart" onclick="addToCartWithQuantity(${product.product_id})">加入購物車</button>
                    </div>
                </div>
            `;
            productList.innerHTML += item;
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// 更新數量邏輯
function changeQuantity(productId, delta) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    let quantity = parseInt(quantityInput.value) + delta;

    // 確保數量最小值為 1
    if (quantity < 1) quantity = 1;

    quantityInput.value = quantity;
}

// 加入購物車並帶入數量
function addToCartWithQuantity(productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value);

    addToCart(productId, quantity);
}


// 頁面載入時執行
window.onload = loadProducts;