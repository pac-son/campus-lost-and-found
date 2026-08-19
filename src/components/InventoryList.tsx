"use client";

import React, { useState } from "react";

export default function InventoryList({ items }: { items: any[] }) {
  const [messages, setMessages] = useState<Record<number, string>>({});

  async function handleCustodyUpdate(foundItemId: number, action: "request_dropoff" | "mark_received") {
    try {
      const response = await fetch("/api/admin/custody", {
        method: "POST",
        body: JSON.stringify({ 
          foundItemId, 
          action, 
          message: messages[foundItemId] || "" 
        }),
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await response.json();
      
      // Pause everything and show the raw server response
      alert("SERVER DIAGNOSTIC:\n\n" + JSON.stringify(data, null, 2));
      
      window.location.reload();
    } catch (error) {
      alert("Network failed completely.");
    }
  }

  if (items.length === 0) return <p className="text-gray-500">All reported items are physically secured.</p>;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.foundItemId} className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">{item.itemName}</h3>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              With Finder
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Found by:</strong> {item.user.fullName} &lt;{item.user.email}&gt; <br/>
            <strong>Current Admin Msg:</strong> {item.adminMessage || "None sent yet."}
          </p>

          <div className="flex flex-col gap-2">
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white outline-none"
              placeholder="e.g., Please bring this to the Student Affairs office today before 4 PM."
              rows={2}
              value={messages[item.foundItemId] || ""}
              onChange={(e) => setMessages({ ...messages, [item.foundItemId]: e.target.value })}
            />
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => handleCustodyUpdate(item.foundItemId, "request_dropoff")} 
                className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
              >
                Send Drop-off Request
              </button>
              <button 
                onClick={() => handleCustodyUpdate(item.foundItemId, "mark_received")} 
                className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700"
              >
                Mark as Physically Received
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}