const items = [
  { title: "Order packed", body: "Batch B-4F2A — pharmacy partner", time: "08:12" },
  { title: "Refill reminder", body: "Metformin course ~6 days left", time: "Yesterday" },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <div className="space-y-3">
        {items.map((n) => (
          <article key={n.title} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-xs text-neutral-500">{n.time}</div>
            <div className="font-semibold">{n.title}</div>
            <p className="text-sm text-neutral-600">{n.body}</p>
          </article>
        ))}
      </div>
      <p className="text-xs text-neutral-500">Push · SMS critical · email invoices — integrate FCM / Twilio / SES.</p>
    </div>
  );
}
