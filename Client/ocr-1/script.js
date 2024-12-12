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
            const cleanedRecord = cleanObject(record);
            // Render Basic Info
            let descriptionHTML = ''; // To hold dynamically generated description key-value pairs

            // Assuming `record.description` is an object
            if (cleanedRecord.description && typeof cleanedRecord.description === 'object') {
                Object.entries(cleanedRecord.description).forEach(([key, value]) => {
                    const cleanedKey = key.replace(/[{}"]/g, '');
                    const cleanedValue = value.replace(/[{}"]/g, '');
                    descriptionHTML += `<p>${cleanedKey}: ${cleanedValue}</p>`;
                });
            } else {
                descriptionHTML = `<p><b>Description</b>: ${cleanedRecord.description || 'No description available.'}</p>`;
            }

            // Combine basic info with description dynamically
            recordDiv.innerHTML = `
                <h2>${cleanedRecord.name}</h2>
                <p><b>Age</b>: ${cleanedRecord.age}</p>
                ${descriptionHTML}
            `;

            // Render Report Data (if available)
            if (cleanedRecord.reportData && Object.keys(cleanedRecord.reportData).length > 0) {
                const reportDataDiv = document.createElement('div');
                reportDataDiv.classList.add('report-data');
                reportDataDiv.innerHTML = '<h4>Report Data:</h4>';

                let count = 0;
                // Display each key-value pair from reportData
                Object.entries(cleanedRecord.reportData).forEach(([key, value]) => {
                    const item = document.createElement('p');
                    item.innerHTML = `<b>${key} :<b> <u style = "font-weight: 100;">${value}<u>`;
                    console.log("Step :   ", count++);
                    console.log('Key:', key);
                    console.log('Value:', value);
                    console.log('Item Element:', item);
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

// Function to recursively clean keys and values
function cleanObject(obj) {
    if (typeof obj === 'string') {
        return obj.replace(/[{}"]/g, ''); // Remove unwanted characters from strings
    } else if (Array.isArray(obj)) {
        return obj.map((item) => cleanObject(item)); // Clean array elements
    } else if (typeof obj === 'object' && obj !== null) {
        const cleanedObj = {};
        Object.entries(obj).forEach(([key, value]) => {
            const cleanedKey = key.replace(/[{}"]/g, '');
            cleanedObj[cleanedKey] = cleanObject(value); // Recursively clean values
        });
        return cleanedObj;
    }
    return obj; // Return the value as-is if it’s not a string, array, or object
}

// Initial fetch of records on page load
fetchRecords();
