"use client";

import React from "react";

type Props = {
  claimId: number;
  foundItemId: number;
  onResolved?: () => void;
};

export default function AdminClaimActions({
  claimId,
  foundItemId,
  onResolved,
}: Props) {
  async function resolveClaim(action: "approve" | "reject") {
    await fetch("/api/admin/resolve", {
      method: "POST",
      body: JSON.stringify({ claimId, foundItemId, action }),
      headers: { "Content-Type": "application/json" },
    });

    // Simple refresh behavior (keeps existing UX)
    if (onResolved) onResolved();
    else window.location.reload();
  }

  return (
    <div className="mt-4 flex gap-2">
      <button
        onClick={() => resolveClaim("approve")}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Approve
      </button>
      <button
        onClick={() => resolveClaim("reject")}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Reject
      </button>
    </div>
  );
}
