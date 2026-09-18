import type { Shipment } from "../types/shipment";

const steps = [
  "Package Received",
  "Departed Warehouse",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

type Props = {
  status: Shipment["status"];
};

export default function ShipmentProgress({ status }: Props) {
  const currentIndex = steps.indexOf(status);

  return (
    <div className="mt-8">
      <h3 className="mb-6 text-xl font-bold text-slate-900">
        Shipment Progress
      </h3>

      <div className="relative">

        {/* Progress line */}
        <div className="absolute left-5 top-5 hidden h-1 w-[calc(100%-2.5rem)] bg-slate-200 md:block" />

        <div className="relative grid gap-8 md:grid-cols-5">

          {steps.map((step, index) => {
            const completed = index <= currentIndex;

            return (
              <div
                key={step}
                className="relative flex items-center gap-4 md:flex-col md:gap-3 md:text-center"
              >

                {/* Circle */}
                <div
                  className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white text-sm font-bold shadow-sm ${
                    completed
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {completed ? "✓" : index + 1}
                </div>

                {/* Text */}
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      completed
                        ? "text-blue-700"
                        : "text-slate-400"
                    }`}
                  >
                    {step}
                  </p>

                  {index === currentIndex && (
                    <p className="mt-1 text-xs text-slate-500">
                      Current status
                    </p>
                  )}
                </div>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}