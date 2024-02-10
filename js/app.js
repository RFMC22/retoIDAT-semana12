const addToCartButtons = document.querySelectorAll('.grid-container button');
const cartCounter = document.querySelector('.contador');
const cartList = document.querySelector('.list-cart');
const cartListTable = cartList.querySelector('table');
const totalElement = document.querySelector('.total');
const iconCart = document.querySelector('.icon-cart');
let total = 0;
let cartItems = {};

loadCartFromLocalStorage();

initApp();

function initApp() {
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productInfo = this.parentNode.querySelectorAll('p');
            const productName = productInfo[0].textContent;
            const productPrice = parseInt(productInfo[1].textContent.replace('$', ''));
            updateCart(productName, productPrice, 'add');
        });
    });

    cartList.addEventListener('click', function(event) {
        if (event.target.closest('.remove-product')) {
            const productName = event.target.closest('.remove-product').getAttribute('data-product');
            const productPrice = cartItems[productName].price;
            updateCart(productName, productPrice, 'remove');
        }
        event.stopPropagation();
    });

    iconCart.addEventListener('click', function() {
        cartList.classList.toggle('hidden');
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.icon-cart') && !event.target.closest('.list-cart')) {
            cartList.classList.add('hidden');
        }
    });
}

function updateCart(productName, productPrice, operation) {
    const existItem = cartItems[productName];

    if (operation === 'add') {
        if (existItem) {
            existItem.quantity++;
        } else {
            cartItems[productName] = {
                quantity: 1,
                price: productPrice
            };
        }
        total += productPrice;
        cartCounter.textContent = parseInt(cartCounter.textContent) + 1;
    } else if(operation === 'remove' && existItem) {
        if (existItem.quantity === 1) {
            delete cartItems[productName];
        } else {
            existItem.quantity--;
        }
        total -= productPrice;
        cartCounter.textContent = parseInt(cartCounter.textContent) - 1;
    }
    renderCart();
    saveCartToLocalStorage();
}

function renderCart() {
    removeRenderList();

    for (const [productName, item] of Object.entries(cartItems)) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${item.quantity}</td>
            <td>${productName}</td>
            <td>$${item.price * item.quantity}</td>
            <td class="remove-product" data-product="${productName}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </td>`;
        cartListTable.appendChild(newRow);
    }
    totalElement.textContent = `Total: $${total}`;
}

function removeRenderList() {
    cartListTable.innerHTML = '';
}

function saveCartToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadCartFromLocalStorage() {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
        cartItems = JSON.parse(storedCartItems);
        total = Object.values(cartItems).reduce((acc, item) => acc + (item.price * item.quantity), 0);
        cartCounter.textContent = Object.values(cartItems).reduce((acc, item) => acc + item.quantity, 0);
        renderCart();
    }
}
