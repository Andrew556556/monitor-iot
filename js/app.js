const tableBody = document.getElementById('device-table-body');

function fetchData() {
    fetch('http://3.234.255.100:5000/api/devices')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener los datos');
            return response.json();
        })
        .then(data => {
            tableBody.innerHTML = ''; // Limpiar tabla

            // Verificar si data contiene un arreglo directamente o dentro de una propiedad
            const devices = Array.isArray(data) ? data : data.devices;

            if (!devices || devices.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5">Sin datos disponibles</td></tr>';
                return;
            }

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
        });
}

// Ejecutar al cargar la página
fetchData();

// Refrescar cada 2 segundos
setInterval(fetchData, 2000);
