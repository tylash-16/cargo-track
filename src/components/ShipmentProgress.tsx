const steps = [
  "Picked Up",
  "Warehouse",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

type Props = {
  status: string;
};

export default function ShipmentProgress({ status }: Props) {
  const currentIndex = steps.indexOf(status);

  return (
    <div className="my-8">
      <h3 className="mb-4 text-xl font-bold">
        Shipment Progress
      </h3>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-4">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${
                index <= currentIndex
                  ? "bg-green-600"
                  : "bg-gray-300"
              }`}
            >
              {index <= currentIndex ? "✓" : ""}
            </div>

            <span
              className={`font-medium ${
                index <= currentIndex
                  ? "text-green-700"
                  : "text-gray-500"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}