"use strict";

const ZYKA = {
  whatsapp: "918102942195",
  email: "care.zykagold@gmail.com",

  products: {
    turmeric: {
      name: "Turmeric Powder",
      image: "turmeric.png",
      aliases: ["haldi", "turmeric"]
    },

    chilli: {
      name: "Red Chilli Powder",
      image: "red-chilli.png",
      aliases: ["mirch", "lal mirch", "red chilli", "chilli"]
    },

    coriander: {
      name: "Coriander Powder",
      image: "coriander.png",
      aliases: ["dhaniya", "coriander"]
    },

    cumin: {
      name: "Cumin Powder",
      image: "cumin.png",
      aliases: ["jeera", "cumin"]
    }
  }
};

let cart = [];
let wishlist = [];

function loadSavedData() {
  try {
    cart = JSON.parse(
      localStorage.getItem("zykaCartV3") || "[]"
    );

    wishlist = JSON.parse(
      localStorage.getItem("zykaWishlistV3") || "[]"
    );

    if (!Array.isArray(cart)) {
      cart = [];
    }

    if (!Array.isArray(wishlist)) {
      wishlist = [];
    }
  } catch (error) {
    cart = [];
    wishlist = [];
  }
}

function saveData() {
  localStorage.setItem(
    "zykaCartV3",
    JSON.stringify(cart)
  );

  localStorage.setItem(
    "zykaWishlistV3",
    JSON.stringify(wishlist)
  );

  updateCounts();
}

function getProduct(id) {
  return ZYKA.products[id] || null;
}

function getPack(id) {
  const select = document.querySelector(
    `[data-pack="${id}"]`
  );

  return select ? select.value : "100g";
}

function updateCounts() {
  const cartCount =
    cart.reduce(
      (total, item) =>
        total + Number(item.qty || 0),
      0
    );

  const cartCountEl =
    document.getElementById(
      "cartCount"
    );

  const wishlistCountEl =
    document.getElementById(
      "wishlistCount"
    );

  if (cartCountEl) {
    cartCountEl.textContent =
      cartCount;
  }

  if (wishlistCountEl) {
    wishlistCountEl.textContent =
      wishlist.length;
  }
}

/* =========================
   MENU
========================= */

function setupMenu() {
  const menuBtn =
    document.getElementById(
      "menuBtn"
    );

  const nav =
    document.getElementById(
      "mainNav"
    );

  if (!menuBtn || !nav) {
    return;
  }

  menuBtn.addEventListener(
    "click",
    function () {
      nav.classList.toggle(
        "show"
      );
    }
  );

  nav
    .querySelectorAll("a")
    .forEach(function (link) {
      link.addEventListener(
        "click",
        function () {
          nav.classList.remove(
            "show"
          );
        }
      );
    });
}

/* =========================
   PRODUCT SEARCH
========================= */

function filterProducts() {
  const search =
    document.getElementById(
      "productSearch"
    );

  const filter =
    document.getElementById(
      "productFilter"
    );

  const noProducts =
    document.getElementById(
      "noProducts"
    );

  const query =
    search
      ? search.value
          .trim()
          .toLowerCase()
      : "";

  const filterValue =
    filter
      ? filter.value
      : "all";

  let visibleCount = 0;

  document
    .querySelectorAll(
      ".product-card"
    )
    .forEach(function (card) {
      const name =
        (
          card.dataset.name || ""
        ).toLowerCase();

      const tags =
        (
          card.dataset.tags || ""
        ).toLowerCase();

      const text =
        name + " " + tags;

      const matchesSearch =
        !query ||
        text.includes(query);

      let matchesFilter = true;

      if (
        filterValue === "best"
      ) {
        matchesFilter =
          tags.includes("best");
      }

      if (
        filterValue === "new"
      ) {
        matchesFilter =
          tags.includes("new");
      }

      const show =
        matchesSearch &&
        matchesFilter;

      card.hidden = !show;

      if (show) {
        visibleCount++;
      }
    });

  if (noProducts) {
    noProducts.hidden =
      visibleCount !== 0;
  }
}

function setupSearch() {
  const search =
    document.getElementById(
      "productSearch"
    );

  const filter =
    document.getElementById(
      "productFilter"
    );

  if (search) {
    search.addEventListener(
      "input",
      filterProducts
    );
  }

  if (filter) {
    filter.addEventListener(
      "change",
      filterProducts
    );
  }
}

