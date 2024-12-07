document.getElementById('entryForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    addEntryToTable(description, amount, type);
    updateChart();
    this.reset();
});

let entries = [];

function addEntryToTable(description, amount, type) {
    const tableBody = document.querySelector('#incomeTable tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${description}</td>
        <td>${amount.toFixed(2)}</td>
        <td>${type}</td>
    `;

    tableBody.appendChild(row);
    entries.push({ description, amount, type });
}

function updateChart() {
    const income = entries.filter(entry => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
    const expense = entries.filter(entry => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0);

    const ctx = document.getElementById('incomeChart').getContext('2d');
    if (window.incomeChart) {
        window.incomeChart.destroy();
    }
    window.incomeChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#4CAF50', '#F44336']
            }]
        }
    });
}