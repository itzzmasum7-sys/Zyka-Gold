const CONFIG = {
  whatsapp: "918102942195",
  upiId: "8102942195-5@axl",
  payeeName: "ZYKA GOLD",
  currency: "INR",
  aiEndpoint: ""
};

const PRODUCTS = [
  {
    id: "turmeric",
    name: "Turmeric Powder",
    image: "turmeric.png",
    desc: "Warm, earthy spice for everyday Indian cooking.",
    badge: "BEST",
    tags: ["haldi", "turmeric", "best"],
    prices: {
      "50g": 0,
      "100g": 0,
      "200g": 0,
      "500g": 0,
      "1kg": 0
    }
  },
  {
    id: "chilli",
    name: "Red Chilli Powder",
    image: "red-chilli.png",
    desc: "Bold colour and balanced heat for Indian recipes.",
    badge: "BEST",
    tags: ["mirch", "chilli", "lal mirch", "best"],
    prices: {
      "50g": 0,
      "100g": 0,
      "200g": 0,
      "500g": 0,
      "1kg": 0
    }
  },
  {
    id: "coriander",
    name: "Coriander Powder",
    image: "coriander.png",
    desc: "Aromatic and versatile for curries, gravies and blends.",
    badge: "",
    tags: ["dhaniya", "coriander"],
    prices: {
      "50g": 0,
      "100g": 0,
      "200g": 0,
      "500g": 0,
      "1kg": 0
    }
  },
  {
    id: "cumin",
    name: "Cumin Powder",
    image: "cumin.png",
    desc: "Distinctive earthy aroma for everyday authentic dishes.",
    badge: "NEW",
    tags: ["jeera", "cumin", "new"],
    prices: {
      "50g": 0,
      "100g": 0,
      "200g": 0,
      "500g": 0,
      "1kg": 0
    }
  }
];

let cart = JSON.parse(localStorage.getItem("zykaCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("zykaWishlist") || "[]");

let coupon = {
  code: "",
  discount: 0
};

function money(n) {
  return n > 0
    ? "₹" + n.toFixed(0)
    : "WhatsApp for Price";
}

function saveState() {
  localStorage.setItem("zykaCart", JSON.stringify(cart));
  localStorage.setItem("zykaWishlist", JSON.stringify(wishlist));
  updateCounts();
}

function toggleMenu() {
  const nav = document.getElementById("navLinks");

  nav.style.display =
    nav.style.display === "flex"
      ? "none"
      : "flex";
}

function updateCounts() {
  document.getElementById("cartCount").textContent =
    cart.reduce((a, b) => a + b.qty, 0);

  document.getElementById("wishlistCount").textContent =
    wishlist.length;
}

function renderProducts() {
  const q =
    (
      document.getElementById("productSearch")?.value || ""
    )
      .toLowerCase()
      .trim();

  const filter =
    document.getElementById("productFilter")?.value || "all";

  const grid = document.getElementById("productGrid");

  const list = PRODUCTS.filter((product) => {
    const text = (
      product.name +
      " " +
      product.desc +
      " " +
      product.tags.join(" ")
    ).toLowerCase();

    const matchesSearch =
      !q || text.includes(q);

    const matchesFilter =
      filter === "all" ||
      product.tags.includes(filter);

    return matchesSearch && matchesFilter;
  });

  grid.innerHTML =
    list
      .map((product) => {
        const defaultPack = "100g";
        const price = product.prices[defaultPack] || 0;

        const active =
          wishlist.includes(product.id)
            ? "active"
            : "";

        return `
          <article class="card">

            ${
              product.badge
                ? `<span class="badge">${product.badge}</span>`
                : ""
            }

            <button
              class="wish ${active}"
              onclick="toggleWishlist('${product.id}')"
              aria-label="Wishlist"
            >
              ♡
            </button>

            <div class="product-art">
              <img
                src="${product.image}"
                alt="ZYKA GOLD ${product.name}"
              >
            </div>

            <h3>${product.name}</h3>

            <p>${product.desc}</p>

            <small>
              Pack sizes:
              50g · 100g · 200g · 500g · 1kg
            </small>

            <select
              class="pack-select"
              id="pack-${product.id}"
              onchange="updateCardPrice('${product.id}')"
            >
              ${Object.keys(product.prices)
                .map(
                  (size) =>
                    `<option>${size}</option>`
                )
                .join("")}
            </select>

            <div class="price-row">
              <strong id="price-${product.id}">
                ${money(price)}
              </strong>

              <small>Retail</small>
            </div>

            <div class="card-actions">

              <button
                class="btn outline"
                onclick="buyNow('${product.id}')"
              >
                Buy Now
              </button>

              <button
                class="btn gold"
                onclick="addToCart('${product.id}')"
              >
                Add to Cart
              </button>

            </div>

          </article>
        `;
      })
      .join("") ||
    `
      <div class="empty-state">
        No product found.
      </div>
    `;
}

function updateCardPrice(id) {
  const product =
    PRODUCTS.find(
      (item) => item.id === id
    );

  const pack =
    document.getElementById(
      "pack-" + id
    ).value;

  document.getElementById(
    "price-" + id
  ).textContent =
    money(product.prices[pack] || 0);
}

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist =
      wishlist.filter(
        (item) => item !== id
      );
  } else {
    wishlist.push(id);
  }

  saveState();
  renderProducts();

  if (
    document
      .getElementById("wishlistDrawer")
      .classList.contains("show")
  ) {
    renderWishlist();
  }
}

