// Parking slots using Array
let parkingSlots = [
    null, null, null, null, null,
    null, null, null, null, null
];

// Waiting vehicles using Queue
let waitingQueue = [];

// Parking history using Array
let parkingHistory = [];


// Display sections
function showSection(sectionName) {

    let sections = document.querySelectorAll(".section");

    sections.forEach(function(section) {
        section.style.display = "none";
    });

    document.getElementById(sectionName).style.display = "block";
}


// Display parking slots
function displaySlots() {

    let container = document.getElementById("parkingSlots");

    container.innerHTML = "";

    for (let i = 0; i < parkingSlots.length; i++) {

        let slot = document.createElement("div");

        slot.classList.add("slot");

        if (parkingSlots[i] === null) {

            slot.classList.add("available");

            slot.innerHTML = `
                <h3>Slot ${i + 1}</h3>
                <p>Available</p>
            `;

        } else {

            slot.classList.add("occupied");

            slot.innerHTML = `
                <h3>Slot ${i + 1}</h3>
                <p>${parkingSlots[i].vehicleNumber}</p>
            `;
        }

        container.appendChild(slot);
    }

    updateDashboard();
}


// Update dashboard
function updateDashboard() {

    let occupied = 0;

    for (let i = 0; i < parkingSlots.length; i++) {

        if (parkingSlots[i] !== null) {
            occupied++;
        }
    }

    let available = parkingSlots.length - occupied;

    document.getElementById("totalSlots").textContent =
        parkingSlots.length;

    document.getElementById("availableSlots").textContent =
        available;

    document.getElementById("occupiedSlots").textContent =
        occupied;

    document.getElementById("waitingCount").textContent =
        waitingQueue.length;
}


// Vehicle Entry
document.getElementById("entryForm").addEventListener("submit",
function(event) {

    event.preventDefault();

    let vehicleNumber =
        document.getElementById("vehicleNumber").value.toUpperCase();

    let vehicleType =
        document.getElementById("vehicleType").value;


    // Check whether vehicle already exists
    for (let i = 0; i < parkingSlots.length; i++) {

        if (parkingSlots[i] !== null &&
            parkingSlots[i].vehicleNumber === vehicleNumber) {

            document.getElementById("entryMessage").textContent =
                "Vehicle is already parked.";

            return;
        }
    }


    // Find available slot
    let availableSlot = -1;

    for (let i = 0; i < parkingSlots.length; i++) {

        if (parkingSlots[i] === null) {

            availableSlot = i;
            break;
        }
    }


    // If slot available
    if (availableSlot !== -1) {

        parkingSlots[availableSlot] = {

            vehicleNumber: vehicleNumber,
            vehicleType: vehicleType,
            entryTime: new Date().toLocaleString()

        };

        document.getElementById("entryMessage").textContent =
            "Vehicle parked successfully in Slot " +
            (availableSlot + 1);

    }

    // If no slot available
    else {

        waitingQueue.push({

            vehicleNumber: vehicleNumber,
            vehicleType: vehicleType,
            time: new Date().toLocaleString()

        });

        document.getElementById("entryMessage").textContent =
            "Parking full. Vehicle added to waiting queue.";
    }


    document.getElementById("entryForm").reset();

    displaySlots();

    displayQueue();
});
function exitVehicle() {

    let vehicleNumber =
        document.getElementById("exitVehicleNumber")
        .value.toUpperCase();

    let found = false;

    for (let i = 0; i < parkingSlots.length; i++) {

        if (parkingSlots[i] !== null &&
            parkingSlots[i].vehicleNumber === vehicleNumber) {

            let vehicle = parkingSlots[i];

            parkingHistory.push({
                vehicleNumber: vehicle.vehicleNumber,
                vehicleType: vehicle.vehicleType,
                slot: i + 1,
                entryTime: vehicle.entryTime,
                exitTime: new Date().toLocaleString()
            });

            parkingSlots[i] = null;

            found = true;

            document.getElementById("exitMessage").textContent =
                "Vehicle exited successfully from Slot " +
                (i + 1);

            break;
        }
    }


    if (!found) {

        document.getElementById("exitMessage").textContent =
            "Vehicle not found.";

        return;
    }


    // Give empty slot to first waiting vehicle
    if (waitingQueue.length > 0) {

        let nextVehicle = waitingQueue.shift();

        for (let i = 0; i < parkingSlots.length; i++) {

            if (parkingSlots[i] === null) {

                parkingSlots[i] = {
                    vehicleNumber: nextVehicle.vehicleNumber,
                    vehicleType: nextVehicle.vehicleType,
                    entryTime: new Date().toLocaleString()
                };

                break;
            }
        }
    }


    document.getElementById("exitVehicleNumber").value = "";

    displaySlots();

    displayQueue();

    displayHistory();
}
function displayQueue() {

    let container =
        document.getElementById("queueList");

    container.innerHTML = "";

    if (waitingQueue.length === 0) {

        container.innerHTML =
            "<p>No vehicles are waiting.</p>";

        return;
    }


    let list = document.createElement("ol");

    for (let i = 0; i < waitingQueue.length; i++) {

        let item = document.createElement("li");

        item.textContent =
            waitingQueue[i].vehicleNumber +
            " - " +
            waitingQueue[i].vehicleType;

        list.appendChild(item);
    }

    container.appendChild(list);
}
function displayHistory() {

    let container =
        document.getElementById("historyList");

    container.innerHTML = "";

    if (parkingHistory.length === 0) {

        container.innerHTML =
            "<p>No parking history available.</p>";

        return;
    }


    for (let i = 0; i < parkingHistory.length; i++) {

        let record = parkingHistory[i];

        let div = document.createElement("div");

        div.innerHTML = `
            <hr>
            <p><strong>Vehicle:</strong>
            ${record.vehicleNumber}</p>

            <p><strong>Type:</strong>
            ${record.vehicleType}</p>

            <p><strong>Slot:</strong>
            ${record.slot}</p>

            <p><strong>Entry:</strong>
            ${record.entryTime}</p>

            <p><strong>Exit:</strong>
            ${record.exitTime}</p>
        `;

        container.appendChild(div);
    }
}
displaySlots();
displayQueue();
displayHistory();