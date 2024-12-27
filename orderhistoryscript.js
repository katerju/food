let dishes = [];
let orders = [];

async function loadDishes() {
    const API_URL = "http://lab8-api.std-900.ist.mospolytech.ru/labs/api/dishes?api_key=9f320335-2dcc-4150-9e14-b8d13bd4bb84";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log("БЛЮДА ЗАГРУЖЕНЫ: ", data);
        dishes = data;        
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
};

async function loadOrders() {
    const API_URL = "http://lab8-api.std-900.ist.mospolytech.ru/labs/api/orders?api_key=9f320335-2dcc-4150-9e14-b8d13bd4bb84";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log("ИСТОРИЯ ЗАКАЗОВ ЗАГРУЖЕНА: ", data);
        orders = data;        
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
};

function getWholeOrder (main, soup, drink, salad, dessert) {
    let allDishes = '';

    if (main != null) {
        allDishes += dishes.find(item => item.id === main).name + ', ';
    }
    if (soup != null) {
        allDishes += dishes.find(item => item.id === soup).name + ', ';
    }
    if (salad != null) {
        allDishes += dishes.find(item => item.id === salad).name + ', ';
    }
    if (drink != null) {
        allDishes += dishes.find(item => item.id === drink).name + ', ';
    }
    if (dessert != null) {
        allDishes += dishes.find(item => item.id === dessert).name + ', ';
    }

    if (allDishes.endsWith(', ')) {
        allDishes = allDishes.slice(0, -2);
    }

    return allDishes;
}

function dateReformer (dateToReform) {
    const [date, time] = dateToReform.split('T');
    const [year, month, day] = date.split('-');
    const [hour, minute] = time.split(':');
    
    return `${day}.${month}.${year} ${hour}:${minute}`;
}

function countPrice (main, soup, drink, salad, dessert) {
    let price = 0;

    if (main != null) {
        price += dishes.find(item => item.id === main).price;
    }
    if (soup != null) {
        price += dishes.find(item => item.id === soup).price;
    }
    if (salad != null) {
        price += dishes.find(item => item.id === salad).price;
    }
    if (drink != null) {
        price += dishes.find(item => item.id === drink).price;
    }
    if (dessert != null) {
        price += dishes.find(item => item.id === dessert).price;
    }

    return price;
}

function deliveryTimeConcretizer (type, time) {
    if (type === "now") {
        return "Как можно скорее <br> (с 07:00 до 23:00)";
    } else {
        return time.slice(0, -3);
    }
}

