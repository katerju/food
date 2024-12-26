const order = {
    soup: null,
    main: null,
    drink: null,
    desert: null,
    salad: null
};

let dishes = [];

function saveSelectedDishes() {
    const selectedIDs = [];
    if (order.soup) selectedIDs.push(order.soup.keyword);
    if (order.main) selectedIDs.push(order.main.keyword);
    if (order.drink) selectedIDs.push(order.drink.keyword);
    if (order.salad) selectedIDs.push(order.salad.keyword);
    if (order.desert) selectedIDs.push(order.desert.keyword);

    localStorage.setItem('selectedDishes', JSON.stringify(selectedIDs));
    console.log("СОХРАНИЛ: ", selectedIDs);
}

function loadSelectedDishes() {
    const savedIDs = JSON.parse(localStorage.getItem('selectedDishes')) || [];
    savedIDs.forEach(id => {
        const dish = dishes.find(d => d.keyword === id);
        if (dish) {
            if (dish.category === 'soup') order.soup = dish;
            if (dish.category === 'main-course') order.main = dish;
            if (dish.category === 'drink') order.drink = dish;
            if (dish.category === 'dessert') order.desert = dish;
            if (dish.category === 'salad') order.salad = dish;
        }
    });

    console.log("ВОССТАНОВИЛ: ", order);
}

function updateDisplay() {
    document.querySelectorAll('.dish-card').forEach(card => {
        const keyword = card.getAttribute('data-dish');
        card.classList.remove('selected');

        if (
            (order.soup && order.soup.keyword === keyword) ||
            (order.main && order.main.keyword === keyword) ||
            (order.drink && order.drink.keyword === keyword) ||
            (order.salad && order.salad.keyword === keyword) ||
            (order.desert && order.desert.keyword === keyword)
        ) {
            card.classList.add('selected');
        }
    });
}

function addToOrder(keyword) {
    const selectedDish = dishes.find(dish => dish.keyword === keyword);
    if (!selectedDish) return;

    switch (selectedDish.category) {
    case 'soup':
        order.soup = selectedDish;
        break;
    case 'main-course':
        order.main = selectedDish;
        break;
    case 'drink':
        order.drink = selectedDish;
        break;
    case 'salad':
        order.salad = selectedDish;
        break;
    case 'dessert':
        order.desert = selectedDish;
        break;
    }

    saveSelectedDishes();
    updateDisplay();
}

function displayDish() {
    const menuSections = {
        soup: document.querySelector('#soup-section .menu-container'),
        main: document.querySelector('#main-section .menu-container'),
        drink: document.querySelector('#drink-section .menu-container'),
        salad: document.querySelector('#salad-section .menu-container'),
        dessert: document.querySelector('#dessert-section .menu-container'),
    };

    Object.values(menuSections).forEach(section => {
        section.innerHTML = "";
    });

    dishes.sort((a, b) => a.name.localeCompare(b.name));

    dishes.forEach(dish => {
        const dishCard = document.createElement('div');
        dishCard.classList.add('dish-card');
        dishCard.setAttribute('data-dish', dish.keyword);
        dishCard.setAttribute('data-kind', dish.kind);

        dishCard.innerHTML = 
        `   <img src="${dish.image}" alt="${dish.name}" />
            <p class="price">${dish.price}₽</p>
            <p class="name">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button class="add-button">Добавить</button>`;

        dishCard.querySelector('.add-button').addEventListener('click', () => {
            addToOrder(dish.keyword);
        });
        
        const section = menuSections[dish.category.split('-')[0]];

        section.appendChild(dishCard);
    });
}

async function loadDishes() {
    const API_URL = "http://lab7-api.std-900.ist.mospolytech.ru/api/dishes";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log("ЗАГРУЗИЛ ЭТО: ", data);

        dishes = data;

        displayDish();
        
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
}

