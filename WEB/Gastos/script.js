const password = "123456"; // Clave de 6 números

document.getElementById('date').valueAsDate = new Date(localStorage.getItem('selectedDate') || new Date());

document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;

    if (date && amount && description) {
        const expenseList = document.getElementById('expense-list');
        const listItem = document.createElement('li');
        listItem.textContent = `${description}: $${amount}`;
        listItem.dataset.amount = amount;
        listItem.dataset.description = description;
        listItem.dataset.date = date;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', function() {
            deleteExpense(date, description, amount);
            expenseList.removeChild(listItem);
        });

        listItem.appendChild(deleteButton);
        expenseList.appendChild(listItem);

        let expenses = JSON.parse(localStorage.getItem('expenses')) || {};
        if (!expenses[date]) {
            expenses[date] = [];
        }
        expenses[date].push({ description, amount });
        localStorage.setItem('expenses', JSON.stringify(expenses));

        updateRemainingAmount(date);

        document.getElementById('expense-form').reset();
        document.getElementById('date').value = date;
    }
});

document.getElementById('initial-amount-section').addEventListener('click', function() {
    document.getElementById('modal').style.display = "block";
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('modal').style.display = "none";
});

document.getElementById('modify-amount-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const enteredPassword = document.getElementById('password').value;
    const newAmount = parseFloat(document.getElementById('new-amount').value);
    const date = document.getElementById('date').value;

    if (enteredPassword === password && newAmount) {
        let initialAmounts = JSON.parse(localStorage.getItem('initialAmounts')) || {};
        initialAmounts[date] = newAmount;
        localStorage.setItem('initialAmounts', JSON.stringify(initialAmounts));
        updateInitialAndRemainingAmounts(date);
        document.getElementById('modal').style.display = "none";
        document.getElementById('modify-amount-form').reset();
    } else {
        alert("Clave incorrecta o monto inválido.");
    }
});

document.getElementById('add-funds-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const additionalAmount = parseFloat(document.getElementById('additional-amount').value);
    const date = document.getElementById('date').value;

    if (additionalAmount) {
        let initialAmounts = JSON.parse(localStorage.getItem('initialAmounts')) || {};
        initialAmounts[date] = (initialAmounts[date] || 1000) + additionalAmount;
        localStorage.setItem('initialAmounts', JSON.stringify(initialAmounts));

        let addedFunds = JSON.parse(localStorage.getItem('addedFunds')) || {};
        if (!addedFunds[date]) {
            addedFunds[date] = [];
        }
        addedFunds[date].push(additionalAmount);
        localStorage.setItem('addedFunds', JSON.stringify(addedFunds));

        updateInitialAndRemainingAmounts(date);
        updateAddedFundsHistory(date);
        document.getElementById('add-funds-form').reset();
    } else {
        alert("Monto inválido.");
    }
});

window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = "none";
    }
};

// Load expenses and added funds from localStorage
window.onload = function() {
    const selectedDate = localStorage.getItem('selectedDate') || new Date().toISOString().split('T')[0];
    document.getElementById('date').value = selectedDate;
    loadExpensesForDate(selectedDate);
    updateInitialAndRemainingAmounts(selectedDate);
    updateAddedFundsHistory(selectedDate);
};

// Update initial and remaining amounts
function updateInitialAndRemainingAmounts(date) {
    let initialAmounts = JSON.parse(localStorage.getItem('initialAmounts')) || {};
    let initialAmount = initialAmounts[date] || 1000;
    document.getElementById('initial-amount').textContent = initialAmount;

    let expenses = JSON.parse(localStorage.getItem('expenses')) || {};
    let totalExpenses = 0;

    if (expenses[date]) {
        expenses[date].forEach(expense => {
            totalExpenses += expense.amount;
        });
    }

    let remainingAmount = initialAmount - totalExpenses;
    document.getElementById('remaining-amount').textContent = remainingAmount;
}

// Reset initial amount at midnight
function resetInitialAmountAtMidnight() {
    let now = new Date();
    let millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0) - now;
    setTimeout(function() {
        const selectedDate = new Date().toISOString().split('T')[0];
        updateInitialAndRemainingAmounts(selectedDate);
        resetInitialAmountAtMidnight();
    }, millisTillMidnight);
}