async function deleteOrder (row, orderID) {
    const rowIndex = row.rowIndex;
    row.remove();
    console.log(`Строка ${rowIndex} удалена.`);
    const API_URL = `http://lab8-api.std-900.ist.mospolytech.ru/labs/api/orders/${orderID}?api_key=9f320335-2dcc-4150-9e14-b8d13bd4bb84`;

    try {
        const response = await fetch(API_URL, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }       
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
}

function deleteConfirmation(row, orderID) {

    let existingDelWindow = document.querySelector(".delete-box");
    if (existingDelWindow) {
        existingDelWindow.remove();
    }

    let existingDWindow = document.querySelector(".details-box");
    if (existingDWindow) {
        existingDWindow.remove();
    }

    let existingEwindow = document.querySelector(".edit-box");
    if (existingEwindow) {
        existingEwindow.remove();
    }

    const deleteConf = document.createElement("div");
    const oId = orderID;
    deleteConf.className = "delete-box";

    const toptext = document.createElement("p");
    toptext.style.fontWeight = "bold";
    toptext.textContent = "Удаление заказа";

    const line1 = document.createElement("hr");
    const line2 = document.createElement("hr");
    line1.classList.add("lines");
    line2.classList.add("lines");

    const crossBtn = document.createElement("button");
    crossBtn.className = "cross-button";
    crossBtn.textContent = "X";

    const orderIndex = row.getAttribute('data-index');

    const text = document.createElement("p");
    text.textContent = "Вы уверены, что хотите удалить заказ №" + 
        (parseInt(orderIndex) + 1) + " ?";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel-button";
    cancelBtn.textContent = "Отмена";

    const yesBtn = document.createElement("button");
    yesBtn.className = "yes-button";
    yesBtn.textContent = "Да";

    crossBtn.addEventListener("click", () => {
        deleteConf.style.display = "none";
    });

    cancelBtn.addEventListener("click", () => {
        deleteConf.style.display = "none";
    });

    yesBtn.addEventListener("click", async () => {
        await deleteOrder(row, oId);
        deleteConf.style.display = "none";
        location.reload();
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "deleteConfBtn-container";
    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(yesBtn);

    deleteConf.appendChild(toptext);
    deleteConf.appendChild(line1);
    deleteConf.appendChild(crossBtn);
    deleteConf.appendChild(text);
    deleteConf.appendChild(line2);
    deleteConf.appendChild(buttonContainer);

    document.body.appendChild(deleteConf);
    deleteConf.style.display = "block";
}

function orderToItems(main, soup, salad, drink, dessert) {
    let allDishes = [];
    
    console.log(main, soup, salad, drink, dessert);

    if (main != null) {
        const mainDish = dishes.find(item => item.id === main);
        if (mainDish) {
            allDishes.push({category: "Основное блюдо", 
                item: `${mainDish.name} (${mainDish.price}₽)`});
            console.log(`${mainDish.name} (${mainDish.price}₽)`);
        }
    }
    if (soup != null) {
        const soupDish = dishes.find(item => item.id === soup);
        if (soupDish) {
            allDishes.push({category: "Суп", 
                item: `${soupDish.name} (${soupDish.price}₽)`});
        }
    }
    if (salad != null) {
        const saladDish = dishes.find(item => item.id === salad);
        if (saladDish) {
            allDishes.push({category: "Салат или стартер", 
                item:`${saladDish.name} (${saladDish.price}₽)`});
        }
    }
    if (drink != null) {
        const drinkDish = dishes.find(item => item.id === drink);
        if (drinkDish) {
            allDishes.push({category: "Напиток", 
                item: `${drinkDish.name} (${drinkDish.price}₽)`});
        }
    }
    if (dessert != null) {
        const dessertDish = dishes.find(item => item.id === dessert);
        if (dessertDish) {
            allDishes.push({category: "Десерт",
                item: `${dessertDish.name} (${dessertDish.price}₽)`});
        }
    }

    return allDishes;
}

async function editOrder (orderID, updatedData) {
    const API_URL = `http://lab8-api.std-900.ist.mospolytech.ru/labs/api/orders/${orderID}?api_key=9f320335-2dcc-4150-9e14-b8d13bd4bb84`;

    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }       
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
}

async function editWindow(orderID) {
    let existingDelWindow = document.querySelector(".delete-box");
    if (existingDelWindow) {
        existingDelWindow.remove();
    }

    let existingDWindow = document.querySelector(".details-box");
    if (existingDWindow) {
        existingDWindow.remove();
    }

    let existingEwindow = document.querySelector(".edit-box");
    if (existingEwindow) {
        existingEwindow.remove();
    }

    const editWind = document.createElement("div");
    editWind.className = "edit-box";

    const toptext = document.createElement("p");
    toptext.style.fontWeight = "bold";
    toptext.textContent = "Редактирование заказа";

    const line1 = document.createElement("hr");
    const line2 = document.createElement("hr");
    line1.classList.add("lines");
    line2.classList.add("lines");

    const crossBtn = document.createElement("button");
    crossBtn.className = "cross-button";
    crossBtn.textContent = "X";
    
    const table = document.createElement("table");
    table.className = "details-table";

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    const order = orders.find(order => order.id === orderID);
    console.log(order);

    const data = {
        created_at: dateReformer(order.created_at),
        delivery: {
            full_name: order.full_name,
            address: order.delivery_address,
            time: deliveryTimeConcretizer(order.delivery_type, 
                order.delivery_time),
            phone: order.phone,
            email: order.email,
        },
        comment: order.comment,
        items: orderToItems(order.main_course_id, order.soup_id, 
            order.salad_id, order.drink_id, order.dessert_id),
        total_price: countPrice(order.main_course_id, order.soup_id, 
            order.drink_id, order.salad_id, order.dessert_id) + ' ₽',
    };

    data.comment = data.comment ? data.comment : "Нет комментария"; 

    console.log(data.items);

    const rows = [
        ["Дата оформления", `<span>${data.created_at}</span>`],
        ["Доставка", ""],
        ["Имя получателя", `<input type="text" 
            value="${data.delivery.full_name}" 
            class="form-input" id="editFullName">`],
        ["Адрес доставки", `<input type="text" value="${data.delivery.address}"
            id="editAddress" class="form-input">`],
        ["Тип доставки", `
            <div class="radio-vertical">
                <label><input type="radio" name="deliveryType" value="now" 
                    ${data.delivery_type === "now" ? "checked" : ""}
                    > Как можно скорее</label>
                 <label><input type="radio" name="deliveryType" value="by_time" 
                 ${data.delivery_type === "by_time" ? "checked" : ""}>
                 Ко времени</label>
            </div>
        `],
        ["Время доставки", `<input type="time" value="${data.delivery.time}"
             id="editTime" min="07:00" max="23:00" step="300">`],
        ["Телефон", `<input type="text" value="${data.delivery.phone}" 
            id="editPhone" class="form-input">`],
        ["Email", `<input type="text" value="${data.delivery.email}" 
            id="editEmail" class="form-input">`],
        ["Комментарий", ""],
    ]; 

    rows.forEach(([label, value]) => {
        const row = document.createElement("tr");

        const cellLabel = document.createElement("td");
        cellLabel.innerHTML = label;

        const cellValue = document.createElement("td");
        cellValue.innerHTML = value;

        if (["Доставка", "Комментарий", "Состав заказа"].includes(label)) {
            cellLabel.style.fontWeight = "bold";
        }

        row.appendChild(cellLabel);
        row.appendChild(cellValue);

        tbody.appendChild(row);
    });

    const commentRow = document.createElement("tr");

    const commentValue = document.createElement("td");
    commentValue.setAttribute("colspan", "2");
    commentValue.innerHTML = `<textarea id="editComment" style="width: 100%; 
        height: 60px;">${data.comment}</textarea>`;

    commentRow.appendChild(commentValue);
    tbody.appendChild(commentRow);

    const detailsRow = document.createElement("tr");

    const detailsLabel = document.createElement("td");
    detailsLabel.innerHTML = `Состав заказа`;
    detailsLabel.style.fontWeight = "bold";
    detailsRow.appendChild(detailsLabel);
    tbody.appendChild(detailsRow);

    data.items.forEach((item) => {
        const itemRow = document.createElement("tr");

        const itemLabel = document.createElement("td");
        itemLabel.textContent = item.category;

        const itemValue = document.createElement("td");
        itemValue.textContent = item.item;

        itemRow.appendChild(itemLabel);
        itemRow.appendChild(itemValue);

        tbody.appendChild(itemRow);
    });

    const totalRow = document.createElement("tr");
    const totalLabel = document.createElement("td");
    totalLabel.textContent = "Стоимость:";
    totalLabel.style.fontWeight = "bold";

    const totalValue = document.createElement("td");
    totalValue.textContent = data.total_price;

    totalRow.appendChild(totalLabel);
    totalRow.appendChild(totalValue);

    tbody.appendChild(totalRow);
 
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel-button";
    cancelBtn.textContent = "Отмена";

    const saveBtn = document.createElement("button");
    saveBtn.className = "save-button";
    saveBtn.textContent = "Сохранить";

    crossBtn.addEventListener("click", () => {
        editWind.style.display = "none";
    });

    cancelBtn.addEventListener("click", () => {
        editWind.style.display = "none";
    });

    saveBtn.addEventListener("click", async () => {

        console.log("Поле Имя:", document.getElementById("editFullName").value);
        console.log("Поле Адрес:", document.getElementById(
            "editAddress").value);
        console.log("Тип доставки:", document.querySelector(
            'input[name="deliveryType"]:checked').value);
        console.log("Время доставки:", document.getElementById(
            "editTime").value);
        console.log("Телефон:", document.getElementById("editPhone").value);
        console.log("Email:", document.getElementById("editEmail").value);
        console.log("Комментарий:", document.getElementById(
            "editComment").value);

        const updatedData = {
            full_name: document.getElementById("editFullName").value.trim(),
            delivery_address: document.getElementById(
                "editAddress").value.trim(),
            delivery_type: document.querySelector(
                'input[name="deliveryType"]:checked').value,
            delivery_time: document.getElementById("editTime").value,
            phone: document.getElementById("editPhone").value.trim(),
            email: document.getElementById("editEmail").value.trim(),
            comment: document.getElementById("editComment").value.trim(),
        };
    
        console.log("Обновлённые данные для отправки:", updatedData);

        await editOrder(orderID, updatedData);
        editWind.style.display = "none";
        location.reload();
    });

    const btnsRow = document.createElement("div");
    btnsRow.classList.add("editWindBtn-container");

    btnsRow.appendChild(cancelBtn);
    btnsRow.appendChild(saveBtn);

    editWind.appendChild(toptext);
    editWind.appendChild(crossBtn);
    editWind.appendChild(line1);
    editWind.appendChild(table);
    editWind.appendChild(line2);
    editWind.appendChild(btnsRow);

    document.body.appendChild(editWind);
    editWind.style.display = "block";
}

async function detailsWindow(row, orderID) {

    let existingDelWindow = document.querySelector(".delete-box");
    if (existingDelWindow) {
        existingDelWindow.remove();
    }

    let existingDWindow = document.querySelector(".details-box");
    if (existingDWindow) {
        existingDWindow.remove();
    }

    let existingEwindow = document.querySelector(".edit-box");
    if (existingEwindow) {
        existingEwindow.remove();
    }

    const detailsWind = document.createElement("div");
    detailsWind.className = "details-box";

    const toptext = document.createElement("p");
    toptext.style.fontWeight = "bold";
    toptext.textContent = "Просмотр заказа";

    const line1 = document.createElement("hr");
    const line2 = document.createElement("hr");
    line1.classList.add("lines");
    line2.classList.add("lines");

    const crossBtn = document.createElement("button");
    crossBtn.className = "cross-button";
    crossBtn.textContent = "X";
    
    const table = document.createElement("table");
    table.className = "details-table";

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    const order = orders.find(order => order.id === orderID);
    console.log(order);

    const data = {
        created_at: dateReformer(order.created_at),
        delivery: {
            full_name: order.full_name,
            address: order.delivery_address,
            time: deliveryTimeConcretizer(order.delivery_type, 
                order.delivery_time),
            phone: order.phone,
            email: order.email,
        },
        comment: order.comment,
        items: orderToItems(order.main_course_id, order.soup_id, 
            order.salad_id, order.drink_id, order.dessert_id),
        total_price: countPrice(order.main_course_id, order.soup_id, 
            order.drink_id, order.salad_id, order.dessert_id) + ' ₽',
    };

    console.log(data.items);

    const rows = [
        ["Дата оформления", data.created_at],
        ["Доставка", ""],
        ["Имя получателя", data.delivery.full_name],
        ["Адрес доставки", data.delivery.address],
        ["Время доставки", data.delivery.time],
        ["Телефон", data.delivery.phone],
        ["Email", data.delivery.email],
        ["Комментарий", ""],
        [data.comment || "Нет комментариев"],
        ["Состав заказа", ""],
    ];

    rows.forEach(([label, value]) => {
        const row = document.createElement("tr");

        const cellLabel = document.createElement("td");
        cellLabel.textContent = label;

        const cellValue = document.createElement("td");
        if (label === "Время доставки") {
            cellValue.innerHTML = value;
        } else {
            cellValue.textContent = value;
        }

        if (["Доставка", "Комментарий", "Состав заказа"].includes(label)) {
            cellLabel.style.fontWeight = "bold";
        }

        row.appendChild(cellLabel);
        row.appendChild(cellValue);

        tbody.appendChild(row);
    });

    data.items.forEach((item) => {
        const itemRow = document.createElement("tr");

        const itemLabel = document.createElement("td");
        itemLabel.textContent = item.category;

        const itemValue = document.createElement("td");
        itemValue.textContent = item.item;

        itemRow.appendChild(itemLabel);
        itemRow.appendChild(itemValue);

        tbody.appendChild(itemRow);
    });

    const totalRow = document.createElement("tr");
    const totalLabel = document.createElement("td");
    totalLabel.textContent = "Стоимость:";
    totalLabel.style.fontWeight = "bold";

    const totalValue = document.createElement("td");
    totalValue.textContent = data.total_price;

    totalRow.appendChild(totalLabel);
    totalRow.appendChild(totalValue);

    tbody.appendChild(totalRow);
 
    const okBtn = document.createElement("button");
    okBtn.className = "ok-button";
    okBtn.textContent = "ОК";

    crossBtn.addEventListener("click", () => {
        detailsWind.style.display = "none";
    });

    okBtn.addEventListener("click", () => {
        detailsWind.style.display = "none";
    });

    detailsWind.appendChild(toptext);
    detailsWind.appendChild(crossBtn);
    detailsWind.appendChild(line1);
    detailsWind.appendChild(table);
    detailsWind.appendChild(line2);
    detailsWind.appendChild(okBtn);

    document.body.appendChild(detailsWind);
    detailsWind.style.display = "block";
}

function displayOrders() {
    const tableBody = document.querySelector('#ordersHistory tbody');
    tableBody.innerHTML = '';

    const sortedOrders = orders.slice().sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at));

    sortedOrders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.classList.add('orderHistoryRow');

        const wholeOrder = getWholeOrder(order.main_course_id, order.soup_id, 
            order.drink_id, order.salad_id, order.dessert_id);

        const registrationDate = dateReformer(order.created_at);

        const fullPrice = countPrice(order.main_course_id, order.soup_id, 
            order.drink_id, order.salad_id, order.dessert_id);

        const deliveryTimeconcretized = 
            deliveryTimeConcretizer(order.delivery_type, order.delivery_time);

        const cellIndex = document.createElement('td');
        cellIndex.textContent = index + 1;
        row.setAttribute('data-index', index);
        row.appendChild(cellIndex);

        const cellRegDate = document.createElement('td');
        cellRegDate.textContent = registrationDate;
        row.appendChild(cellRegDate);

        const cellOrder = document.createElement('td');
        cellOrder.classList.add('wholeOrder');
        cellOrder.textContent = wholeOrder;
        row.appendChild(cellOrder);

        const cellPrice = document.createElement('td');
        cellPrice.textContent = fullPrice;
        row.appendChild(cellPrice);

        const cellDeliveryTime = document.createElement('td');
        cellDeliveryTime.innerHTML = deliveryTimeconcretized;
        row.appendChild(cellDeliveryTime);

        const cellActions = document.createElement('td');
        const detailsButton = document.createElement('button');
        detailsButton.classList.add("historyButtons");
        detailsButton.classList.add('btn', 'btn-outline-primary');
        detailsButton.innerHTML = `<i class="bi bi-eye"></i>`;
        detailsButton.addEventListener('click', () => detailsWindow(row, 
            order.id));

        const editButton = document.createElement('button');
        editButton.classList.add("historyButtons");
        editButton.classList.add('btn', 'btn-outline-secondary');
        editButton.innerHTML = `<i class="bi bi-pencil"></i>`;
        editButton.addEventListener('click', () => editWindow(order.id));

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("historyButtons");
        deleteButton.classList.add('btn', 'btn-outline-danger');
        deleteButton.innerHTML = `<i class="bi bi-trash"></i>`;
        deleteButton.addEventListener('click', () => deleteConfirmation(row, 
            order.id));

        cellActions.appendChild(detailsButton);
        cellActions.appendChild(editButton);
        cellActions.appendChild(deleteButton); 
        
        row.appendChild(cellActions);

        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    Promise.all([loadDishes(), loadOrders()]).then(() => {
        displayOrders();
    }).catch(error => {
        console.error("Ошибка при загрузке данных:", error);
    });
});
