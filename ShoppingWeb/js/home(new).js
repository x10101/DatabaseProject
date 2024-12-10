document.addEventListener("DOMContentLoaded", () => {
    const cart = {
      items: [],
      init() {
        this.cacheElements();
        this.bindEvents();
        this.createOverlay();
        this.loadProducts();
      },
      cacheElements() {
        this.cartButton = document.getElementById("cart-btn");
        this.shoppingCart = document.getElementById("shopping-cart");
        this.cartOverlay = document.createElement("div");
        this.cartContent = this.shoppingCart.querySelector(".cart-content");
        this.cartItemsContainer = this.cartContent.querySelector(".cart-items");
        this.emptyCartMessage = document.getElementById("empty-cart-message");
        this.totalPriceDisplay = document.getElementById("total-price");
        this.addToCartButtons = document.querySelectorAll(".add-to-cart");
      },
      bindEvents() {
        this.cartButton.addEventListener("click", () => this.toggleCart());
        this.cartOverlay.addEventListener("click", () => this.closeCart());
        this.addToCartButtons.forEach((button) => {
          button.addEventListener("click", (e) => this.addToCart(e));
        });
      },
      createOverlay() {
        this.cartOverlay.id = "cart-overlay";
        document.body.appendChild(this.cartOverlay);
      },
      toggleCart() {
        this.shoppingCart.classList.toggle("cart-visible");
        this.cartOverlay.classList.toggle("visible");
        document.body.style.overflow = this.shoppingCart.classList.contains("cart-visible") ? "hidden" : "";
      },
      closeCart() {
        this.shoppingCart.classList.remove("cart-visible");
        this.cartOverlay.classList.remove("visible");
        document.body.style.overflow = "";
      },
      addToCart(event) {
        const product = this.extractProductData(event.target.closest(".product-item"));
        const existingItem = this.items.find((item) => item.name === product.name);
        if (existingItem) {
          existingItem.quantity += product.quantity;
        } else {
          this.items.push(product);
        }
        this.updateCart();
        alert(`${product.name} 已加入購物車！`);
      },
      extractProductData(productItem) {
        return {
          name: productItem.querySelector(".name a").textContent,
          price: productItem.querySelector(".price").textContent,
          image: productItem.querySelector("img").src,
          quantity: parseInt(productItem.querySelector(".quantity").value),
        };
      },
      updateCart() {
        this.cartItemsContainer.innerHTML = "";
        if (this.items.length === 0) {
          this.emptyCartMessage.style.display = "block";
        } else {
          this.emptyCartMessage.style.display = "none";
          this.items.forEach((item, index) => {
            this.cartItemsContainer.appendChild(this.createCartItemElement(item, index));
          });
          this.bindCartItemEvents();
        }
        this.updateTotalPrice();
      },
      createCartItemElement(item, index) {
        const cartItem = document.createElement("li");
        cartItem.classList.add("cart-item");
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
        return cartItem;
      },
      bindCartItemEvents() {
        this.cartContent.querySelectorAll(".remove-item").forEach((button) =>
          button.addEventListener("click", (e) => this.removeCartItem(e))
        );
        this.cartContent.querySelectorAll(".btn-decrease").forEach((button) =>
          button.addEventListener("click", (e) => this.decreaseQuantity(e))
        );
        this.cartContent.querySelectorAll(".btn-increase").forEach((button) =>
          button.addEventListener("click", (e) => this.increaseQuantity(e))
        );
      },
      removeCartItem(event) {
        const index = event.target.getAttribute("data-index");
        this.items.splice(index, 1);
        this.updateCart();
      },
      decreaseQuantity(event) {
        const index = event.target.getAttribute("data-index");
        if (this.items[index].quantity > 1) {
          this.items[index].quantity--;
          this.updateCart();
        }
      },
      increaseQuantity(event) {
        const index = event.target.getAttribute("data-index");
        if (this.items[index].quantity < 10) {
          this.items[index].quantity++;
          this.updateCart();
        }
      },
      updateTotalPrice() {
        const totalPrice = this.items.reduce((total, item) => {
          const price = parseFloat(item.price.replace("$", "").replace(",", ""));
          return total + price * item.quantity;
        }, 0);
        this.totalPriceDisplay.textContent = `$ ${new Intl.NumberFormat().format(totalPrice)}`;
      },
      loadProducts() {
        const staticProducts = document.querySelectorAll(".product-item");
        staticProducts.forEach((item) =>
          this.addStaticProduct({
            name: item.querySelector(".name a").textContent.trim(),
            price: item.querySelector(".price").textContent.trim(),
            image: item.querySelector("img").src,
          })
        );
        this.updateCart();
      },
      addStaticProduct(product) {
        this.items.push({ ...product, quantity: 1 });
      },
    };
  
    cart.init();
  });
  