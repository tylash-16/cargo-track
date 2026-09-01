type HistoryItem = {
  title: string;
  date: string;
  time: string;
};

type Props = {
  history: HistoryItem[];
};

export default function TrackingHistory({
  history,
}: Props) {
  return (
    <div className="mt-8 rounded-lg border bg-white p-6">
      <h2 className="mb-4 text-xl font-bold">
        Tracking History
      </h2>

      <div className="space-y-4">
        {history.map((item, index) => (
          <div
            key={index}
            className="border-l-4 border-blue-600 pl-4"
          >
            <p className="font-semibold">
              {item.title}
            </p>

            <p className="text-sm text-gray-500">
              {item.date} • {item.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}