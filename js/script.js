
document.addEventListener("DOMContentLoaded", () => {
    const cartCount = document.getElementById("cart-count");
    const emptyCartState = document.getElementById("cart-empty");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartSubtotal = document.getElementById("cart-subtotal");
    const clearCartButton = document.getElementById("clear-cart");
    const cartContinueButton = document.querySelector(".cart-continue");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const newsletterForm = document.getElementById("newsletter-form");
    const newsletterEmail = document.getElementById("newsletter-email");
    const newsletterMessage = document.getElementById("newsletter-message");

    const cart = [];

    const formatPrice = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

    function updateCart() {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        cartCount.textContent = totalCount;
        cartSubtotal.textContent = formatPrice(subtotal);

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "";
            emptyCartState.hidden = false;
            cartItemsContainer.hidden = true;
            return;
        }

        emptyCartState.hidden = true;
        cartItemsContainer.hidden = false;

        cartItemsContainer.innerHTML = cart
            .map(
                (item) => `
                    <div class="cart-item">
                        <div class="cart-item-top">
                            <div>
                                <p class="cart-item-name">${item.name}</p>
                                <span class="cart-item-price">${formatPrice(item.price)} each</span>
                            </div>
                            <button type="button" class="cart-item-remove" data-action="remove-item" data-name="${item.name}">Remove</button>
                        </div>

                        <div class="cart-item-actions">
                            <div class="quantity-control" aria-label="Quantity controls for ${item.name}">
                                <button type="button" data-action="decrease" data-name="${item.name}" aria-label="Decrease quantity">−</button>
                                <span>${item.quantity}</span>
                                <button type="button" data-action="increase" data-name="${item.name}" aria-label="Increase quantity">+</button>
                            </div>
                            <strong>${formatPrice(item.price * item.quantity)}</strong>
                        </div>
                    </div>
                `
            )
            .join("");
    }

    function addToCart(name, price) {
        const existingItem = cart.find((item) => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateCart();
    }

    addToCartButtons.forEach((button) => {
        const buttonLabel = button.textContent.trim();
        button.dataset.originalLabel = buttonLabel;

        button.addEventListener("click", () => {
            const name = button.dataset.name;
            const price = Number(button.dataset.price);

            addToCart(name, price);

            button.classList.add("added");
            button.textContent = "Added ✓";
            button.disabled = true;

            setTimeout(() => {
                button.textContent = button.dataset.originalLabel;
                button.classList.remove("added");
                button.disabled = false;
            }, 700);
        });
    });

    document.addEventListener("click", (event) => {
        const target = event.target.closest("button");

        if (!target) return;

        const action = target.dataset.action;
        const name = target.dataset.name;

        if (action === "increase") {
            const item = cart.find((cartItem) => cartItem.name === name);
            if (item) item.quantity += 1;
            updateCart();
        }

        if (action === "decrease") {
            const item = cart.find((cartItem) => cartItem.name === name);
            if (!item) return;

            item.quantity -= 1;
            if (item.quantity <= 0) {
                const index = cart.findIndex((cartItem) => cartItem.name === name);
                cart.splice(index, 1);
            }

            updateCart();
        }

        if (action === "remove-item") {
            const index = cart.findIndex((cartItem) => cartItem.name === name);
            if (index >= 0) {
                cart.splice(index, 1);
            }
            updateCart();
        }
    });

    clearCartButton.addEventListener("click", () => {
        cart.length = 0;
        updateCart();
    });

    cartContinueButton.addEventListener("click", () => {
        const cartDrawer = document.getElementById("cartDrawer");
        const drawerInstance = bootstrap.Offcanvas.getInstance(cartDrawer);
        if (drawerInstance) {
            drawerInstance.hide();
        }
    });

    newsletterForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = newsletterEmail.value.trim();

        if (!email || !email.includes("@") || !email.includes(".")) {
            newsletterMessage.textContent = "Please enter a valid email address.";
            newsletterMessage.classList.remove("success");
            return;
        }

        newsletterMessage.textContent = "Thank you for joining Bloom & Co.! 🌷";
        newsletterMessage.classList.add("success");
        newsletterForm.reset();
    });

    updateCart();
});
