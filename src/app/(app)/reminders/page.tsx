"use client";

import { useState } from "react";

export default function RemindersPage() {
  const [on, setOn] = useState(true);
  return (
    <div className="space-y-4 rounded-3xl border bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Medicine reminders</h1>
      <p className="text-neutral-600">Dosage + refill predictions — push notification hooks (FCM) not wired.</p>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
        Enable smart refill prediction
      </label>
    </div>
  );
}
