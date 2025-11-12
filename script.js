
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
          Name = e.currentTarget.id.slice(1)
          p = document.getElementById(Name)
          s = document.getElementById(`S${Name}`)

          p.classList.remove("highlight");

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




chatWindow.textContent = "👋 Hello! How can I help you today?";

let messages = [
  {
    role: 'system', content: `You are a sassy L'oreal branded chatbot that helps customers navigate L'Oréal's extensive product catalog and receive tailored recommendations, If a user's query is unrelated to L'Oreal products, respond by stating that you do not know. If the user has not picked products for the routine you should suggust that they pick them out from the selection above.`
  }
];

//worker URL
const workerUrl = "https://hidden-bar-6e99.jacksonr1019.workers.dev/"


button = document.getElementById("generateRoutine");

button.addEventListener("click", async (e) => {
  e.preventDefault();

  chatWindow.textContent = 'Thinking...';

  const products = await loadProducts();


  const filteredProducts = products.filter(
    (product) => localStorage.getItem(product.name) != null
  );

  messages.push({ role: 'system', content: "You are a sassy L'oreal branded chatbot that helps customers navigate L'Oréal's extensive product catalog and receive tailored recommendations, If a user's query is unrelated to L'Oreal products, respond by stating that you do not know. Generate a Personalized Routine for the user from the products given from the L'Oreal website and answer any follow up questions. The routine should take the form of a plain text list." });

  filteredProducts.forEach((e) => {
    messages.push({ role: 'user', content: JSON.stringify(e) });

  }
  )


  try {
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();


    const replyText = result.choices[0].message.content;
    messages.push({ role: 'assistant', content: replyText });

    chatWindow.textContent = replyText;

  } catch (error) {
    console.error('Error:', error); // Log the error
    chatWindow.textContent = 'Sorry, something went wrong. Please try again later.'; // Show error message to the user
  }

  // Clear the input field
  userInput.value = '';
})



/* Chat form submission handler - placeholder for OpenAI integration */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  chatWindow.textContent = 'Thinking...';
  messages.push({ role: 'user', content: userInput.value });

  try {
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();


    const replyText = result.choices[0].message.content;
    messages.push({ role: 'assistant', content: replyText });

    chatWindow.textContent = replyText;

  } catch (error) {
    console.error('Error:', error); // Log the error
    chatWindow.textContent = 'Sorry, something went wrong. Please try again later.'; // Show error message to the user
  }

  // Clear the input field
  userInput.value = '';
});

clear = document.getElementById("clear")

clear.addEventListener("click", async (e) => {
  e.preventDefault();
  localStorage.clear();
  SPList.innerHTML = ""
  highlighted = document.getElementsByClassName("highlight")
  while (highlighted[0]) {
    highlighted[0].classList.remove("highlight")
  }
})







