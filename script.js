// ===================================
// BREW & BITE - DIGITAL MENU
// ===================================

// 1. Products Data

let products = [
    {
        id: 1,
        name: "Classic Burger",
        category: "Food",
        price: 180,
        description: "Juicy beef burger with fresh vegetables.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"
    },
    {
        id: 2,
        name: "Italian Pizza",
        category: "Food",
        price: 220,
        description: "Fresh Italian pizza with mozzarella.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600"
    },
    {
        id: 3,
        name: "Chicken Pasta",
        category: "Food",
        price: 160,
        description: "Creamy pasta with chicken.",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600"
    },
    {
        id: 4,
        name: "French Fries",
        category: "Food",
        price: 70,
        description: "Golden crispy french fries.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600"
    },
    {
        id: 5,
        name: "Cappuccino",
        category: "Coffee",
        price: 85,
        description: "Rich espresso with steamed milk.",
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=600"
    },
    {
        id: 6,
        name: "Latte",
        category: "Coffee",
        price: 90,
        description: "Smooth coffee with creamy milk.",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600"
    },
    {
        id: 7,
        name: "Espresso",
        category: "Coffee",
        price: 65,
        description: "Strong and classic Italian coffee.",
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600"
    },
    {
        id: 8,
        name: "Iced Coffee",
        category: "Coffee",
        price: 95,
        description: "Refreshing chilled coffee.",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600"
    },
    {
        id: 9,
        name: "Fresh Orange Juice",
        category: "Drinks",
        price: 60,
        description: "Freshly squeezed orange juice.",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600"
    },
    {
        id: 10,
        name: "Strawberry Smoothie",
        category: "Drinks",
        price: 100,
        description: "Fresh strawberry smoothie.",
        image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600"
    },
    {
        id: 11,
        name: "Chocolate Cake",
        category: "Desserts",
        price: 110,
        description: "Delicious chocolate cake.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"
    },
    {
        id: 12,
        name: "Cheesecake",
        category: "Desserts",
        price: 120,
        description: "Creamy classic cheesecake.",
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600"
    }
];

// 2. Load Extra Images From APIs

async function loadApiProducts() {
    try {
        const [mealResponse, drinkResponse] = await Promise.all([
            fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
            fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
        ]);

        if (!mealResponse.ok || !drinkResponse.ok) {
            throw new Error("API request failed");
        }

        const mealData = await mealResponse.json();
        const drinkData = await drinkResponse.json();

        const meal = mealData.meals?.[0];
        const drink = drinkData.drinks?.[0];

        if (meal) {
            products.push({
                id: 13,
                name: meal.strMeal,
                category: "Food",
                price: 190,
                description: "Chef's special dish.",
                image: meal.strMealThumb
            });
        }

        if (drink) {
            products.push({
                id: 14,
                name: drink.strDrink,
                category: "Drinks",
                price: 100,
                description: "Special drink from our menu.",
                image: drink.strDrinkThumb
            });
        }

    } catch (error) {
        console.log("Could not load extra API products:", error);
    }

    displayProducts();
}

// 3. Display Products

let currentCategory = "All";

function displayProducts() {
    const container = document.getElementById("products");
    const searchValue = document.getElementById("searchInput")
        .value.toLowerCase();

    container.innerHTML = "";

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            currentCategory === "All" ||
            product.category === currentCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchValue);

        return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        container.innerHTML =
            '<p class="empty-cart">No products found.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.src='https://placehold.co/600x400/302820/ffffff?text=Brew+%26+Bite'"
                >

                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>

                    <div class="product-bottom">
                        <span class="price">
                            EGP ${product.price}
                        </span>

                        <button class="add-button"
                            onclick="addToCart(${product.id})">
                            + Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// 4. Category Filters

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", function() {
        document.querySelectorAll(".filter").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        currentCategory = this.dataset.category;
        displayProducts();
    });
});

// 5. Search

document.getElementById("searchInput")
    .addEventListener("input", displayProducts);

// 6. Shopping Cart

let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("brewCart")) || [];
} catch (error) {
    cart = [];
}

function saveCart() {
    localStorage.setItem("brewCart", JSON.stringify(cart));
}

function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    toggleCart();
}

// 7. Update Cart

function updateCart() {
    const cartItems = document.getElementById("cart-items");

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty 🛒</p>';
    }

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>

                    <p>EGP ${item.price * item.quantity}</p>

                    <div class="quantity">
                        <button onclick="changeQuantity(${item.id}, -1)">-</button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>

                    <button class="remove-btn"
                        onclick="removeItem(${item.id})">
                        Remove
                    </button>
                </div>
            </div>
        `;
    });

    document.getElementById("cart-count").textContent = count;

    document.getElementById("cart-total").textContent =
        "EGP " + total;
}

// 8. Change Quantity

function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    saveCart();
    updateCart();
}

// 9. Remove Item

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);

    saveCart();
    updateCart();
}

// 10. Clear Cart

function clearCart() {
    cart = [];

    saveCart();
    updateCart();
}

// 11. Open and Close Cart

function toggleCart() {
    document.getElementById("cartPanel")
        .classList.toggle("open");

    document.getElementById("cartOverlay")
        .classList.toggle("show");
}

function closeCart() {
    document.getElementById("cartPanel")
        .classList.remove("open");

    document.getElementById("cartOverlay")
        .classList.remove("show");
}

// 12. Generate QR Code

function generateQRCode() {
    const qrContainer = document.getElementById("qrcode");
    const message = document.getElementById("qr-message");

    qrContainer.innerHTML = "";

    if (location.protocol === "file:") {
        message.textContent =
            "Publish your website online to generate a working QR Code.";
        return;
    }

    new QRCode(qrContainer, {
        text: window.location.href.split("#")[0],
        width: 150,
        height: 150,
        colorDark: "#11100e",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    message.textContent = "Scan to visit our digital menu.";
}

// 13. Start Project

updateCart();
displayProducts();
generateQRCode();
loadApiProducts();