resetInitialAmountAtMidnight();

// Save selected date to localStorage
document.getElementById('date').addEventListener('change', function() {
    const selectedDate = document.getElementById('date').value;
    localStorage.setItem('selectedDate', selectedDate);
    loadExpensesForDate(selectedDate);
    updateInitialAndRemainingAmounts(selectedDate);
    updateAddedFundsHistory(selectedDate);
});

function loadExpensesForDate(date) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || {};
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    if (expenses[date]) {
        expenses[date].forEach(expense => {
            const listItem = document.createElement('li');
            listItem.textContent = `${expense.description}: $${expense.amount}`;
            listItem.dataset.amount = expense.amount;
            listItem.dataset.description = expense.description;
            listItem.dataset.date = date;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', function() {
                deleteExpense(date, expense.description, expense.amount);
                expenseList.removeChild(listItem);
            });

            listItem.appendChild(deleteButton);
            expenseList.appendChild(listItem);
        });
    }
    updateRemainingAmount(date);
}

function deleteExpense(date, description, amount) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || {};
    if (expenses[date]) {
        expenses[date] = expenses[date].filter(expense => expense.description !== description || expense.amount !== amount);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateRemainingAmount(date);
    }
}

// Copy data to clipboard
document.getElementById('copy-button').addEventListener('click', function() {
    const date = document.getElementById('date').value;
    const dayName = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long' });
    let initialAmounts = JSON.parse(localStorage.getItem('initialAmounts')) || {};
    const initialAmount = initialAmounts[date] || 1000;
    const remainingAmount = document.getElementById('remaining-amount').textContent;
    let expenses = JSON.parse(localStorage.getItem('expenses')) || {};
    let expenseList = '';

    if (expenses[date]) {
        expenses[date].forEach(expense => {
            expenseList += `${expense.description}: $${expense.amount}\n`;
        });
    }

    let addedFunds = JSON.parse(localStorage.getItem('addedFunds')) || {};
    let addedFundsList = '';
    if (addedFunds[date]) {
        addedFunds[date].forEach(fund => {
            addedFundsList += `$${fund}\n`;
        });
    }

    const data = `Fecha: ${date} (${dayName})\nMonto Inicial: $${initialAmount}\nMonto Restante: $${remainingAmount}\nGastos:\n${expenseList}\nEfectivo Agregado:\n${addedFundsList}`;
    navigator.clipboard.writeText(data).then(() => {
        alert('Datos copiados al portapapeles');
    }).catch(err => {
        alert('Error al copiar los datos: ', err);
    });
});

function updateRemainingAmount(date) {
    let initialAmounts = JSON.parse(localStorage.getItem('initialAmounts')) || {};
    let initialAmount = initialAmounts[date] || 1000;

    let expenses = JSON.parse(localStorage.getItem('expenses')) || {};
    let totalExpenses = 0;

    if (expenses[date]) {
        expenses[date].forEach(expense => {
            totalExpenses += expense.amount;
        });
    }

    let remainingAmount = initialAmount - totalExpenses;
    document.getElementById('remaining-amount').textContent = remainingAmount;
}

function updateAddedFundsHistory(date) {
    let addedFunds = JSON.parse(localStorage.getItem('addedFunds')) || {};
    const addedFundsList = document.getElementById('added-funds-list');
    addedFundsList.innerHTML = '';
    if (addedFunds[date]) {
        addedFunds[date].forEach((fund, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `$${fund}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', function() {
                deleteAddedFund(date, index, fund);
                addedFundsList.removeChild(listItem);
            });

            listItem.appendChild(deleteButton);
            addedFundsList.appendChild(listItem);
        });
    }
}

function deleteAddedFund(date, index, fund) {
    let addedFunds = JSON.parse(localStorage.getItem('addedFunds')) || {};
    let initialAmounts = JSON.parse(localStorage.getItem('initialAmounts')) || {};
    if (addedFunds[date]) {
        addedFunds[date].splice(index, 1);
        localStorage.setItem('addedFunds', JSON.stringify(addedFunds));
        initialAmounts[date] -= fund;
        localStorage.setItem('initialAmounts', JSON.stringify(initialAmounts));
        updateAddedFundsHistory(date);
        updateInitialAndRemainingAmounts(date);
    }
}
