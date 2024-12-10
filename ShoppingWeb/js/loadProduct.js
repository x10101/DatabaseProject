// 格式化價錢為 $10,000 形式
function formatPrice(price) {
    return parseInt(price).toLocaleString('en-US');
}

// 載入商品列表（可傳入查詢參數）
async function loadProducts(query = '') {
    try {
        // 建立查詢參數的 URL
        const url = query ? `/products?search=${encodeURIComponent(query)}` : '/products';
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) throw new Error('Failed to fetch products');

        const products = await response.json();
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // 清空列表

        if (products.length === 0) {
            productList.innerHTML = '<p>查無商品結果</p>';
            return;
        }

        // 渲染每個商品
        products.forEach(product => {
            const item = `
                <div class="product-item">
                    <img src="images/${product.product_id}.png" alt="${product.product_name}" />

                    <p class="product_name">
                        <span class="name">${product.product_name}</span>
                        <span class="price">$${formatPrice(product.price)}</span>
                    </p>

                    <!-- 數量控制與加入購物車 -->
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

// 搜尋商品
function searchProducts() {
    const searchInput = document.getElementById('searchInput').value.trim();
    loadProducts(searchInput); // 傳入搜尋參數，重新載入商品
}

// 頁面載入時執行
window.onload = () => {
    loadProducts();

    // 綁定搜尋按鈕事件
    document.getElementById('search-button').addEventListener('click', searchProducts);

    // 綁定輸入框的 Enter 鍵事件
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchProducts();
    });

    // 綁定清除搜尋按鈕事件
    document.getElementById('clear-search').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        loadProducts(); // 清除搜尋後重新載入所有商品
    });
};
