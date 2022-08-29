let form = document.getElementById("form");
let itemInput = document.getElementById("item-input");
let titleImput = document.getElementById("title-input");
let msgError = document.getElementById("msg-error");
let items = document.getElementById("items");
let localstorageName = "data";
let a = document.createElement('a');
let data = new Map();

form.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
});

function dataChecking() {
    var msg = "Aucune donnée n'est enregistrée. \nVous pouvez entrer les données de votre backup.json ici :";
    if (localStorage.getItem(localstorageName) === null) {
        var checking = prompt(msg);
        if (checking !== "") {
            localStorage.setItem(localstorageName, checking);
            assignItems();
        }
    } else {
        assignItems();
    };
    displayItems();
    backup();
};

function assignItems() {
    var items = JSON.parse(localStorage.getItem(localstorageName));
    for (var i in items) {
        data.set(i, items[i])
    };
};

function backup() {
    var jsonse = localStorage.getItem(localstorageName);
    var blob = new Blob([jsonse], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "backup.json";
    a.textContent = "backup.json";
    document.getElementById('json').appendChild(a);
};

function formValidation() {
    if (titleImput.value === "" || itemInput.value === "") {
        msgError.innerHTML = "Veuillez compléter le formulaire.";
    } else {
        msgError.innerHTML = "";
        addData();
    }
};

function addData() {
    data.set(titleImput.value, itemInput.value);
    setLocalstorage();
    dataChecking();
};

function displayItems() {
    items.innerHTML = "";
    const reversed = new Map(Array.from(data).reverse());
    reversed.forEach((item, key) => {
        return (items.innerHTML +=
            `<div id=${key} class="item-container">
                    <p class="title">${key}</span>
                    <p class="item">${item}</p>
                    <p class="options">
                    <i onClick="editItem(this)" class="fas fa-edit"></i>
                    <i onClick="deleteItem(this)" class="fas fa-trash-alt"></i>
                    </span>
                </div>`
        )
    });
    itemInput.value = titleImput.value = "";
};

function deleteItem(e) {
    data.delete(e.parentElement.parentElement.id);
    e.parentElement.parentElement.remove();
    setLocalstorage();
    backup();
};

function editItem(e) {
    itemInput.value = e.parentElement.previousElementSibling.innerHTML;
    titleImput.value = e.parentElement.previousElementSibling.parentElement.id;
    data.delete(e.parentElement.parentElement.id);
    e.parentElement.parentElement.remove();
    setLocalstorage();
    backup();
};

function setLocalstorage() {
    localStorage.setItem(localstorageName, JSON.stringify(Object.fromEntries(data.entries())));
};