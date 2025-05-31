const tableBody = document.getElementById('device-table-body');
let isFetching = false;
let lastDataJson = ''; // Para evitar render si no hay cambios

function fetchData() {
    if (isFetching) return; // Prevenir múltiples llamadas simultáneas
    isFetching = true;

    fetch('http://45.204.133.44:5000/api/devices')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener los datos');
            return response.json();
        })
        .then(data => {
            const devices = Array.isArray(data) ? data : data.devices;

            if (!devices || devices.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5">Sin datos disponibles</td></tr>';
                return;
            }

            // Verifica si los datos cambiaron para evitar render innecesario
            const currentDataJson = JSON.stringify(devices);
            if (currentDataJson === lastDataJson) return;
            lastDataJson = currentDataJson;

            // Renderizar nueva tabla
            tableBody.innerHTML = ''; // Limpiar tabla
            devices.forEach(device => {
                const row = `
                    <tr>
                        <td>${device.id}</td>
                        <td>${device.name}</td>
                        <td>${device.ip}</td>
                        <td>${device.status}</td>
                        <td>${device.date}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            tableBody.innerHTML = '<tr><td colspan="5">Error al cargar datos</td></tr>';
        })
        .finally(() => {
            isFetching = false;
        });
}

// Ejecutar al cargar la página
fetchData();

// Refrescar cada 2 segundos
setInterval(fetchData, 2000);