/* =========================
   CART
========================= */

function addToCart(id) {
  const product =
    getProduct(id);

  if (!product) {
    return;
  }

  const pack =
    getPack(id);

  const existing =
    cart.find(
      function (item) {
        return (
          item.id === id &&
          item.pack === pack
        );
      }
    );

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: id,
      pack: pack,
      qty: 1
    });
  }

  saveData();
  renderCart();
  openDrawer("cart");
}

function removeFromCart(index) {
  if (!cart[index]) {
    return;
  }

  cart.splice(index, 1);

  saveData();
  renderCart();
}

function changeCartQty(
  index,
  amount
) {
  if (!cart[index]) {
    return;
  }

  cart[index].qty += amount;

  if (cart[index].qty < 1) {
    cart.splice(index, 1);
  }

  saveData();
  renderCart();
}

function renderCart() {
  const container =
    document.getElementById(
      "cartItems"
    );

  if (!container) {
    return;
  }

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-message">
        Your cart is empty.
      </div>
    `;

    return;
  }

  container.innerHTML =
    cart
      .map(
        function (item, index) {
          const product =
            getProduct(item.id);

          if (!product) {
            return "";
          }

          return `
            <div class="cart-row">

              <img
                src="${product.image}"
                alt="${product.name}"
              >

              <div>

                <h4>
                  ${product.name}
                </h4>

                <small>
                  ${item.pack}
                </small>

                <div class="qty-row">

                  <button
                    type="button"
                    data-minus="${index}">
                    −
                  </button>

                  <span>
                    ${item.qty}
                  </span>

                  <button
                    type="button"
                    data-plus="${index}">
                    +
                  </button>

                </div>

              </div>

              <button
                type="button"
                class="remove-item"
                data-remove="${index}">
                ×
              </button>

            </div>
          `;
        }
      )
      .join("");

  container
    .querySelectorAll(
      "[data-minus]"
    )
    .forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            changeCartQty(
              Number(
                button.dataset.minus
              ),
              -1
            );
          }
        );
      }
    );

  container
    .querySelectorAll(
      "[data-plus]"
    )
    .forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            changeCartQty(
              Number(
                button.dataset.plus
              ),
              1
            );
          }
        );
      }
    );

  container
    .querySelectorAll(
      "[data-remove]"
    )
    .forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            removeFromCart(
              Number(
                button.dataset.remove
              )
            );
          }
        );
      }
    );
}

/* =========================
   BUY NOW
========================= */

function buyNow(id) {
  const product =
    getProduct(id);

  if (!product) {
    return;
  }

  const pack =
    getPack(id);

  cart = [
    {
      id: id,
      pack: pack,
      qty: 1
    }
  ];

  saveData();
  renderCart();
  openCheckout();
}

/* =========================
   WISHLIST
========================= */

function toggleWishlist(id) {
  const exists =
    wishlist.includes(id);

  if (exists) {
    wishlist =
      wishlist.filter(
        function (item) {
          return item !== id;
        }
      );
  } else {
    wishlist.push(id);
  }

  saveData();
  updateWishlistButtons();
  renderWishlist();
}

function updateWishlistButtons() {
  document
    .querySelectorAll(
      "[data-wishlist]"
    )
    .forEach(
      function (button) {
        const id =
          button.dataset.wishlist;

        button.classList.toggle(
          "active",
          wishlist.includes(id)
        );
      }
    );
}

function renderWishlist() {
  const container =
    document.getElementById(
      "wishlistItems"
    );

  if (!container) {
    return;
  }

  if (!wishlist.length) {
    container.innerHTML = `
      <div class="empty-message">
        Your wishlist is empty.
      </div>
    `;

    return;
  }

  container.innerHTML =
    wishlist
      .map(
        function (id) {
          const product =
            getProduct(id);

          if (!product) {
            return "";
          }

          return `
            <div class="cart-row">

              <img
                src="${product.image}"
                alt="${product.name}"
              >

              <div>

                <h4>
                  ${product.name}
                </h4>

                <small>
                  Price on WhatsApp
                </small>

                <button
                  type="button"
                  class="btn btn-outline"
                  data-wishlist-buy="${id}">
                  View Product
                </button>

              </div>

              <button
                type="button"
                class="remove-item"
                data-wishlist-remove="${id}">
                ×
              </button>

            </div>
          `;
        }
      )
      .join("");

  container
    .querySelectorAll(
      "[data-wishlist-remove]"
    )
    .forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            toggleWishlist(
              button.dataset
                .wishlistRemove
            );
          }
        );
      }
    );

  container
    .querySelectorAll(
      "[data-wishlist-buy]"
    )
    .forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            closeDrawers();

            const id =
              button.dataset
                .wishlistBuy;

            const card =
              document.querySelector(
                `[data-id="${id}"]`
              );

            if (card) {
              card.scrollIntoView({
                behavior: "smooth",
                block: "center"
              });
            }
          }
        );
      }
    );
}

/* =========================
   DRAWERS
========================= */

function openDrawer(type) {
  const overlay =
    document.getElementById(
      "drawerOverlay"
    );

  const cartDrawer =
    document.getElementById(
      "cartDrawer"
    );

  const wishlistDrawer =
    document.getElementById(
      "wishlistDrawer"
    );

  if (cartDrawer) {
    cartDrawer.classList.remove(
      "show"
    );
  }

  if (wishlistDrawer) {
    wishlistDrawer.classList.remove(
      "show"
    );
  }

  if (
    type === "cart" &&
    cartDrawer
  ) {
    renderCart();
    cartDrawer.classList.add(
      "show"
    );
  }

  if (
    type === "wishlist" &&
    wishlistDrawer
  ) {
    renderWishlist();
    wishlistDrawer.classList.add(
      "show"
    );
  }

  if (overlay) {
    overlay.classList.add(
      "show"
    );
  }
}

function closeDrawers() {
  document
    .querySelectorAll(
      ".drawer"
    )
    .forEach(
      function (drawer) {
        drawer.classList.remove(
          "show"
        );
      }
    );

  const overlay =
    document.getElementById(
      "drawerOverlay"
    );

  if (overlay) {
    overlay.classList.remove(
      "show"
    );
  }
}

function setupDrawers() {
  const cartBtn =
    document.getElementById(
      "cartBtn"
    );

  const wishlistBtn =
    document.getElementById(
      "wishlistBtn"
    );

  const mobileCartBtn =
    document.getElementById(
      "mobileCartBtn"
    );

  const mobileWishlistBtn =
    document.getElementById(
      "mobileWishlistBtn"
    );

  const overlay =
    document.getElementById(
      "drawerOverlay"
    );

  if (cartBtn) {
    cartBtn.addEventListener(
      "click",
      function () {
        openDrawer("cart");
      }
    );
  }

  if (wishlistBtn) {
    wishlistBtn.addEventListener(
      "click",
      function () {
        openDrawer(
          "wishlist"
        );
      }
    );
  }

  if (mobileCartBtn) {
    mobileCartBtn.addEventListener(
      "click",
      function () {
        openDrawer("cart");
      }
    );
  }

  if (mobileWishlistBtn) {
    mobileWishlistBtn.addEventListener(
      "click",
      function () {
        openDrawer(
          "wishlist"
        );
      }
    );
  }

  if (overlay) {
    overlay.addEventListener(
      "click",
      closeDrawers
    );
  }

  document
    .querySelectorAll(
      "[data-close-drawer]"
    )
    .forEach(
      function (button) {
        button.addEventListener(
          "click",
          closeDrawers
        );
      }
    );
}

/* =========================
   PRODUCT BUTTONS
========================= */

function setupProductButtons() {
  document
    .querySelectorAll(
      "[data-cart]"
    )
    .forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            addToCart(
              button.dataset.cart
            );
          }
        );
      }
    );

  document
    .querySelectorAll(
      "[data-buy]"
    )
    .forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            buyNow(
              button.dataset.buy
            );
          }
        );
      }
    );

  document
    .querySelectorAll(
      "[data-wishlist]"
    )
    .forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            toggleWishlist(
              button.dataset
                .wishlist
            );
          }
        );
      }
    );
}

/* =========================
   CHECKOUT
========================= */

function cartSummaryText() {
  if (!cart.length) {
    return "";
  }

  return cart
    .map(
      function (item) {
        const product =
          getProduct(item.id);

        if (!product) {
          return "";
        }

        return (
          product.name +
          " | " +
          item.pack +
          " x " +
          item.qty
        );
      }
    )
    .filter(Boolean)
    .join("\n");
}

function renderCheckoutSummary() {
  const container =
    document.getElementById(
      "checkoutSummary"
    );

  if (!container) {
    return;
  }

  if (!cart.length) {
    container.innerHTML =
      "Your cart is empty.";

    return;
  }

  container.innerHTML =
    cart
      .map(
        function (item) {
          const product =
            getProduct(item.id);

          if (!product) {
            return "";
          }

          return `
            <div>
              ${product.name}
              • ${item.pack}
              × ${item.qty}
            </div>
          `;
        }
      )
      .join("") +
    `
      <br>
      <strong>
        Current price will be confirmed on WhatsApp.
      </strong>
    `;
}

function openCheckout() {
  if (!cart.length) {
    alert(
      "Please add a product first."
    );

    return;
  }

  closeDrawers();
  renderCheckoutSummary();

  const modal =
    document.getElementById(
      "checkoutModal"
    );

  if (modal) {
    modal.classList.add(
      "show"
    );

    modal.setAttribute(
      "aria-hidden",
      "false"
    );
  }
}

function closeCheckout() {
  const modal =
    document.getElementById(
      "checkoutModal"
    );

  if (modal) {
    modal.classList.remove(
      "show"
    );

    modal.setAttribute(
      "aria-hidden",
      "true"
    );
  }
}

function sendOrderWhatsApp() {
  const name =
    document
      .getElementById(
        "customerName"
      )
      ?.value.trim() || "";

  const phone =
    document
      .getElementById(
        "customerPhone"
      )
      ?.value.trim() || "";

  const address =
    document
      .getElementById(
        "customerAddress"
      )
      ?.value.trim() || "";

  if (!name) {
    alert(
      "Please enter your name."
    );
    return;
  }

  if (!phone) {
    alert(
      "Please enter your phone number."
    );
    return;
  }

  if (!address) {
    alert(
      "Please enter delivery address."
    );
    return;
  }

  const orderId =
    "ZG" +
    Date.now()
      .toString()
      .slice(-8);

  const message =
    `Hello ZYKA GOLD,

RETAIL ORDER / PRICE ENQUIRY

Order ID: ${orderId}

${cartSummaryText()}

Name: ${name}
Phone: ${phone}
Address: ${address}

Please confirm current price, availability and delivery details.`;

  window.open(
    `https://wa.me/${ZYKA.whatsapp}?text=${encodeURIComponent(
      message
    )}`,
    "_blank"
  );
}

function setupCheckout() {
  const checkoutBtn =
    document.getElementById(
      "checkoutBtn"
    );

  const closeBtn =
    document.getElementById(
      "closeCheckout"
    );

  const whatsappBtn =
    document.getElementById(
      "checkoutWhatsApp"
    );

  const modal =
    document.getElementById(
      "checkoutModal"
    );

  if (checkoutBtn) {
    checkoutBtn.addEventListener(
      "click",
      openCheckout
    );
  }

  if (closeBtn) {
    closeBtn.addEventListener(
      "click",
      closeCheckout
    );
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener(
      "click",
      sendOrderWhatsApp
    );
  }

  if (modal) {
    modal.addEventListener(
      "click",
      function (event) {
        if (
          event.target === modal
        ) {
          closeCheckout();
        }
      }
    );
  }
}

/* =========================
   WHOLESALE
========================= */

function setupWholesale() {
  const form =
    document.getElementById(
      "wholesaleForm"
    );

  if (!form) {
    return;
  }

  form.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      const name =
        document
          .getElementById(
            "wholesaleName"
          )
          ?.value.trim() || "";

      const business =
        document
          .getElementById(
            "wholesaleBusiness"
          )
          ?.value.trim() || "";

      const phone =
        document
          .getElementById(
            "wholesalePhone"
          )
          ?.value.trim() || "";

      const city =
        document
          .getElementById(
            "wholesaleCity"
          )
          ?.value.trim() || "";

      const product =
        document
          .getElementById(
            "wholesaleProduct"
          )
          ?.value || "";

      const qty =
        document
          .getElementById(
            "wholesaleQty"
          )
          ?.value.trim() || "";

      if (
        !name ||
        !phone ||
        !city
      ) {
        alert(
          "Please enter name, phone and city/district."
        );
        return;
      }

      const message =
        `Hello ZYKA GOLD,

