const tableBody = document.getElementById('device-table-body');
let isFetching = false;
let lastDataJson = ''; // Para evitar render si no hay cambios

function fetchData() {
    if (isFetching) return; // Prevenir múltiples llamadas simultáneas
    isFetching = true;

    fetch('http://3.238.36.97:5000/api/devices')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener los datos');
            return response.json();
        })
        .then(data => {
            const devices = Array.isArray(data) ? data : data.devices;

            if (!devices || devices.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6">Sin datos disponibles</td></tr>';
                return;
            }

            const currentDataJson = JSON.stringify(devices);
            if (currentDataJson === lastDataJson) return;
            lastDataJson = currentDataJson;

            tableBody.innerHTML = ''; // Limpiar tabla
            devices.forEach(device => {
                const row = `
                    <tr>
                        <td>${device.id}</td>
                        <td>${device.name}</td>
                        <td>${device.ip}</td>
                        <td>${device.status}</td>
                        <td>${device.date}</td>
                        <td>${device.speed !== undefined ? device.speed : 'N/A'}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            tableBody.innerHTML = '<tr><td colspan="6">Error al cargar datos</td></tr>';
        })
        .finally(() => {
            isFetching = false;
        });
}

fetchData();
setInterval(fetchData, 2000);
