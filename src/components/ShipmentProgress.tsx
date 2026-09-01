type Props = {
  status: string;
};

const steps = [
  "Picked Up",
  "In Transit",
  "Warehouse",
  "Out for Delivery",
  "Delivered",
];

export default function ShipmentProgress({ status }: Props) {
  const currentStep = steps.indexOf(status);

  return (
    <div className="mt-6 rounded-lg border bg-white p-6">
      <h3 className="mb-4 text-xl font-bold">Shipment Progress</h3>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`mr-4 flex h-8 w-8 items-center justify-center rounded-full text-white ${
                index <= currentStep
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            >
              ✓
            </div>

            <span
              className={
                index <= currentStep
                  ? "font-semibold text-green-600"
                  : "text-gray-500"
              }
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}