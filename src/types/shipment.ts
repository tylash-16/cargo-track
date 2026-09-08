export interface ShipmentHistory {
  date: string;
  time: string;
  status: string;
}

export interface Shipment {
  trackingNumber: string;
  sender: string;
  receiver: string;
  status: string;
  location: string;
  estimatedDelivery: string;
  history: ShipmentHistory[];
}