// script.js

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('#entry-form')) {
        // Initialize the entry page
        initializeEntryPage();
    } else if (document.querySelector('#statement-form')) {
        // Initialize the income statement page
        initializeIncomeStatementPage();
    }
});

function initializeEntryPage() {
    const entryForm = document.getElementById('entry-form');
    const entriesTableBody = document.querySelector('#entries-table tbody');

    entryForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addEntry();
        entryForm.reset();
    });

    displayEntries();

    function addEntry() {
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const date = document.getElementById('date').value;

        if (!description || isNaN(amount) || !date) {
            alert('Please fill in all fields correctly.');
            return;
        }

        const entry = {
            description,
            amount,
            date
        };

        const entries = getEntries();
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));

        displayEntries();
    }

    function displayEntries() {
        const entries = getEntries();

        // Sort entries by date
        entries.sort((a, b) => new Date(a.date) - new Date(b.date));

        entriesTableBody.innerHTML = '';

        entries.forEach(entry => {
            const row = entriesTableBody.insertRow();

            const dateCell = row.insertCell(0);
            const descCell = row.insertCell(1);
            const amountCell = row.insertCell(2);

            dateCell.textContent = entry.date;
            descCell.textContent = entry.description;
            amountCell.textContent = entry.amount.toFixed(2);
        });
    }

    function getEntries() {
        return JSON.parse(localStorage.getItem('entries')) || [];
    }
}

function initializeIncomeStatementPage() {
    const statementForm = document.getElementById('statement-form');
    const incomeStatementDiv = document.getElementById('income-statement');

    statementForm.addEventListener('submit', function(event) {
        event.preventDefault();
        generateIncomeStatement();
    });

    function generateIncomeStatement() {
        const startDateInput = document.getElementById('start-date').value;
        const endDateInput = document.getElementById('end-date').value;
    
        if (!startDateInput || !endDateInput) {
            alert('Please select both start and end dates.');
            return;
        }
    
        const startDate = new Date(startDateInput);
        const endDate = new Date(endDateInput);
    
        if (startDate > endDate) {
            alert('Start date must be before or equal to end date.');
            return;
        }
    
        const entries = getEntriesWithinPeriod(startDate, endDate);
    
        // Separate entries into revenues and expenses
        const revenues = entries.filter(entry => entry.amount > 0);
        const expenses = entries.filter(entry => entry.amount < 0);
    
        // Calculate totals
        const totalRevenue = revenues.reduce((sum, entry) => sum + entry.amount, 0);
        const totalExpense = expenses.reduce((sum, entry) => sum + entry.amount, 0); // Negative value
    
        const netIncome = totalRevenue + totalExpense; // totalExpense is negative
    
        // Generate HTML for revenue items
        const revenueItemsHtml = revenues.map(entry => `
            <tr>
                <td>${entry.description}</td>
                <td>$${entry.amount.toFixed(2)}</td>
            </tr>
        `).join('');
    
        // Generate HTML for expense items
        const expenseItemsHtml = expenses.map(entry => `
            <tr>
                <td>${entry.description}</td>
                <td>$${Math.abs(entry.amount).toFixed(2)}</td>
            </tr>
        `).join('');
    
        // Build the income statement HTML
        incomeStatementDiv.innerHTML = `
            <h2>Income Statement (${formatDate(startDate)} to ${formatDate(endDate)})</h2>
    
            <table>
                <thead>
                    <tr>
                        <th colspan="2">Revenue</th>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <th>Amount ($)</th>
                    </tr>
                </thead>
                <tbody>
                    ${revenueItemsHtml}
                    <tr>
                        <th>Total Revenue</th>
                        <th>$${totalRevenue.toFixed(2)}</th>
                    </tr>
                </tbody>
            </table>
    
            <table>
                <thead>
                    <tr>
                        <th colspan="2">Expenses</th>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <th>Amount ($)</th>
                    </tr>
                </thead>
                <tbody>
                    ${expenseItemsHtml}
                    <tr>
                        <th>Total Expenses</th>
                        <th>$${Math.abs(totalExpense).toFixed(2)}</th>
                    </tr>
                </tbody>
            </table>
    
            <table>
                <tr>
                    <th>Net Income</th>
                    <th>$${netIncome.toFixed(2)}</th>
                </tr>
            </table>
        `;
    }

    function getEntriesWithinPeriod(startDate, endDate) {
        const entries = JSON.parse(localStorage.getItem('entries')) || [];

        return entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= startDate && entryDate <= endDate;
        });
    }

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }
}