function addToCart(id) {
  const product =
    PRODUCTS.find(
      (item) => item.id === id
    );

  const pack =
    document.getElementById(
      "pack-" + id
    )?.value || "100g";

  const existing =
    cart.find(
      (item) =>
        item.id === id &&
        item.pack === pack
    );

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id,
      pack,
      qty: 1
    });
  }

  saveState();
  renderCart();
  openCart();
}

function buyNow(id) {
  addToCart(id);
  openCheckout();
}

function linePrice(item) {
  const product =
    PRODUCTS.find(
      (p) => p.id === item.id
    );

  return (
    (product.prices[item.pack] || 0) *
    item.qty
  );
}

function subtotal() {
  return cart.reduce(
    (sum, item) =>
      sum + linePrice(item),
    0
  );
}

function total() {
  const sub = subtotal();

  return Math.max(
    0,
    sub -
      (sub * coupon.discount) / 100
  );
}

function allPricesReady() {
  return (
    cart.length > 0 &&
    cart.every(
      (item) => linePrice(item) > 0
    )
  );
}

function openCart() {
  closeDrawers();

  document
    .getElementById("cartDrawer")
    .classList.add("show");

  document
    .getElementById("drawerOverlay")
    .classList.add("show");

  renderCart();
}

function openWishlist() {
  closeDrawers();

  document
    .getElementById("wishlistDrawer")
    .classList.add("show");

  document
    .getElementById("drawerOverlay")
    .classList.add("show");

  renderWishlist();
}

function closeDrawers() {
  document
    .querySelectorAll(".drawer")
    .forEach((drawer) =>
      drawer.classList.remove("show")
    );

  document
    .getElementById("drawerOverlay")
    .classList.remove("show");
}

function renderCart() {
  const el =
    document.getElementById(
      "cartItems"
    );

  if (!cart.length) {
    el.innerHTML = `
      <div class="empty-state">
        Your cart is empty.
      </div>
    `;
  } else {
    el.innerHTML =
      cart
        .map((item, index) => {
          const product =
            PRODUCTS.find(
              (p) =>
                p.id === item.id
            );

          return `
            <div class="cart-item">

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
                  ·
                  ${money(
                    product.prices[
                      item.pack
                    ] || 0
                  )}
                </small>

                <div class="qty-controls">

                  <button
                    onclick="changeQty(${index}, -1)"
                  >
                    −
                  </button>

                  <span>
                    ${item.qty}
                  </span>

                  <button
                    onclick="changeQty(${index}, 1)"
                  >
                    +
                  </button>

                </div>

              </div>

              <button
                class="remove"
                onclick="removeCart(${index})"
              >
                ×
              </button>

            </div>
          `;
        })
        .join("");
  }

  document.getElementById(
    "cartTotal"
  ).textContent =
    allPricesReady()
      ? money(total())
      : "Price on WhatsApp";
}

