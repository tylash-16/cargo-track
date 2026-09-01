type Props = {
  status: string;
};

export default function StatusBadge({ status }: Props) {
  const color =
    status === "Delivered"
      ? "bg-green-500"
      : status === "In Transit"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <span
      className={`ml-2 rounded-full px-3 py-1 text-sm font-semibold text-white ${color}`}
    >
      {status}
    </span>
  );
}