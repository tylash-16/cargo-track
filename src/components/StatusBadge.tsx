type Props = {
  status: string;
};

export default function StatusBadge({ status }: Props) {
  let color = "bg-gray-500";

  switch (status) {
    case "Picked Up":
      color = "bg-blue-500";
      break;

    case "Warehouse":
      color = "bg-yellow-500";
      break;

    case "In Transit":
      color = "bg-indigo-600";
      break;

    case "Out for Delivery":
      color = "bg-orange-500";
      break;

    case "Delivered":
      color = "bg-green-600";
      break;
  }

  return (
    <span
      className={`${color} rounded-full px-3 py-1 text-sm font-semibold text-white`}
    >
      {status}
    </span>
  );
}