
import ShipmentProgress from "./ShipmentProgress";

type Shipment = {
  trackingNumber: string;
  sender: string;
  receiver: string;
  status: string;
  location: string;
  estimatedDelivery: string;
};



export default function ShipmentDetails({
  shipment,
}: {
  shipment: Shipment;
}) {
  return (
    <div className="mt-6 rounded-lg border bg-gray-50 p-6">
      <h2 className="mb-4 text-2xl font-bold">
        Shipment Details
      </h2>

      <p>
        <strong>Tracking Number:</strong> {shipment.trackingNumber}
      </p>

      <p>
        <strong>Sender:</strong> {shipment.sender}
      </p>

      <p>
        <strong>Receiver:</strong> {shipment.receiver}
      </p>

      <p>
        <strong>Status:</strong> {shipment.status}
      </p>
<ShipmentProgress status={shipment.status} />
      <p>
        <strong>Location:</strong> {shipment.location}
      </p>

      <p>
        <strong>Estimated Delivery:</strong>{" "}
        {shipment.estimatedDelivery}
      </p>
    </div>
  );
}