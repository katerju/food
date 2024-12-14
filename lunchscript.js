const order = {
    soup: null,
    main: null,
    drink: null,
    desert: null,
    salad: null
};

let dishes = [];

function updateDisplay() {
    const noSelection = document.getElementById('nothing');
    const totalP = document.getElementById('totalPrice');
    const selectedSoup = document.getElementById('soup');
    const selectedMain = document.getElementById('main');
    const selectedDrink = document.getElementById('drink');
    const selectedSalad = document.getElementById('salad');
    const selectedDesert = document.getElementById('desert');

    if (order.soup || order.drink || order.main 
        || order.desert || order.salad) {
        noSelection.style.display = 'none';
        selectedSoup.style.display = 'block';
        selectedSoup.querySelector('span').textContent = order.soup ? 
            order.soup.name + " " + order.soup.price + "₽" : 'Блюдо не выбрано';
        selectedMain.style.display = 'block';
        selectedMain.querySelector('span').textContent = order.main ?
            order.main.name + " " + order.main.price + "₽" : 'Блюдо не выбрано';
        selectedDrink.style.display = 'block';
        selectedDrink.querySelector('span').textContent = order.drink ?
            order.drink.name + " " + 
            order.drink.price + "₽" : 'Напиток не выбран';
        selectedSalad.querySelector('span').textContent = order.salad ?
            order.salad.name + " " +
            order.salad.price + "₽" : 'Блюдо не выбрано';
        selectedSalad.style.display = 'block';
        selectedDesert.querySelector('span').textContent = order.desert ?
            order.desert.name + " " +
            order.desert.price + "₽" : 'Блюдо не выбран';
        selectedDesert.style.display = 'block';
        totalP.style.display = 'block';
        let total = 0;
        total += order.soup ? order.soup.price : 0;
        total += order.main ? order.main.price : 0;
        total += order.drink ? order.drink.price : 0;
        total += order.salad ? order.salad.price : 0;
        total += order.desert ? order.desert.price : 0;
        totalP.querySelector('span').textContent = `${total}₽`;
    } else {
        noSelection.style.display = 'block';
        totalP.style.display = 'none';
        selectedSoup.style.display = 'none';
        selectedMain.style.display = 'none';
        selectedDrink.style.display = 'none';
        selectedDesert.style.display = 'none';
        selectedSalad.style.display = 'none';
    }
}

function addToOrder(keyword) {
    const selectedDish = dishes.find(dish => dish.keyword === keyword);
    
    if (selectedDish.category === 'soup') {
        order.soup = selectedDish;
        document.getElementById('soup-selection').textContent = 
        selectedDish.name;
    } else if (selectedDish.category === 'main') {
        order.main = selectedDish;
        document.getElementById('main-selection').textContent = 
        selectedDish.name;
    } else if (selectedDish.category === 'drink') {
        order.drink = selectedDish;
        document.getElementById('drink-selection').textContent = 
        selectedDish.name;
    } else if (selectedDish.category === 'salad') {
        order.salad = selectedDish;
        document.getElementById('salad-selection').textContent = 
        selectedDish.name;
    } else if (selectedDish.category === 'desert') {
        order.desert = selectedDish;
        document.getElementById('desert-selection').textContent = 
        selectedDish.name;
    }

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
    const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";

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

document.addEventListener("DOMContentLoaded", () => {
    loadDishes();
}); 

document.getElementById('resetB').onclick = function() {
    order.soup = null;
    order.main = null;
    order.drink = null;
    order.salad = null;
    order.desert = null;

    document.querySelectorAll('.dish-card.selected').forEach(card => {
        card.classList.remove('selected');
    });

    updateDisplay();
};

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

document.getElementById('postB').onclick = function(event) {
    const soupForm = document.getElementById('hiddenSoup');
    const mainForm = document.getElementById('hiddenMain');
    const drinkForm = document.getElementById('hiddenDrink');
    const saladForm = document.getElementById('hiddenSalad');
    const desertForm = document.getElementById('hiddenDesert');

    soupForm.value = order.soup ? order.soup.keyword : '';
    mainForm.value = order.main ? order.main.keyword : '';
    drinkForm.value = order.drink ? order.drink.keyword : '';
    saladForm.value = order.salad ? order.salad.keyword : '';
    desertForm.value = order.desert ? order.desert.keyword : '';

    if (!soupForm.value && !mainForm.value && !drinkForm.value &&
         !saladForm.value && !desertForm.value) {
        event.preventDefault();
        showNotification("Ничего не выбрано!");
    } else {
        const missingDish = getMissingDish(
            soupForm.value,
            mainForm.value,
            drinkForm.value,
            saladForm.value
        );

        if (missingDish) {
            event.preventDefault();
            const dishNames = {
                soup: "суп",
                main: "главное блюдо",
                drink: "напиток",
                salad: "салат/стартер"
            };
            showNotification(`Вы не выбрали ${dishNames[missingDish]}!`);
        }
    }
};

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
        }
    });
});