function renderWishlist() {
  const el =
    document.getElementById(
      "wishlistItems"
    );

  const list =
    wishlist
      .map((id) =>
        PRODUCTS.find(
          (product) =>
            product.id === id
        )
      )
      .filter(Boolean);

  if (!list.length) {
    el.innerHTML = `
      <div class="empty-state">
        No favourites yet.
      </div>
    `;

    return;
  }

  el.innerHTML =
    list
      .map(
        (product) => `
          <div class="cart-item">

            <img
              src="${product.image}"
              alt="${product.name}"
            >

            <div>

              <h4>
                ${product.name}
              </h4>

              <small>
                ${product.desc}
              </small>

              <button
                class="btn outline full"
                onclick="
                  closeDrawers();
                  document
                    .getElementById(
                      'pack-${product.id}'
                    )
                    ?.scrollIntoView({
                      behavior:'smooth'
                    });
                "
              >
                View Product
              </button>

            </div>

            <button
              class="remove"
              onclick="toggleWishlist('${product.id}')"
            >
              ×
            </button>

          </div>
        `
      )
      .join("");
}

function changeQty(index, change) {
  cart[index].qty += change;

  if (cart[index].qty < 1) {
    cart.splice(index, 1);
  }

  saveState();
  renderCart();
}

function removeCart(index) {
  cart.splice(index, 1);

  saveState();
  renderCart();
}

function applyCoupon() {
  const code =
    (
      document.getElementById(
        "couponInput"
      ).value || ""
    )
      .trim()
      .toUpperCase();

  coupon = {
    code: "",
    discount: 0
  };

  if (code === "WELCOME5") {
    coupon = {
      code: "WELCOME5",
      discount: 5
    };

    alert(
      "WELCOME5 applied: 5% off."
    );
  } else if (code) {
    alert(
      "Coupon not valid."
    );
  }

  renderCart();
}

function openCheckout() {
  if (!cart.length) {
    alert(
      "Cart is empty."
    );

    return;
  }

  closeDrawers();

  document
    .getElementById(
      "checkoutModal"
    )
    .classList.add("show");

  document
    .getElementById(
      "checkoutModal"
    )
    .setAttribute(
      "aria-hidden",
      "false"
    );

  renderCheckout();
}

function closeCheckout() {
  document
    .getElementById(
      "checkoutModal"
    )
    .classList.remove("show");

  document
    .getElementById(
      "checkoutModal"
    )
    .setAttribute(
      "aria-hidden",
      "true"
    );
}

function renderCheckout() {
  const lines =
    cart
      .map((item) => {
        const product =
          PRODUCTS.find(
            (p) =>
              p.id === item.id
          );

        return `
          <div>
            <span>
              ${product.name}
              ·
              ${item.pack}
              ×
              ${item.qty}
            </span>

            <strong>
              ${money(
                linePrice(item)
              )}
            </strong>
          </div>
        `;
      })
      .join("");

  document.getElementById(
    "checkoutSummary"
  ).innerHTML =
    lines +
    `
      <hr>

      <div>
        <span>
          Total
        </span>

        <strong>
          ${
            allPricesReady()
              ? money(total())
              : "Confirm price on WhatsApp"
          }
        </strong>
      </div>
    `;

  const button =
    document.getElementById(
      "upiPayBtn"
    );

  button.disabled = false;

  button.textContent =
    allPricesReady()
      ? "Pay via UPI"
      : "Ask Price on WhatsApp";
}

