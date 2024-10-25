
class Entry {
    constructor(owner, car, licensePlate, entryDate, exitDate, phone) {
        this.owner = owner;
        this.car = car;
        this.licensePlate = licensePlate;
        this.entryDate = entryDate;
        this.exitDate = exitDate;
        this.phone = phone;
    }
}

class UI {
    static displayEntries() {
        const entries = Store.getEntries();
        entries.forEach((entry) => UI.addEntryToTable(entry));
    }

    static addEntryToTable(entry) {
        const tableBody = document.querySelector('#tableBody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.owner}</td>
            <td>${entry.car}</td>
            <td>${entry.licensePlate}</td>
            <td>${entry.entryDate}</td>
            <td>${entry.exitDate}</td>
            <td>${entry.phone}</td>
            <td><button class="btn btn-danger delete">X</button></td>
        `;
        tableBody.appendChild(row);
    }

    static clearInput() {
        // Selects all the inputs
        const inputs = document.querySelectorAll('.form-control');
        // Clear the content of each input
        inputs.forEach((input) => (input.value = ""));
    }

    static deleteEntry(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className} w-50 mx-auto`;
        div.appendChild(document.createTextNode(message));
        const formContainer = document.querySelector('.form-container');
        const form = document.querySelector('#entryForm');
        formContainer.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static validateInputs() {
        const owner = document.querySelector('#owner').value;
        const car = document.querySelector('#car').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        const entryDate = document.querySelector('#entryDate').value;
        const exitDate = document.querySelector('#exitDate').value;
        const phone = document.querySelector('#phone').value;
        
        var licensePlateRegex = /^(?:[A-Z]{2}-\d{2}-\d{2})|(?:\d{2}-[A-Z]{2}-\d{2})|(?:\d{2}-\d{2}-[A-Z]{2})$/;
        var phoneRegex = /^\d{10}$/; 

        if (owner === '' || car === '' || licensePlate === '' || entryDate === '' || exitDate === '' || phone === '') {
            UI.showAlert('All fields must be filled!', 'danger');
            return false;
        }
        if (exitDate < entryDate) {
            UI.showAlert('Exit Date cannot be lower than Entry Date', 'danger');
            return false;
        }
        if (!licensePlateRegex.test(licensePlate)) {
            UI.showAlert('License Plate must be like NN-NN-LL, NN-LL-NN, LL-NN-NN', 'danger');
            return false;
        }
        if (!phoneRegex.test(phone)) {
            UI.showAlert('Phone number must be a 10-digit number', 'danger');
            return false;
        }
        return true;
    }
}

class Store {
    static getEntries() {
        let entries;
        if (localStorage.getItem('entries') === null) {
            entries = [];
        } else {
            entries = JSON.parse(localStorage.getItem('entries'));
        }
        return entries;
    }

    static addEntries(entry) {
        const entries = Store.getEntries();
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    static removeEntries(licensePlate) {
        const entries = Store.getEntries();
        entries.forEach((entry, index) => {
            if (entry.licensePlate === licensePlate) {
                entries.splice(index, 1);
            }
        });
        localStorage.setItem('entries', JSON.stringify(entries));
    }
}

// Event Display
document.addEventListener('DOMContentLoaded', UI.displayEntries);

// Event Add
document.querySelector('#entryForm').addEventListener('submit', (e) => {
    e.preventDefault();

    // Declare Variables
    const owner = document.querySelector('#owner').value;
    const car = document.querySelector('#car').value;
    const licensePlate = document.querySelector('#licensePlate').value;
    const entryDate = document.querySelector('#entryDate').value;
    const exitDate = document.querySelector('#exitDate').value;
    const phone = document.querySelector('#phone').value;

    if (!UI.validateInputs()) {
        return;
    }

    // Instantiate Entry
    const entry = new Entry(owner, car, licensePlate, entryDate, exitDate, phone);
    // Add the entry to the UI table
    UI.addEntryToTable(entry);
    Store.addEntries(entry);
    // Clear input content
    UI.clearInput();
    UI.showAlert('Car successfully added to the parking lot', 'success');
});

// Event Remove
document.querySelector('#tableBody').addEventListener('click', (e) => {
    // Call UI function to remove entry from the table
    UI.deleteEntry(e.target);
    // Get license plate to use as unique element of an entry
    var licensePlate = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    // Call Store function to remove entry from local storage
    Store.removeEntries(licensePlate);
    // Show alert that entry was removed
    UI.showAlert('Car successfully removed from the parking lot list', 'success');
});

// Event Search
document.querySelector('#searchInput').addEventListener('keyup', function searchTable() {
    // Get value of the input search
    const searchValue = document.querySelector('#searchInput').value.toUpperCase();
    // Get all rows of table body
    const tableLine = document.querySelector('#tableBody').querySelectorAll('tr');

    // Loop through table rows
    for (let i = 0; i < tableLine.length; i++) {
        let count = 0;
        // Get all columns of each row
        const lineValues = tableLine[i].querySelectorAll('td');

        // Loop through columns
        for (let j = 0; j < lineValues.length - 1; j++) {
            // Check if any column contains the search value
            if (lineValues[j].innerHTML.toUpperCase().includes(searchValue)) {
                count++;
            }
        }
        tableLine[i].style.display = count > 0 ? '' : 'none';
    }
});
