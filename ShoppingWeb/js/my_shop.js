document.addEventListener('DOMContentLoaded', function () {
    let products = JSON.parse(localStorage.getItem('products')) || [];

    // 更新商品顯示
    function updateProductDisplay() {
        const productGrid = document.getElementById('productGrid');
        productGrid.innerHTML = '';

        const groupedProducts = products.reduce((groups, product) => {
            if (!groups[product.brand]) {
                groups[product.brand] = [];
            }
            groups[product.brand].push(product);
            return groups;
        }, {});

        Object.keys(groupedProducts).forEach((brand) => {
            const brandProducts = groupedProducts[brand];

            const brandHeader = document.createElement('h2');
            brandHeader.innerText = brand;
            productGrid.appendChild(brandHeader);

            brandProducts.forEach((product) => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.setAttribute('data-product-id', product.id);

                productCard.innerHTML = `
                    <div class="product-horizontal">
                        <div class="product-left">
                            <img src="${product.image}" alt="${product.name}" class="product-image">
                            <input type="text" class="product-name no-border" id="product-name-${product.id}" value="${product.name}" readonly>
                        </div>
                        <div class="product-right">
                            <div class="product-actions">
                                <input type="text" class="product-price no-border" id="product-price-${product.id}" value="$ ${formatPrice(product.price)}" readonly>
                                <input type="number" class="product-quantity-input no-border" id="product-quantity-${product.id}" value="${product.quantity}" min="1" readonly>
                                <button class="btn-toggle" onclick="toggleProduct(${product.id})">下架</button>
                                <button class="edit-btn" onclick="toggleEditMode(${product.id}, this)">
                                    <span class="edit-icon"></span> 編輯
                                </button>
                            </div>
                            <textarea class="product-description no-border" id="product-description-${product.id}" readonly>${product.description}</textarea>
                        </div>
                    </div>
                `;
                productGrid.appendChild(productCard);
            });
        });
    }

    // 格式化價錢為 $10,000 形式
    function formatPrice(price) {
        return parseInt(price).toLocaleString('en-US');
    }

    // 切換編輯模式
    window.toggleEditMode = function (productId, button) {
        const product = products.find((p) => p.id === productId);
        if (!product) return;

        const nameField = document.getElementById(`product-name-${productId}`);
        const priceField = document.getElementById(`product-price-${productId}`);
        const descriptionField = document.getElementById(`product-description-${productId}`);
        const quantityInput = document.getElementById(`product-quantity-${productId}`);

        const isEditing = !nameField.hasAttribute('readonly');
        if (isEditing) {
            // 儲存變更
            product.name = nameField.value;
            product.price = priceField.value.replace(/[^0-9]/g, '');
            product.description = descriptionField.value;
            product.quantity = quantityInput.value;

            // 更新顯示
            priceField.value = `$ ${formatPrice(product.price)}`;

            // 更新 localStorage
            localStorage.setItem('products', JSON.stringify(products));

            // 禁用編輯
            nameField.setAttribute('readonly', true);
            priceField.setAttribute('readonly', true);
            descriptionField.setAttribute('readonly', true);
            quantityInput.setAttribute('readonly', true);
            quantityInput.classList.add('no-border');

            // 更新按鈕文字
            button.innerHTML = `<span class="edit-icon"></span> 編輯`;
        } else {
            // 啟用編輯模式
            nameField.removeAttribute('readonly');
            priceField.removeAttribute('readonly');
            descriptionField.removeAttribute('readonly');
            quantityInput.removeAttribute('readonly');
            quantityInput.classList.remove('no-border');

            // 更新按鈕文字
            button.innerHTML = `儲存變更`;
        }
    };

    // 下架商品
    window.toggleProduct = function (productId) {
        const product = products.find((p) => p.id === productId);
        if (product) {
            const confirmAction = confirm('確定要下架這個商品嗎？');
            if (confirmAction) {
                products = products.filter((p) => p.id !== productId);
                localStorage.setItem('products', JSON.stringify(products));
                updateProductDisplay();
            }
        }
    };

    // 初始化顯示
    updateProductDisplay();
});
