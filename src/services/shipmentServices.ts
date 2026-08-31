export const shipments = [
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
    
    
]

  


export function searchShipment(trackingNumber: string) {
  return shipments.find(
    (shipment) => shipment.trackingNumber === trackingNumber
  )
}