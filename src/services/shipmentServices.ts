const defaultShipments = [
  {
    trackingNumber: "CT123456789TZ",
    sender: "HM&Y Technologies",
    receiver: "John Doe",
    status: "In Transit",
    location: "Dar es Salaam",
    estimatedDelivery: "2026-08-30",
    history: [
      {
        date: "2026-08-25",
        time: "09:30",
        status: "Package Received",
      },
      {
        date: "2026-08-26",
        time: "14:15",
        status: "Departed Warehouse",
      },
      {
        date: "2026-08-27",
        time: "11:00",
        status: "In Transit",
      },
    ],
  },
  {
    trackingNumber: "CT987654321TZ",
    sender: "Cargo Company",
    receiver: "Alice",
    status: "Delivered",
    location: "Mwanza",
    estimatedDelivery: "2026-08-25",
    history: [
      {
        date: "2026-08-22",
        time: "08:00",
        status: "Package Received",
      },
      {
        date: "2026-08-23",
        time: "10:30",
        status: "In Transit",
      },
      {
        date: "2026-08-24",
        time: "16:00",
        status: "Out for Delivery",
      },
      {
        date: "2026-08-25",
        time: "09:45",
        status: "Delivered",
      },
    ],
  },
];

const savedShipments = localStorage.getItem("shipments");

export const shipments = savedShipments
  ? JSON.parse(savedShipments)
  : defaultShipments;

function saveShipments() {
  localStorage.setItem("shipments", JSON.stringify(shipments));
}

export function searchShipment(trackingNumber: string) {
  return shipments.find(
    (shipment: any) =>
      shipment.trackingNumber.trim().toLowerCase() ===
      trackingNumber.trim().toLowerCase()
  );
}

export function addShipment(shipment: any) {
  const exists = shipments.find(
    (item: any) => item.trackingNumber === shipment.trackingNumber
  );

  if (exists) {
    return false;
  }

  shipments.push({
    ...shipment,
    history: [
      {
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: shipment.status,
      },
    ],
  });

  saveShipments();

  return true;
}

export function deleteShipment(trackingNumber: string) {
  const index = shipments.findIndex(
    (shipment: any) => shipment.trackingNumber === trackingNumber
  );

  if (index === -1) {
    return false;
  }

  shipments.splice(index, 1);

  saveShipments();

  return true;
}

export function updateShipment(
  trackingNumber: string,
  updatedShipment: any
) {
  const shipment = shipments.find(
    (item: any) => item.trackingNumber === trackingNumber
  );

  if (!shipment) {
    return false;
  }

  if (shipment.status !== updatedShipment.status) {
    shipment.history.push({
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: updatedShipment.status,
    });
  }

  shipment.sender = updatedShipment.sender;
  shipment.receiver = updatedShipment.receiver;
  shipment.location = updatedShipment.location;
  shipment.status = updatedShipment.status;
  shipment.estimatedDelivery = updatedShipment.estimatedDelivery;

  saveShipments();

  return true;
}