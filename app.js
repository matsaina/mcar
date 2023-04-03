const vehicleList = document.getElementById("vehicleList");

// Load vehicles from the server
function loadVehicles() {
  fetch("http://localhost:3000/vehicles")
    .then((response) => response.json())
    .then((data) => {
      vehicleList.innerHTML = "";
      data.forEach((vehicle) => {
        addVehicleToTable(vehicle);
      });
    });
}

// Add a new vehicle
function addVehicle() {
  const vehicleName = document.getElementById("vehicleName").value;
  const servicePrice = document.getElementById("servicePrice").value;
  const nextServiceMileage =
    document.getElementById("nextServiceMileage").value;

  const vehicle = { vehicleName, servicePrice, nextServiceMileage };

  fetch("http://localhost:3000/vehicles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vehicle),
  })
    .then((response) => response.json())
    .then((data) => {
      addVehicleToTable(data);
    });
}

// Add a vehicle to the table
function addVehicleToTable(vehicle) {
  const table = document.getElementById("vehicleList");
  const row = table.insertRow(-1);
  row.setAttribute("data-id", vehicle.id);
  row.innerHTML = `
    <td>${vehicle.vehicleName}</td>
    <td>${vehicle.servicePrice}</td>
    <td>${vehicle.nextServiceMileage}</td>
    <td><button type="button" class="showHistory">Show History</button></td>
    <td><button type="button" class="editVehicle">Edit</button> <button type="button" class="deleteVehicle">Delete</button></td>
  `;

  const showHistoryBtn = row.querySelector(".showHistory");
  showHistoryBtn.addEventListener("click", () => {
    showHistory(vehicle.id);
  });

  const editVehicleBtn = row.querySelector(".editVehicle");
  editVehicleBtn.addEventListener("click", () => {
    editVehicle(vehicle);
  });

  const deleteVehicleBtn = row.querySelector(".deleteVehicle");
  deleteVehicleBtn.addEventListener("click", () => {
    deleteVehicle(vehicle.id);
  });

  const addServiceForm = document.createElement("form");
  addServiceForm.innerHTML = `
    <label for="date">Service Date:</label>
    <input type="date" id="serviceDate" name="serviceDate" required><br>
  
    <label for="description">Service Description:</label>
    <input type="text" id="serviceDescription" name="serviceDescription" required><br>
  
    <button type="submit">Add Service</button>
  `;
  row.insertAdjacentElement("afterend", addServiceForm);

  addServiceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const serviceDate = document.getElementById("serviceDate").value;
    const serviceDescription = document.getElementById("serviceDescription").value;

    const newService = {
      date: serviceDate,
      description: serviceDescription,
    };

    fetch(`http://localhost:3000/vehicles/${vehicle.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newService),
    })
      .then((response) => response.json())
      .then((data) => {
        vehicle.history.push(data.history);
        showHistory(vehicle.id);
      })
      .catch((error) => {
        console.error("Error adding service:", error);
      });
  });
}
// Show service history
function showHistory(id) {
  fetch(`http://localhost:3000/vehicles/${id}`)
    .then((response) => response.json())
    .then((data) => {
      alert(JSON.stringify(data.history));
    });
}

// Edit a vehicle
function editVehicle(vehicle) {
  const newVehicleName = prompt("Enter new vehicle name:", vehicle.vehicleName);
  const newServicePrice = prompt(
    "Enter new service price:",
    vehicle.servicePrice
  );
  const newNextServiceMileage = prompt(
    "Enter new next service mileage:",
    vehicle.nextServiceMileage
  );

  const updatedVehicle = {
    vehicleName: newVehicleName,
    servicePrice: newServicePrice,
    nextServiceMileage: newNextServiceMileage,
  };

  fetch(`http://localhost:3000/vehicles/${vehicle.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedVehicle),
  })
    .then((response) => response.json())
    .then((data) => {
      const updatedRow = vehicleList.querySelector(`tr[data-id=${vehicle.id}]`);
      updatedRow.innerHTML = `<td>${data.vehicleName}</td> <td>${data.servicePrice}</td> <td>${data.nextServiceMileage}</td> <td><button type="button" class="showHistory">Show History</button></td> <td><button type="button" class="editVehicle">Edit</button> <button type="button" class="deleteVehicle">Delete</button></td>`;
      addVehicleToTable(data);
    });
}

// Delete a vehicle
function deleteVehicle(id) {
  fetch(`http://localhost:3000/vehicles/${id}`, {
    method: "DELETE",
  }).then(() => {
    const rowToDelete = vehicleList.querySelector(`tr[data-id=${id}]`);
    rowToDelete.remove();
  });
}

// Add event listener for add vehicle button
const addVehicleBtn = document.getElementById("addVehicle");
addVehicleBtn.addEventListener("click", addVehicle);

// Load vehicles on page load
loadVehicles();