function customerDetails() {
  return {
    name:
      document
        .getElementById(
          "cName"
        )
        .value.trim(),

    phone:
      document
        .getElementById(
          "cPhone"
        )
        .value.trim(),

    address:
      document
        .getElementById(
          "cAddress"
        )
        .value.trim()
  };
}

function validCustomer() {
  const details =
    customerDetails();

  if (
    !details.name ||
    !details.phone ||
    !details.address
  ) {
    alert(
      "Please enter name, phone and full address."
    );

    return false;
  }

  return true;
}

function orderId() {
  return (
    "ZG" +
    Date.now()
      .toString()
      .slice(-8)
  );
}

function orderText() {
  const details =
    customerDetails();

  const id = orderId();

  let message =
    `Hello ZYKA GOLD,\n\n` +
    `RETAIL ORDER / PRICE ENQUIRY\n` +
    `Order ID: ${id}\n`;

  cart.forEach((item) => {
    const product =
      PRODUCTS.find(
        (p) =>
          p.id === item.id
      );

    message +=
      `\n${product.name}` +
      ` | ${item.pack}` +
      ` x ${item.qty}` +
      ` | ${money(
        linePrice(item)
      )}`;
  });

  if (allPricesReady()) {
    message +=
      `\n\nTotal: ${money(total())}`;
  } else {
    message +=
      `\n\nPrice: Please confirm current price on WhatsApp.`;
  }

  message +=
    `\nName: ${details.name}` +
    `\nPhone: ${details.phone}` +
    `\nAddress: ${details.address}`;

  if (coupon.code) {
    message +=
      `\nCoupon: ${coupon.code}`;
  }

  message +=
    `\n\nPlease confirm availability, final price and delivery details.`;

  return message;
}

function checkoutWhatsApp() {
  if (!validCustomer()) {
    return;
  }

  window.open(
    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
      orderText()
    )}`,
    "_blank"
  );
}

function checkoutUPI() {
  if (!validCustomer()) {
    return;
  }

  if (!allPricesReady()) {
    checkoutWhatsApp();
    return;
  }

  const details =
    customerDetails();

  const note =
    `ZYKA GOLD order for ${details.name}`;

  const url =
    `upi://pay?` +
    `pa=${encodeURIComponent(
      CONFIG.upiId
    )}` +
    `&pn=${encodeURIComponent(
      CONFIG.payeeName
    )}` +
    `&am=${total().toFixed(2)}` +
    `&cu=${CONFIG.currency}` +
    `&tn=${encodeURIComponent(
      note
    )}`;

  window.location.href = url;
}

