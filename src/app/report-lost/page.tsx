"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReportLostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    itemName: "",
    categoryId: "1",
    description: "",
    locationLost: "",
    dateLost: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/items/lost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, userId: 1 }),
    });

    if (res.ok) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Report a Lost Item</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields identical in structure to the Found Item form */}
          <div>
            <label className="block text-sm font-medium">Item Name</label>
            <input name="itemName" required className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, itemName: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Approximate Location</label>
            <input name="locationLost" required className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, locationLost: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Date Lost</label>
            <input type="date" name="dateLost" required className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, dateLost: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea name="description" required className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded">Submit Lost Report</button>
        </form>
      </div>
    </div>
  );
}