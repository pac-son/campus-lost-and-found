"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReportFoundPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // We seeded these exactly in Phase 1, so their IDs map 1 to 7
  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Identification Documents" },
    { id: 3, name: "Books/Stationery" },
    { id: 4, name: "Clothing" },
    { id: 5, name: "Keys" },
    { id: 6, name: "Wallets/Purses" },
    { id: 7, name: "Other" },
  ];

  const [formData, setFormData] = useState({
    itemName: "",
    categoryId: "1",
    description: "",
    locationFound: "",
    dateFound: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In a full production app, we would pull userId from the session. 
      // For this prototype, we pass a dummy userId (1) or grab it from localStorage if you saved it.
      const res = await fetch("/api/items/found", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to report item.");
      
      // Redirect back to the dashboard to see the new item!
      router.push("/");
      router.refresh(); // Force Next.js to re-fetch the dashboard data
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1 mb-4">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Report a Found Item</h1>
          <p className="text-gray-500 mt-2">Help a fellow student by providing details about what you found.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input type="text" name="itemName" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Dell XPS 13 Charger" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="categoryId" onChange={handleChange} value={formData.categoryId} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Where did you find it?</label>
            <input type="text" name="locationFound" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Library 2nd Floor, Desk 12" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Found</label>
            <input type="date" name="dateFound" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Public Description</label>
            <textarea name="description" required rows={4} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Provide a general description. Keep some unique details private so you can verify the true owner later."></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md transition-all">
            {loading ? "Submitting..." : "Submit Found Report"}
          </button>
        </form>
      </div>
    </div>
  );
}