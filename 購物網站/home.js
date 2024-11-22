document.addEventListener("DOMContentLoaded", () => {
    const cartButton = document.getElementById("cart-btn");
    const shoppingCart = document.getElementById("shopping-cart");
    const closeCartButton = document.getElementById("close-cart");
    const cartOverlay = document.createElement("div");
    const cartContent = shoppingCart.querySelector(".cart-content");
    let cartItems = []; // 用於保存購物車內的商品

    // 建立遮罩背景
    cartOverlay.id = "cart-overlay";
    document.body.appendChild(cartOverlay);

    cartButton.addEventListener("click", () => {
        shoppingCart.classList.toggle("cart-visible");
        cartOverlay.classList.toggle("visible");
    
        // 禁用頁面滾動
        if (shoppingCart.classList.contains("cart-visible")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    });
    
    cartOverlay.addEventListener("click", () => {
        shoppingCart.classList.remove("cart-visible");
        cartOverlay.classList.remove("visible");
    
        // 恢復頁面滾動
        document.body.style.overflow = "";
    });
    

    
    // 點擊「加入購物車」按鈕
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const productItem = e.target.closest(".product-item");
            const productName = productItem.querySelector(".name a").textContent;
            const productPrice = productItem.querySelector(".price").textContent;
            const productImage = productItem.querySelector("img").src; // 取得圖片路徑
            const quantityInput = productItem.querySelector(".quantity");
            const quantity = parseInt(quantityInput.value);

            // 檢查商品是否已存在於購物車
            const existingItem = cartItems.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity += quantity; // 增加數量
            } else {
                // 添加新商品
                cartItems.push({
                    name: productName,
                    price: productPrice,
                    quantity,
                    image: productImage // 將圖片路徑加入
                });
            }

            // 更新購物車內容
            updateCart();

            // 顯示提示訊息
            alert(`${productName} 已加入購物車！`);
        });
    });

    // 更新購物車內容
    function updateCart() {
        const cartItemsContainer = cartContent.querySelector('.cart-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        cartItemsContainer.innerHTML = ''; // 清空購物車內容
    
        if (cartItems.length === 0) {
            emptyCartMessage.style.display = 'block'; // 顯示無商品訊息
        } else {
            emptyCartMessage.style.display = 'none'; // 隱藏無商品訊息
    
            cartItems.forEach((item, index) => {
                const cartItem = document.createElement('li');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-image">
                    <div class="cart-item-details">
                        <div class="cart-item-info">
                            <span class="cart-item-name">${item.name}</span>
                            <span class="cart-item-price">${item.price}</span>
                        </div>
                        <div class="quantity-control">
                            <button class="btn-decrease" data-index="${index}">-</button>
                            <input type="text" class="quantity" value="${item.quantity}" readonly />
                            <button class="btn-increase" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-index="${index}">刪除</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
    
            // 綁定數量控制和刪除按鈕事件
            bindCartItemEvents();
        }
        // 更新總金額
        updateTotalPrice();
    }
    
    // 為數量控制與刪除按鈕綁定事件
    function bindCartItemEvents() {
        const removeButtons = cartContent.querySelectorAll('.remove-item');

        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cartItems.splice(index, 1); // 從購物車刪除對應商品
                updateCart(); // 重新渲染購物車
            });
        });

        const decreaseButtons = cartContent.querySelectorAll('.btn-decrease');
        const increaseButtons = cartContent.querySelectorAll('.btn-increase');

        decreaseButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (cartItems[index].quantity > 1) {
                    cartItems[index].quantity--;
                    updateCart();
                }
            });
        });

        increaseButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (cartItems[index].quantity < 10) { // 假設最大數量為10
                    cartItems[index].quantity++;
                    updateCart();
                }
            });
        });
    }
    

    // 更新總金額
    function updateTotalPrice() {
        const totalPrice = cartItems.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', '').replace(',', ''));
            return total + (price * item.quantity);
        }, 0);

        // 使用 Intl.NumberFormat 格式化總金額，並加上 $ 符號
        const formattedTotalPrice = new Intl.NumberFormat().format(totalPrice);

        // 顯示格式化後的總金額
        document.getElementById('total-price').textContent = `$ ${formattedTotalPrice}`;
    }
  


    // 初始化商品數據
    let products = [];

    // 靜態商品數據（從頁面獲取）
    const staticProductItems = document.querySelectorAll('.product-item');
    staticProductItems.forEach(item => {
        products.push({
            name: item.querySelector('.name a').textContent.trim(),
            price: item.querySelector('.price').textContent.trim(),
            image: item.querySelector('img').src,
            element: item // 直接引用對應 DOM 元素
        });
    });

    // 動態商品數據（從 localStorage 獲取）
    const storedProducts = JSON.parse(localStorage.getItem('activeProducts')) || {};
    Object.values(storedProducts).flat().forEach(product => {
        products.push({
            name: product.name,
            price: `$ ${product.price}`,
            image: product.image,
            element: null // 不關聯 DOM
        });
    });

    // 綁定搜尋事件
    setupSearch(products);

    function setupSearch(products) {
        const searchInput = document.querySelector('.search-container input');
        const searchButton = document.querySelector('.search-container button:not(#clear-search)'); // 搜尋按鈕
        const clearSearchButton = document.getElementById('clear-search'); // 叉叉按鈕
        const productSections = document.querySelectorAll('.product-item'); // 靜態商品區域
        const resultsSection = document.getElementById('search-results'); // 搜尋結果區域
        const resultsContainer = resultsSection.querySelector('.results');
        const brandSections = document.querySelectorAll('.brand'); // 品牌區域
    
        // 當輸入框有內容時顯示叉叉按鈕
        searchInput.addEventListener('input', () => {
            clearSearchButton.style.display = searchInput.value.trim() ? 'inline' : 'none';
        });
    
        // 綁定叉叉按鈕點擊事件
        clearSearchButton.addEventListener('click', () => {
            searchInput.value = ''; // 清空搜尋框
            clearSearchButton.style.display = 'none'; // 隱藏叉叉按鈕
    
            // 顯示所有靜態商品並隱藏搜尋結果
            productSections.forEach(section => {
                section.style.display = 'block';
            });
            brandSections.forEach(brand => {
                brand.style.display = 'block';
            });
            resultsSection.style.display = 'none'; // 隱藏搜尋結果
        });
    
        // 搜尋邏輯函數
        function performSearch() {
            const keyword = searchInput.value.trim().toLowerCase();
    
            if (keyword === '') {
                // 若無輸入，顯示所有靜態商品，並隱藏搜尋結果
                productSections.forEach(section => {
                    section.style.display = 'block';
                });
                brandSections.forEach(brand => {
                    brand.style.display = 'block'; // 顯示所有品牌
                });
                resultsSection.style.display = 'none';
                return;
            }
    
            // 清空搜尋結果區域
            resultsContainer.innerHTML = '';
    
            // 過濾符合條件的商品
            const matchingProducts = products.filter(product =>
                product.name.toLowerCase().includes(keyword)
            );
    
            if (matchingProducts.length === 0) {
                // 沒有匹配的商品
                resultsContainer.innerHTML = '<p>找不到符合的商品。</p>';
                resultsSection.style.display = 'block';
            } else {
                // 顯示搜尋結果區域的匹配商品
                matchingProducts.forEach(product => {
                    if (product.element) {
                        // 靜態商品，顯示在頁面上
                        product.element.style.display = 'block';
                    } else {
                        // 動態商品，顯示在搜尋結果區域
                        const resultItem = document.createElement('div');
                        resultItem.classList.add('result-item');
                        resultItem.innerHTML = `
                            <img src="${product.image}" alt="${product.name}" class="result-image">
                            <span class="result-name">${product.name}</span>
                            <span class="result-price">${product.price}</span>
                        `;
                        resultsContainer.appendChild(resultItem);
                    }
                });
                resultsSection.style.display = 'block';
            }
    
            // 隱藏不符合的靜態商品
            products.forEach(product => {
                if (product.element && !product.name.toLowerCase().includes(keyword)) {
                    product.element.style.display = 'none';
                }
            });
    
            brandSections.forEach(brand => {
                // 獲取品牌下的商品區域
                const productSection = brand.nextElementSibling; // 假設品牌後緊接商品區域
                const productsUnderBrand = productSection.querySelectorAll('.product-item');
            
                // 判斷是否有商品顯示
                const isBrandVisible = Array.from(productsUnderBrand).some(product => product.style.display !== 'none');
            
                // 根據結果顯示或隱藏品牌
                brand.style.display = isBrandVisible ? 'block' : 'none';
            });
        }
    
        // 綁定搜尋按鈕點擊事件
        searchButton.addEventListener('click', performSearch);
    
        // 綁定搜尋框的按鍵事件
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // 阻止默認的表單提交行為（如果在表單內）
                performSearch();
            }
        });
    }
    
    
    

    // 數量控制功能（已添加的代碼）
    const quantityControls = document.querySelectorAll('.quantity-control');
    const minQuantity = 1;
    const maxQuantity = 10;
  
    quantityControls.forEach((control) => {
      const btnDecrease = control.querySelector(".btn-decrease");
      const btnIncrease = control.querySelector(".btn-increase");
      const quantityInput = control.querySelector(".quantity");
  
      btnIncrease.addEventListener("click", () => {
        let currentQuantity = parseInt(quantityInput.value);
        if (currentQuantity < maxQuantity) {
          quantityInput.value = currentQuantity + 1;
        }
        updateButtonStates();
      });
  
      btnDecrease.addEventListener("click", () => {
        let currentQuantity = parseInt(quantityInput.value);
        if (currentQuantity > minQuantity) {
          quantityInput.value = currentQuantity - 1;
        }
        updateButtonStates();
      });
  
      function updateButtonStates() {
        btnDecrease.disabled = parseInt(quantityInput.value) === minQuantity;
        btnIncrease.disabled = parseInt(quantityInput.value) === maxQuantity;
      }
  
      updateButtonStates();
    });
    

});