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

let displayDish;

function deleteFromOrder(key) {
    for (const category in order) { 
        if (order[category] && order[category].keyword === key) {
            order[category] = null;
        }
    }

    saveSelectedDishes();
    displayDish();
    updateDisplay();
}

displayDish = function () {
    const section = document.getElementById("chosen-container");

    section.innerHTML = "";

    const selectedIDs = 
        JSON.parse(localStorage.getItem('selectedDishes')) || [];

    if (selectedIDs.length === 0) {
        document.getElementById("empty").style.display = "block";
        return;
    } else {
        document.getElementById("empty").style.display = "none";
    }

    dishes.forEach(dish => {

        if (!(selectedIDs.includes(dish.keyword))) {
            return;
        }

        const dishCard = document.createElement('div');
        dishCard.classList.add('dish-card');
        dishCard.setAttribute('data-dish', dish.keyword);
        dishCard.setAttribute('data-kind', dish.kind);

        dishCard.innerHTML = 
        `   <img src="${dish.image}" alt="${dish.name}" />
            <p class="price">${dish.price}₽</p>
            <p class="name">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button class="delete-button">Удалить</button>`;

        dishCard.querySelector('.delete-button').addEventListener('click', 
            () => {
                deleteFromOrder(dish.keyword);
            });
        
        section.appendChild(dishCard);
    });
};

async function loadDishes() {
    const API_URL = "http://lab8-api.std-900.ist.mospolytech.ru/labs/api/dishes?api_key=9f320335-2dcc-4150-9e14-b8d13bd4bb84";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log("ЗАГРУЗИЛ ЭТО: ", data);

        dishes = data;

        console.log("А ЭТО ДИЩИС: ", dishes);

        displayDish();
        
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadDishes().then(() => {
        loadSelectedDishes();
        displayDish();
        updateDisplay();
    });
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

    saveSelectedDishes();
    displayDish();
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

async function sendOrder() {
    try {
        const form = document.getElementById('orderFormData');
        const formData = new FormData(form);

        if (!formData.has('subscribe')) {
            formData.append('subscribe', '0');
        } else {
            formData.set('subscribe', '1');
        }

        if (formData.get('soup_id') == '') {
            formData.delete('soup_id');
        }
        if (formData.get('main_course_id') == '') {
            formData.delete('main_course_id');
        }
        if (formData.get('salad_id') == '') {
            formData.delete('salad_id');
        }
        if (formData.get('dessert_id') == '') {
            formData.delete('dessert_id');
        }
        if (formData.get('drink_id') == '') {
            formData.delete('drink_id');
        }
        if (formData.get('comment') == '') {
            formData.delete('comment');
        }

        console.log("Отправляемые данные:");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        const response = await fetch(
            "http://lab8-api.std-900.ist.mospolytech.ru/labs/api/orders?api_key=9f320335-2dcc-4150-9e14-b8d13bd4bb84", 
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const result = await response.json();
        console.log("Ответ: ", result);

        showNotification("ЗАКАЗ ОТПРАВЛЕН УРА!");

        localStorage.removeItem('selectedDishes');
        Object.keys(order).forEach((key) => (order[key] = null));

        updateDisplay();
        displayDish();
    } catch (error) {
        console.error("ОШИБКА: ", error);
        showNotification("НЕ УДАЛОСЬ ОТПРАВИТЬ АЙАЙАЙАЙ");
    }
}

document.getElementById('postB').onclick = function(event) {
    event.preventDefault();

    const soupForm = document.getElementById('hiddenSoup');
    const mainForm = document.getElementById('hiddenMain');
    const drinkForm = document.getElementById('hiddenDrink');
    const saladForm = document.getElementById('hiddenSalad');
    const desertForm = document.getElementById('hiddenDesert');

    const nameForm = document.getElementById('nameField');
    const emailForm = document.getElementById('emailField');
    const addressForm = document.getElementById('addressField');
    const phoneForm = document.getElementById('phoneField');
    const deliveryTypeForm = document.querySelector('input[name="delivery_type"]:checked');
    const exactTimeForm = document.getElementById('exactTime');

    soupForm.value = order.soup ? order.soup.id : '';
    mainForm.value = order.main ? order.main.id : '';
    drinkForm.value = order.drink ? order.drink.id : '';
    saladForm.value = order.salad ? order.salad.id : '';
    desertForm.value = order.desert ? order.desert.id : '';

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
        } else if (nameForm.value == '') {
            showNotification('Заполните имя!');
        } else if (emailForm.value == '') {
            showNotification('Заполните почту!');
        } else if (phoneForm.value == '') {
            showNotification('Заполните номер телефона!');
        } else if (addressForm.value == '') {
            showNotification('Заполните адрес доставки!');
        } else if (!deliveryTypeForm) {
            showNotification('Укажите время доставки!');
        } else if (exactTimeForm.value == '') {
            showNotification('Укажите точное время доставки!');
        } else {
            console.log("SENDING ORDER!!!!");
            sendOrder();
        }
    }   
};
