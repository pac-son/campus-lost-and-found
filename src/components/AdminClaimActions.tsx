"use client";

import React, { useState } from "react";

type Props = {
  claimId: number;
  foundItemId: number;
  claimStatus: string; // We declare the prop here so the component knows to expect it
};

export default function AdminClaimActions({ claimId, foundItemId, claimStatus }: Props) {
  const [instructions, setInstructions] = useState("");

  async function resolveClaim(action: "approve" | "reject" | "handover") {
    // If approving, make sure the admin typed a location!
    if (action === "approve" && instructions.trim() === "") {
      alert("Please provide collection instructions (Time and Location) before approving.");
      return;
    }

    await fetch("/api/admin/resolve", {
      method: "POST",
      body: JSON.stringify({ 
        claimId, 
        foundItemId, 
        action,
        collectionInstructions: instructions // Send the typed text to the API
      }),
      headers: { "Content-Type": "application/json" },
    });

    window.location.reload();
  }

  return (
    <div className="mt-4">
      {/* If pending, show the input box and Approve/Reject buttons */}
      {claimStatus === "pending" && (
        <div className="flex flex-col gap-3">
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Type collection time and location (e.g., 'Come to Room 102 tomorrow at 2PM')"
            rows={2}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={() => resolveClaim("approve")} className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">
              Approve Claim
            </button>
            <button onClick={() => resolveClaim("reject")} className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700">
              Reject
            </button>
          </div>
        </div>
      )}

      {/* If already approved, show the Handover button */}
      {claimStatus === "approved" && (
        <button onClick={() => resolveClaim("handover")} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">
          Mark as Handed Over ✓
        </button>
      )}
    </div>
  );
}