function showNotification(message) {
    let existingNotification = document.querySelector(".notification-box");
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.className = "notification-box";

    const text = document.createElement("p");
    text.className = "notification-message";
    text.textContent = message;

    const button = document.createElement("button");
    button.className = "notification-button";
    button.textContent = "Ок 👌";

    button.addEventListener("click", () => {
        notification.style.display = "none";
    });

    notification.appendChild(text);
    notification.appendChild(button);

    document.body.appendChild(notification);
    notification.style.display = "block";
}

function getMissingDish(soup, main, drink, salad) {
    const combos = [
        ["main", "drink"],
        ["soup", "main", "drink"],
        ["main", "salad", "drink"],
        ["soup", "salad", "drink"],
        ["soup", "main", "salad", "drink"]
    ];

    const selected = {
        soup: !!soup,
        main: !!main,
        drink: !!drink,
        salad: !!salad,
    };

    let bestMatch = null;
    let maxMatches = -1;

    for (let combo of combos) {
        const missingItems = combo.filter((item) => !selected[item]); 
        const matches = combo.length - missingItems.length;

        if (matches > maxMatches && missingItems.length > 0) {
            bestMatch = missingItems[0];
            maxMatches = matches;
        }

        if (missingItems.length === 0) {
            return null;
        }
    }
    return bestMatch;
}

function calculateTotalPrice() {
    let total = 0;

    if (order.soup) total += order.soup.price;
    if (order.main) total += order.main.price;
    if (order.drink) total += order.drink.price;
    if (order.salad) total += order.salad.price;
    if (order.desert) total += order.desert.price;

    console.log("СУММА ЗАКАЗА: ", total);

    return total;
}

function updateOrderPanel() {
    const panel = document.getElementById("orderPanel");
    const totalPriceElement = document.getElementById("totalPrice");
    const checkoutLink = document.getElementById("checkout-link");

    const total = calculateTotalPrice();
    console.log("ПЕРЕДАЛ В АПДЕЙТ: ", total);

    totalPriceElement.textContent = `${total}₽`;

    if (total === 0) {
        panel.style.opacity = "0"; 
        panel.style.pointerEvents = "none"; 
    } else {
        panel.style.opacity = "1"; 
        panel.style.pointerEvents = "auto"; 
    }

    const missingDish = getMissingDish(
        order.soup,
        order.main,
        order.drink,
        order.salad
    );

    if (!missingDish) {
        checkoutLink.classList.add("active");
        checkoutLink.removeAttribute("disabled");
    } else {
        checkoutLink.classList.remove("active");
        checkoutLink.setAttribute("disabled", "true");
    }
}


document.querySelectorAll('.filetr-btn').forEach(button => {    
    button.addEventListener('click', () => {
        const filterRow = button.parentNode;
        const filterRowId = filterRow.id;

        const categoryDishesContainer = document.querySelector(
            `#${filterRowId.replace('Filter', '-section')} .menu-container`);
        filterRow.querySelectorAll('.filetr-btn').forEach(btn => {            
            if (btn !== button) btn.classList.remove('active');
        });
        button.classList.toggle('active');
     
        const selectedKind = button.classList.contains('active') ? 
            button.getAttribute('data-kind') : null;
        Array.from(categoryDishesContainer.children).forEach(dish => {
            if (!selectedKind || dish.getAttribute('data-kind') 
            === selectedKind) {                
                dish.style.display = 'block';
            } else {
                dish.style.display = 'none'; 
            }        
        });
    });
});

document.querySelectorAll('.menu-section').forEach(section => {
    section.addEventListener('click', (event) => {

        if (event.target.classList.contains('add-button')) {
            const selectedCard = event.target.closest('.dish-card'); 
            const menuContainer = selectedCard.parentNode;

            menuContainer.querySelectorAll('.dish-card').forEach(card => {
                card.classList.remove('selected');
            });

            selectedCard.classList.add('selected');

            const keyword = selectedCard.getAttribute('data-dish');
            addToOrder(keyword);
            updateOrderPanel();
            saveSelectedDishes();
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    loadDishes().then(() => {
        loadSelectedDishes();
        updateDisplay();
        updateOrderPanel();
    });
}); 
