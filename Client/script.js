const form = document.getElementById('recordForm');
const recordsContainer = document.getElementById('records-container');

// API Endpoint (Update this when you have the backend ready)
const API_URL = 'http://localhost:5500/api/records'; // Adjust the port if needed

// Function to fetch and display records
async function fetchRecords() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error fetching records: ${response.statusText}`);
        }
        const records = await response.json();

        // Clear existing records in the container
        recordsContainer.innerHTML = '';

        records.forEach((record) => {
            const recordDiv = document.createElement('div');
            recordDiv.classList.add('record');

            // Render Basic Info
            recordDiv.innerHTML = `
                <h3>${record.name}</h3>
                <p>Age: ${record.age}</p>
                <p>Description: ${record.description}</p>
            `;

            // Render Report Data (if available)
            if (record.reportData && Object.keys(record.reportData).length > 0) {
                const reportDataDiv = document.createElement('div');
                reportDataDiv.classList.add('report-data');
                reportDataDiv.innerHTML = '<h4>Report Data:</h4>';

                // Display each key-value pair from reportData
                Object.entries(record.reportData).forEach(([key, value]) => {
                    const item = document.createElement('p');
                    item.textContent = `${key}: ${value}`;
                    reportDataDiv.appendChild(item);
                });

                recordDiv.appendChild(reportDataDiv);
            } else {
                // Handle case where there is no reportData
                const noReportData = document.createElement('p');
                noReportData.textContent = 'No report data available.';
                recordDiv.appendChild(noReportData);
            }

            // Add a delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => deleteRecord(record._id));
            recordDiv.appendChild(deleteBtn);

            recordsContainer.appendChild(recordDiv);
        });
    } catch (error) {
        console.error('Error fetching records:', error);
    }
}

// Function to handle form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error(`Error adding record: ${response.statusText}`);
        }
        form.reset();
        fetchRecords();
    } catch (error) {
        console.error('Error adding record:', error);
    }
});

// Function to delete a record
async function deleteRecord(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error deleting record: ${response.statusText}`);
        }
        fetchRecords();
    } catch (error) {
        console.error('Error deleting record:', error);
    }
}

// Initial fetch of records on page load
fetchRecords();
