// Get references to the elements in the HTML
const transactionList = document.getElementById('transaction-list');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const balance = document.getElementById('balance');

// Add event listeners to the buttons
document.getElementById('add-income-btn').addEventListener('click', addIncome);
document.getElementById('add-expense-btn').addEventListener('click', addExpense);
document.getElementById('clear-all-btn').addEventListener('click', clearAll);
document.getElementById('download-xls-btn').addEventListener('click', exportToXLS);

// Function to handle adding income
function addIncome() {
    const description = document.getElementById('income-description').value.trim();
    const amount = parseFloat(document.getElementById('income-amount').value.trim());

    if (description === '' || isNaN(amount)) {
        alert('Please enter valid income details.');
        return;
    }

    // Add the income transaction to the table
    const row = transactionList.insertRow();
    row.insertCell(0).innerText = description;
    row.insertCell(1).innerText = 'Income';
    row.insertCell(2).innerText = amount.toFixed(2);
    row.insertCell(3).innerText = 'Income';
    row.insertCell(4).innerHTML = '<button onclick="deleteTransaction(this)">Delete</button>';

    // Update the summary and clear the income fields
    updateSummary();
    clearIncomeFields();
}

// Function to handle adding expense
function addExpense() {
    const description = document.getElementById('expense-description').value.trim();
    const category = document.getElementById('expense-category').value;
    const amount = parseFloat(document.getElementById('expense-amount').value.trim());

    if (description === '' || isNaN(amount)) {
        alert('Please enter valid expense details.');
        return;
    }

    // Add the expense transaction to the table
    const row = transactionList.insertRow();
    row.insertCell(0).innerText = description;
    row.insertCell(1).innerText = category;
    row.insertCell(2).innerText = amount.toFixed(2);
    row.insertCell(3).innerText = 'Expense';
    row.insertCell(4).innerHTML = '<button onclick="deleteTransaction(this)">Delete</button>';

    // Update the summary and clear the expense fields
    updateSummary();
    clearExpenseFields();
}

// Function to delete a transaction (when the delete button is clicked)
function deleteTransaction(button) {
    const row = button.parentNode.parentNode;
    transactionList.deleteRow(row.rowIndex - 1);  // Adjust row index due to header
    updateSummary();
}

// Function to clear all transactions and reset the summary
function clearAll() {
    transactionList.innerHTML = '';
    updateSummary();
}

// Function to update the summary with total income, total expenses, and balance
function updateSummary() {
    let totalInc = 0;
    let totalExp = 0;

    // Loop through all transactions to calculate totals
    for (let i = 0; i < transactionList.rows.length; i++) {
        const amount = parseFloat(transactionList.rows[i].cells[2].innerText);
        if (transactionList.rows[i].cells[3].innerText === 'Income') {
            totalInc += amount;
        } else {
            totalExp += amount;
        }
    }

    // Update the displayed summary values
    totalIncome.innerText = totalInc.toFixed(2);
    totalExpense.innerText = totalExp.toFixed(2);
    balance.innerText = (totalInc - totalExp).toFixed(2);
}

// Function to clear the income fields after adding an income
function clearIncomeFields() {
    document.getElementById('income-description').value = '';
    document.getElementById('income-amount').value = '';
}

// Function to clear the expense fields after adding an expense
function clearExpenseFields() {
    document.getElementById('expense-description').value = '';
    document.getElementById('expense-category').value = 'Housing';
    document.getElementById('expense-amount').value = '';
}

// Function to export all transactions as an Excel file (XLS)
function exportToXLS() {
    const workbook = XLSX.utils.book_new();
    const data = [];

    // Add headers to the export
    data.push(['Description', 'Category', 'Amount (₦)', 'Type']);

    // Loop through each transaction and add it to the data
    for (let i = 0; i < transactionList.rows.length; i++) {
        const row = transactionList.rows[i];
        const rowData = [
            row.cells[0].innerText,   // Description
            row.cells[1].innerText,   // Category
            row.cells[2].innerText,   // Amount
            row.cells[3].innerText    // Type (Income/Expense)
        ];
        data.push(rowData);
    }

    // Create a worksheet from the data and append it to the workbook
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    // Trigger the download of the Excel file
    XLSX.writeFile(workbook, 'transactions.xlsx');
}
