
/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const SPList = document.getElementById("selectedProductsList");

window.addEventListener("load", async (ev) => {
  const products = await loadProducts();


  const filteredProducts = products.filter(
    (product) => localStorage.getItem(product.name) != null
  );

  SPList.innerHTML = filteredProducts
    .map(
      (product) => `
    <div class="product-card" id="S${product.name}">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
      </div>
    </div>
  `
    )
    .join("");

  const cards = SPList.querySelectorAll(".product-card");
  cards.forEach((card) => {
    card.classList.add("highlight")
    card.addEventListener("click", (e) => {
      current = e.currentTarget;

      Name = current.id.slice(1)
      current.remove()
      localStorage.removeItem(Name)
      prod = document.getElementById(Name)
      prod.classList.remove("highlight")

    })
  })
})

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div>
`;

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  return data.products;
}

/* Create HTML for displaying product cards */
async function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <div class="product-card" id="${product.name}">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
      </div>
    </div>
  `
    )
    .join("");



  const cards = productsContainer.querySelectorAll(".product-card");
  cards.forEach(async (card) => {
    descArea = document.querySelector(".search-section");

    if (localStorage.getItem(card.id) != null) {
      card.classList.add("highlight");
    }
    card.addEventListener("click", (e) => {
      current = e.currentTarget;

      if (current.classList.contains("highlight")) {
        current.classList.remove("highlight");
        s = document.getElementById(`S${current.id}`)
        s.remove()
        localStorage.removeItem(current.id)
      }
      else {
        current.classList.add("highlight");
        localStorage.setItem(current.id, "");
        el = current.cloneNode(true);

        SPList.appendChild(el);
        el.id = `S${current.id}`
        el.addEventListener("click", (e) => {
          current.classList.remove("highlight");
          s = document.getElementById(`S${current.id}`)
          s.remove()
          localStorage.removeItem(current.id)
        })
      }
    })
    description = document.createElement("p")



    const filteredProducts = products.filter(
      (product) => product.name === card.id
    );

    description.textContent = filteredProducts[0]["description"];
    description.classList.add("visually-hidden");
    description.classList.add("description");
    description.id = `D${filteredProducts[0]["name"]}`
    descArea.appendChild(description);


    card.addEventListener("mouseenter", (e) => {

      temp = document.getElementById(`D${card.id}`)
      temp.classList.remove("visually-hidden")
    })

    card.addEventListener("mouseleave", (e) => {
      temp = document.getElementById(`D${card.id}`)
      temp.classList.add("visually-hidden")
    })


  });



}



/* Filter and display products when category changes */
categoryFilter.addEventListener("change", async (e) => {
  const products = await loadProducts();
  const selectedCategory = e.target.value;

  descriptions = document.getElementsByClassName("description");
  while (descriptions[0]) {
    descriptions[0].remove();
  }

  /* filter() creates a new array containing only products 
     where the category matches what the user selected */
  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  displayProducts(filteredProducts);
});

/* Chat form submission handler - placeholder for OpenAI integration */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
});