function sendWholesale(event) {
  event.preventDefault();

  const name =
    document
      .getElementById(
        "wName"
      )
      .value.trim();

  const business =
    document
      .getElementById(
        "wBusiness"
      )
      .value.trim();

  const phone =
    document
      .getElementById(
        "wPhone"
      )
      .value.trim();

  const city =
    document
      .getElementById(
        "wCity"
      )
      .value.trim();

  const product =
    document
      .getElementById(
        "wProduct"
      )
      .value;

  const qty =
    document
      .getElementById(
        "wQty"
      )
      .value.trim();

  const message =
    `Hello ZYKA GOLD,\n\n` +
    `WHOLESALE / DISTRIBUTOR ENQUIRY\n` +
    `Name: ${name}\n` +
    `Business: ${business || "Not specified"}\n` +
    `Phone: ${phone}\n` +
    `City / District: ${city}\n` +
    `Product: ${product}\n` +
    `Approx Quantity: ${qty || "Not specified"}\n\n` +
    `Please share current wholesale price and details.`;

  window.open(
    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
      message
    )}`,
    "_blank"
  );
}

/* =========================
   ZYKA ASSISTANT PRO
========================= */

function toggleZykaBot() {
  const box =
    document.getElementById(
      "zykaBotBox"
    );

  box.style.display =
    box.style.display === "block"
      ? "none"
      : "block";
}

function zykaAddMessage(text, type) {
  const messages =
    document.getElementById(
      "zykaMessages"
    );

  const message =
    document.createElement(
      "div"
    );

  message.className =
    type === "user"
      ? "zykaUserMsg"
      : "zykaBotMsg";

  message.textContent =
    text;

  messages.appendChild(
    message
  );

  messages.scrollTop =
    messages.scrollHeight;
}

function zykaQuickAsk(text) {
  document.getElementById(
    "zykaInputText"
  ).value = text;

  zykaSend();
}

function normalize(text) {
  return text
    .toLowerCase()
    .replace(
      /[^\w\s₹]/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}

function detectProduct(query) {
  const aliases = [
    [
      "turmeric",
      ["haldi", "turmeric"]
    ],
    [
      "chilli",
      [
        "mirch",
        "chilli",
        "lal mirch"
      ]
    ],
    [
      "coriander",
      [
        "dhaniya",
        "coriander"
      ]
    ],
    [
      "cumin",
      [
        "jeera",
        "cumin"
      ]
    ]
  ];

  for (
    const [id, terms]
    of aliases
  ) {
    if (
      terms.some(
        (term) =>
          query.includes(term)
      )
    ) {
      return PRODUCTS.find(
        (product) =>
          product.id === id
      );
    }
  }

  return null;
}

function smartLocalReply(rawText) {
  const query =
    normalize(rawText);

  const product =
    detectProduct(query);

  if (
    /hello|hi|hey|namaste|salam/.test(
      query
    )
  ) {
    return (
      "Namaste 👋 ZYKA GOLD me aapka swagat hai.\n\n" +
      "Aap product, pack size, retail order, wholesale, payment ya support ke baare me pooch sakte hain."
    );
  }

  if (
    /best seller|popular|sabse acha|sabse best/.test(
      query
    )
  ) {
    return (
      "🔥 Turmeric Powder aur Red Chilli Powder ko Best Seller highlight kiya gaya hai.\n\n" +
      "Aap Shop section se pack size choose karke order kar sakte hain."
    );
  }

  if (
    product &&
    /price|rate|mrp|kitna|cost/.test(
      query
    )
  ) {
    const availablePrices =
      Object.entries(
        product.prices
      ).filter(
        ([, value]) =>
          value > 0
      );

    if (
      availablePrices.length
    ) {
      return (
        `${product.name} prices:\n` +
        availablePrices
          .map(
            ([size, price]) =>
              `${size}: ₹${price}`
          )
          .join("\n")
      );
    }

    return (
      `💰 ${product.name} ka current price WhatsApp par confirm kijiye.\n\n` +
      "Shop section se product aur pack size choose karke Buy Now karein. Price enquiry automatically WhatsApp par chali jayegi."
    );
  }

  if (
    product &&
    /pack|size|gram|kg/.test(
      query
    )
  ) {
    return (
      `${product.name} ke available pack sizes:\n\n` +
      "• 50g\n" +
      "• 100g\n" +
      "• 200g\n" +
      "• 500g\n" +
      "• 1kg"
    );
  }

  if (product) {
    return (
      `${product.name}\n\n` +
      `${product.desc}\n\n` +
      "Pack sizes: 50g, 100g, 200g, 500g, 1kg.\n\n" +
      "Current price ke liye WhatsApp par confirm kar sakte hain."
    );
  }

  if (
    /product|masala|spice/.test(
      query
    )
  ) {
    return (
      "🌶️ ZYKA GOLD Products\n\n" +
      "• Turmeric Powder\n" +
      "• Red Chilli Powder\n" +
      "• Coriander Powder\n" +
      "• Cumin Powder\n\n" +
      "Pack sizes: 50g, 100g, 200g, 500g, 1kg."
    );
  }

  if (
    /wholesale|bulk|dealer|distributor|dukan|shop|retailer/.test(
      query
    )
  ) {
    return (
      "📦 Wholesale Enquiry\n\n" +
      "Naam, shop/business name, phone, city/district, product aur approximate quantity fill kijiye.\n\n" +
      "Current wholesale price WhatsApp par confirm ki jayegi."
    );
  }

  if (
    /cart|add to cart/.test(
      query
    )
  ) {
    const count =
      cart.reduce(
        (a, b) =>
          a + b.qty,
        0
      );

    return (
      `🛒 Aapke cart me ${count} item(s) hain.\n\n` +
      "Pack choose karke Add to Cart karein, phir Checkout par jaakar WhatsApp se final price confirm kar sakte hain."
    );
  }

  if (
    /order|buy|kharid|purchase|checkout/.test(
      query
    )
  ) {
    return (
      "🛒 Order Process\n\n" +
      "1. Product choose karein\n" +
      "2. Pack size select karein\n" +
      "3. Add to Cart\n" +
      "4. Checkout\n" +
      "5. Name, phone aur address fill karein\n" +
      "6. Price WhatsApp par confirm karein\n" +
      "7. Price configured ho to UPI se pay karein."
    );
  }

  if (
    /upi|payment|pay/.test(
      query
    )
  ) {
    return (
      "💳 Payment Help\n\n" +
      "Agar product price website me configured hai to UPI option direct open hoga.\n\n" +
      "Agar price configured nahi hai to wahi button WhatsApp par current price confirm karne ke liye le jayega."
    );
  }

  if (
    /delivery|shipping/.test(
      query
    )
  ) {
    return (
      "🚚 Delivery aur shipping details order confirmation ke waqt WhatsApp par confirm ki jayengi."
    );
  }

  if (
    /refund|cancel/.test(
      query
    )
  ) {
    return (
      "↩️ Cancellation / Refund details footer ke Cancellation / Refund page par available hain."
    );
  }

  if (
    /contact|support|help|whatsapp|phone|number/.test(
      query
    )
  ) {
    return (
      "💬 ZYKA GOLD Support\n\n" +
      "Phone / WhatsApp:\n" +
      "+91 81029 42195\n\n" +
      "Email:\n" +
      "care.zykagold@gmail.com"
    );
  }

  return (
    "🤖 Main ZYKA Assistant Pro hoon.\n\n" +
    "Aap aise questions pooch sakte hain:\n\n" +
    "• Haldi 100g price\n" +
    "• Mirch ke pack sizes\n" +
    "• Wholesale price kaise milega?\n" +
    "• Order kaise karu?\n" +
    "• Payment kaise hoga?\n" +
    "• Support number kya hai?"
  );
}

async function zykaSend() {
  const input =
    document.getElementById(
      "zykaInputText"
    );

  const text =
    input.value.trim();

  if (!text) {
    return;
  }

  zykaAddMessage(
    text,
    "user"
  );

  input.value = "";

  if (CONFIG.aiEndpoint) {
    try {
      const response =
        await fetch(
          CONFIG.aiEndpoint,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                message: text,
                cart,
                products:
                  PRODUCTS.map(
                    ({
                      id,
                      name,
                      desc,
                      prices
                    }) => ({
                      id,
                      name,
                      desc,
                      prices
                    })
                  )
              })
          }
        );

      if (response.ok) {
        const data =
          await response.json();

        if (data.reply) {
          zykaAddMessage(
            data.reply,
            "bot"
          );

          return;
        }
      }
    } catch (error) {
      console.log(
        "AI backend unavailable. Using local assistant."
      );
    }
  }

  setTimeout(
    () => {
      zykaAddMessage(
        smartLocalReply(text),
        "bot"
      );
    },
    180
  );
}

window.addEventListener(
  "click",
  (event) => {
    if (
      event.target.id ===
      "checkoutModal"
    ) {
      closeCheckout();
    }
  }
);

renderProducts();
updateCounts();
