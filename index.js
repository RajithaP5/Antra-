const Model = (() => {
  class State {
    #onChange;
    #inventory;
    #cart;

    constructor() {
        this.#inventory = [];
        this.#cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.#onChange = () => {};
    }

    get cart() {
        return this.#cart;
    }

    get inventory() {
        return this.#inventory;
    }

    set cart(newCart) {
        this.#cart = newCart;
        localStorage.setItem('cart', JSON.stringify(newCart));
        this.#onChange('cart', this.#cart);
    }

    set inventory(newInventory) {
        this.#inventory = newInventory;
        this.#onChange('inventory', this.#inventory);
    }

    subscribe(cb) {
        this.#onChange = cb;
    }
}

  const state = new State();

  const fetchInitialData = async () => {
    try {
      const response = await fetch("db.json");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      state.inventory = data.inventory || [];
      state.cart = data.cart || [];
    } catch (error) {
      console.error("Error fetching initial data:", error);
      state.inventory = []; // Fallback to empty if fetch fails
      state.cart = [];
    }
};

  

  const updateCartOnServer = async (cart) => {
    try {
      // Implement updating cart data on the server if needed
    } catch (error) {
      console.error('Error updating cart on server:', error);
    }
  };

  return {
    State: state,
    fetchInitialData,
    updateCartOnServer,
  };
})();

const View = (() => {
  const renderInventory = (inventory) => {
      const inventoryList = document.getElementById('inventory-list');
      inventoryList.innerHTML = `<h2>Inventory</h2>`;
      inventory.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `
              <span>${item.name}</span>
              <button class="decrease">-</button>
              <input type="number" id="input-${item.id}" min="0" max="${item.quantity}" value="0">
              <button class="increase">+</button>
              <button class="add-to-cart">add to cart</button>
          `;
          inventoryList.appendChild(li);

          const input = li.querySelector(`#input-${item.id}`);
          const increaseButton = li.querySelector('.increase');
          const decreaseButton = li.querySelector('.decrease');
          const addToCartButton = li.querySelector('.add-to-cart');

          increaseButton.onclick = () => {
              if (parseInt(input.value) < item.quantity) {
                  input.value = parseInt(input.value) + 1;
              }
          };

          decreaseButton.onclick = () => {
              if (parseInt(input.value) > 0) {
                  input.value = parseInt(input.value) - 1;
              }
          };

          addToCartButton.onclick = () => {
              controller.handleAddToCart(item.id, parseInt(input.value));
              input.value = "0"; // Reset input after adding to cart
          };
      });
  };

  const renderCart = (cart) => {
      const cartList = document.getElementById('cart-list');
      cartList.innerHTML = `<h2>Shopping Cart</h2>`;
      cart.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `
              <span>${item.name} x ${item.amount}</span>
              <button class="delete">Delete</button>
          `;
          cartList.appendChild(li);
          const deleteButton = li.querySelector('.delete');
          deleteButton.onclick = () => controller.handleDelete(item.id);
      });
      const checkoutButton = document.createElement('button');
      checkoutButton.textContent = 'Checkout';
      checkoutButton.className = 'checkout';
      checkoutButton.onclick = () => controller.handleCheckout();
      cartList.appendChild(checkoutButton);
  };

  return { renderInventory, renderCart };
})();



const controller = ((model, view) => {
  const state = model.State;

  const init = async () => {
      state.subscribe((part, data) => {
          if (part === 'inventory') view.renderInventory(data);
          else if (part === 'cart') view.renderCart(data);
      });
      await model.fetchInitialData();
  };

  const handleAddToCart = (itemId, amount) => {
      const existingItem = state.cart.find(item => item.id === itemId);
      if (existingItem) {
          existingItem.amount += amount;
      } else {
          const itemToAdd = state.inventory.find(item => item.id === itemId);
          if (itemToAdd && amount <= itemToAdd.quantity) {
              state.cart = [...state.cart, { id: itemId, name: itemToAdd.name, amount }];
          }
      }
      model.updateCartOnServer(state.cart);
  };
  const handleSubtractFromCart = (itemId) => {
    const existingItem = state.cart.find(item => item.id === itemId);
    if (existingItem) {
        existingItem.amount -= 1;
        if (existingItem.amount <= 0) {
            state.cart = state.cart.filter(item => item.id !== itemId);
        }
    }
    model.updateCartOnServer(state.cart);
};

  const handleDelete = (itemId) => {
      state.cart = state.cart.filter(item => item.id !== itemId);
      model.updateCartOnServer(state.cart);
  };

  const handleCheckout = () => {
      state.cart = [];
      model.updateCartOnServer(state.cart);
  };

  return { init, handleAddToCart, handleSubtractFromCart, handleDelete, handleCheckout };
})(Model, View);

document.addEventListener('DOMContentLoaded', () => {
  controller.init();
});