WHOLESALE / DISTRIBUTOR ENQUIRY

Name: ${name}
Business: ${business || "Not specified"}
Phone: ${phone}
City / District: ${city}
Product: ${product}
Approx Quantity: ${qty || "Not specified"}

Please share current wholesale price and business details.`;

      window.open(
        `https://wa.me/${ZYKA.whatsapp}?text=${encodeURIComponent(
          message
        )}`,
        "_blank"
      );
    }
  );
}

/* =========================
   ASSISTANT
========================= */

function normalizeQuestion(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectAssistantProduct(
  question
) {
  const q =
    normalizeQuestion(
      question
    );

  for (
    const id in ZYKA.products
  ) {
    const product =
      ZYKA.products[id];

    if (
      product.aliases.some(
        function (alias) {
          return q.includes(
            alias
          );
        }
      )
    ) {
      return {
        id: id,
        product: product
      };
    }
  }

  return null;
}

function assistantReply(text) {
  const q =
    normalizeQuestion(text);

  const detected =
    detectAssistantProduct(
      text
    );

  if (
    q.includes("hello") ||
    q.includes("hi") ||
    q.includes("hey") ||
    q.includes("namaste") ||
    q.includes("salam")
  ) {
    return (
      "Namaste 👋\n\n" +
      "ZYKA GOLD me aapka swagat hai.\n\n" +
      "Main products, pack sizes, price enquiry, retail order, wholesale aur support me help kar sakta hoon."
    );
  }

  if (
    detected &&
    (
      q.includes("price") ||
      q.includes("rate") ||
      q.includes("mrp") ||
      q.includes("kitna")
    )
  ) {
    return (
      "💰 " +
      detected.product.name +
      " ka current price WhatsApp par confirm kiya jayega.\n\n" +
      "Available pack sizes: 50g, 100g, 200g, 500g aur 1kg."
    );
  }

  if (
    detected &&
    (
      q.includes("pack") ||
      q.includes("size") ||
      q.includes("gram") ||
      q.includes("kg")
    )
  ) {
    return (
      detected.product.name +
      " ke pack sizes:\n\n" +
      "• 50g\n" +
      "• 100g\n" +
      "• 200g\n" +
      "• 500g\n" +
      "• 1kg"
    );
  }

  if (detected) {
    return (
      "🌶️ " +
      detected.product.name +
      "\n\n" +
      "Available sizes: 50g, 100g, 200g, 500g aur 1kg.\n\n" +
      "Current price ke liye Buy Now ya WhatsApp option use karein."
    );
  }

  if (
    q.includes("product") ||
    q.includes("masala") ||
    q.includes("spice")
  ) {
    return (
      "🌶️ ZYKA GOLD Products\n\n" +
      "• Turmeric Powder / Haldi\n" +
      "• Red Chilli Powder / Lal Mirch\n" +
      "• Coriander Powder / Dhaniya\n" +
      "• Cumin Powder / Jeera\n\n" +
      "Pack sizes: 50g, 100g, 200g, 500g aur 1kg."
    );
  }

  if (
    q.includes("price") ||
    q.includes("rate") ||
    q.includes("mrp") ||
    q.includes("cost")
  ) {
    return (
      "💰 Current product prices WhatsApp par confirm kiye jaate hain.\n\n" +
      "Product aur pack size select karke Buy Now karein."
    );
  }

  if (
    q.includes("wholesale") ||
    q.includes("bulk") ||
    q.includes("dealer") ||
    q.includes("distributor") ||
    q.includes("retailer") ||
    q.includes("shop") ||
    q.includes("dukan")
  ) {
    return (
      "📦 Wholesale Enquiry\n\n" +
      "Wholesale ke liye website ke Retailer & Distributor Enquiry form me:\n\n" +
      "• Name\n" +
      "• Business name\n" +
      "• Phone\n" +
      "• City/District\n" +
      "• Product\n" +
      "• Approx quantity\n\n" +
      "fill karke WhatsApp par quote mang sakte hain."
    );
  }

  if (
    q.includes("order") ||
    q.includes("buy") ||
    q.includes("kharid") ||
    q.includes("checkout")
  ) {
    return (
      "🛒 Order kaise karein:\n\n" +
      "1. Product choose karein\n" +
      "2. Pack size select karein\n" +
      "3. Buy Now ya Add to Cart dabayein\n" +
      "4. Continue Order karein\n" +
      "5. Name, phone aur address fill karein\n" +
      "6. WhatsApp par current price aur order confirm karein."
    );
  }

  if (
    q.includes("cart")
  ) {
    const count =
      cart.reduce(
        function (
          total,
          item
        ) {
          return (
            total +
            Number(
              item.qty || 0
            )
          );
        },
        0
      );

    return (
      "🛒 Aapke cart me " +
      count +
      " item(s) hain."
    );
  }

  if (
    q.includes("delivery") ||
    q.includes("shipping")
  ) {
    return (
      "🚚 Delivery availability, charges aur expected timing order confirmation ke waqt WhatsApp par confirm ki jayegi."
    );
  }

  if (
    q.includes("refund") ||
    q.includes("cancel")
  ) {
    return (
      "↩️ Cancellation / Refund policy footer me available hai. Final order-related help ke liye WhatsApp support use karein."
    );
  }

  if (
    q.includes("support") ||
    q.includes("contact") ||
    q.includes("whatsapp") ||
    q.includes("phone") ||
    q.includes("number")
  ) {
    return (
      "💬 ZYKA GOLD Support\n\n" +
      "WhatsApp / Phone:\n" +
      "+91 81029 42195\n\n" +
      "Email:\n" +
      ZYKA.email
    );
  }

  return (
    "🤖 Main ZYKA GOLD Smart Assistant hoon.\n\n" +
    "Aap mujhse pooch sakte hain:\n\n" +
    "• Haldi ke pack sizes\n" +
    "• Mirch ka price\n" +
    "• Wholesale kaise milega?\n" +
    "• Order kaise karu?\n" +
    "• Delivery kaise hogi?\n" +
    "• Support number kya hai?"
  );
}

function addAssistantMessage(
  text,
  type
) {
  const messages =
    document.getElementById(
      "assistantMessages"
    );

  if (!messages) {
    return;
  }

  const div =
    document.createElement(
      "div"
    );

  div.className =
    type === "user"
      ? "user-message"
      : "bot-message";

  div.textContent = text;

  messages.appendChild(div);

  messages.scrollTop =
    messages.scrollHeight;
}

function sendAssistantQuestion(
  text
) {
  const clean =
    text.trim();

  if (!clean) {
    return;
  }

  addAssistantMessage(
    clean,
    "user"
  );

  window.setTimeout(
    function () {
      addAssistantMessage(
        assistantReply(clean),
        "bot"
      );
    },
    180
  );
}

function setupAssistant() {
  const button =
    document.getElementById(
      "assistantButton"
    );

  const box =
    document.getElementById(
      "assistantBox"
    );

  const close =
    document.getElementById(
      "assistantClose"
    );

  const form =
    document.getElementById(
      "assistantForm"
    );

  const input =
    document.getElementById(
      "assistantInput"
    );

  if (button && box) {
    button.addEventListener(
      "click",
      function () {
        box.classList.toggle(
          "show"
        );
      }
    );
  }

  if (close && box) {
    close.addEventListener(
      "click",
      function () {
        box.classList.remove(
          "show"
        );
      }
    );
  }

  if (form && input) {
    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        sendAssistantQuestion(
          input.value
        );

        input.value = "";
      }
    );
  }

  document
    .querySelectorAll(
      "[data-question]"
    )
    .forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            sendAssistantQuestion(
              button.dataset.question
            );
          }
        );
      }
    );
}

/* =========================
   START
========================= */

function startZykaGold() {
  loadSavedData();

  setupMenu();
  setupSearch();
  setupProductButtons();
  setupDrawers();
  setupCheckout();
  setupWholesale();
  setupAssistant();

  updateCounts();
  updateWishlistButtons();
  renderCart();
  renderWishlist();
  filterProducts();
}

document.addEventListener(
  "DOMContentLoaded",
  startZykaGold
);
