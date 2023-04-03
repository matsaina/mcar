// Load vehicles from the server
function loadVehicles() {
  fetch("http://localhost:3000/vehicles")
    .then((resp) => resp.json())
    .then((vehicles) =>
      vehicles.forEach((vehicle) => {
        showList(vehicle);
      })
    );
}

function showList(vehicle) {
  let ul = document.getElementById("myul");
  let li = document.createElement("li");
  li.className = "list-group-item";
  li.innerHTML = `<button type="button" id='li${vehicle.id}' data-toggle="popover" title="${vehicle.name}" data-content="And here's some amazing content. It's very engaging. Right?" class="btn btn-link mine">${vehicle.plate}</button> <button class="btn btn-danger btn-sm" id ='del${vehicle.id}' type="button" style="float: right;">DELETE</button>  <button class="btn btn-info btn-sm" id='edit${vehicle.id}' type="button" style="float: right;">EDIT</button>`;
  ul.appendChild(li);
  let mybutton = document.getElementById(`li${vehicle.id}`);
  mybutton.addEventListener("mouseenter", function () {
    $(function () {
      $(".list-group-item").popover({
        container: "body",
      });
    });
  });

  document
    .getElementById(`edit${vehicle.id}`)
    .addEventListener("click", (e) => {
      fetch(`http://localhost:3000/vehicles/${vehicle.id}`)
        .then((response) => response.json())
        .then((veh) => {
          document.getElementById("name").value = veh.name;
          document.getElementById("plate").value = veh.plate;
          document.getElementById("mileage").value = veh.mileage;
          document.getElementById("nextdate").value = veh.nextdate;
          document.getElementById("inputvehicleid").value = veh.id;
        });
    });

  document.getElementById(`li${vehicle.id}`).addEventListener("click", (e) => {
    document.getElementById("mydiv").innerHTML = `<div class="card-body">
<h5>${vehicle.name} : ${vehicle.plate} </h5>
<p>Mileage After Service: ${vehicle.mileage} KM</p>
<p>Next Service Date: ${vehicle.nextdate}</p>
<table class="table table-striped table-dark">
  <thead>
    <tr>
      <th scope="col">id</th>
      <th scope="col">Service</th>
      <th scope="col">Price</th>
      <th scope="col">Date</th>
      <th scope="col">Option</th>
    </tr>
  </thead>
  <tbody id = "tbody">
 
  </tbody>
</table>
<form id = 'myform' class="form-inline">
  <input type="text" class="form-control" id="service" placeholder="Enter Service" name="name" required>
  <input type="number" class="form-control" id="price" placeholder="Enter Price"  name="date" required>
  <input type="text" class="form-control" id="servicedate" placeholder="Enter Price"  name="servicedate" required>
  <input type ='hidden' id = "inputserviceid" value = '5000'>
<br>
  <button type="submit" id="delveh${vehicle.id}" class="btn btn-success">
      Add Service
  </button>
</form>
</div>
`;

    listenTOForm(vehicle);
    const history = vehicle.history;

    history.forEach((data) => {
      let tr = document.createElement("tr");
      let tbody = document.getElementById("tbody");

      tr.innerHTML = ` 
<td>${data.id}</td>
<td>${data.description}</td>
<td>Ksh ${data.price}</td>
<td>${data.date}</td>
<td> 
<button class="btn btn-danger btn-sm" id='delservice${data.id}'type="button" >DELETE</button>
</td>`;
      tbody.appendChild(tr);
      let theId = data.id;
      document
        .getElementById(`delservice${data.id}`)
        .addEventListener("click", (e) => {
          fetch(`http://localhost:3000/vehicles/${vehicle.id}`)
            .then((response) => response.json())
            .then((data) => {
              console.log(theId);
              data.history = data.history.filter(
                (historyItem) => historyItem.id !== theId
              );

              fetch(`http://localhost:3000/vehicles/${vehicle.id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  history: data.history,
                }),
              })
                .then((response) => {
                  if (response.ok) {
                    console.log(`success${vehicle.id}${data.id}`);
                    tr.remove();
                  } else {
                    console.error(`Failed${vehicle.id}${data.id}`);
                  }
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            })
            .catch((error) => console.error(error));
        });
    });
  });

  document.getElementById(`del${vehicle.id}`).addEventListener("click", (e) => {
    fetch(`http://localhost:3000/vehicles/${vehicle.id}`, {
      method: "DELETE",
    }).then(() => {
      li.remove();
      document.getElementById("mydiv").innerHTML = "";
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadVehicles();
  vehicleListener();
});

function listenTOForm(vehicle) {
  document.getElementById("myform").addEventListener("submit", (e) => {
    event.preventDefault();
    let service = event.target.service.value;
    let price = event.target.price.value;
    let servicedate = event.target.servicedate.value;

    const newService = {
      id: vehicle.history.length + 1,
      description: service,
      price: price,
      date: servicedate,
    };

    fetch(`http://localhost:3000/vehicles/${vehicle.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        history: [...vehicle.history, newService],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        let tr = document.createElement("tr");
        let tbody = document.getElementById("tbody");

        tr.innerHTML = `
        <td>${vehicle.history.length + 1}</td>
        <td>${service}</td>
        <td>Ksh ${price}</td>
        <td>${servicedate}</td>
        <td>
        <button class="btn btn-danger btn-sm" id='delservice${
          vehicle.history.length + 1
        }'type="button" >DELETE</button>
        </td>`;
        tbody.appendChild(tr);
      });
  });
}

function vehicleListener() {
  document.getElementById("newvehicle").addEventListener("submit", (e) => {
    event.preventDefault();

    let name = event.target.name.value;
    let plate = event.target.plate.value;
    let mileage = event.target.mileage.value;
    let date = event.target.nextdate.value;
    let inputvehicleid = event.target.inputvehicleid.value;

    if (inputvehicleid == 5000) {
      fetch(`http://localhost:3000/vehicles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          plate: plate,
          mileage: mileage,
          history: [],
          nextdate: date,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          let ul = document.getElementById("myul");
          let li = document.createElement("li");
          li.className = "list-group-item";
          li.innerHTML = `<button type="button" id='li${data.id}' class="btn btn-link">${data.plate}</button> <button class="btn btn-danger btn-sm" id ='del${data.id}' type="button" style="float: right;">DELETE</button>  <button class="btn btn-info btn-sm" id='edit${data.id}' type="button" style="float: right;">EDIT</button>`;
          ul.appendChild(li);
        });
    } else {
      fetch(`http://localhost:3000/vehicles/${inputvehicleid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          plate: plate,
          mileage: mileage,
          nextdate: date,
        }),
      })
        .then((res) => console.log(res.json()))
        .then((data) => {});
    }
  });
}
