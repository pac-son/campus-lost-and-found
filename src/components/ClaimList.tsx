import React from "react";
import AdminClaimActions from "./AdminClaimActions";

// We use 'any[]' for the claims type here for rapid prototyping, 
// though in strict production you'd use the Prisma generated types.
export default function ClaimList({ claims }: { claims: any[] }) {
  
  if (claims.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500">No pending or approved claims to review at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {claims.map((claim) => (
        <div key={claim.claimId} className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
          
          {/* Header Row: Title and Status Badge */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Item: {claim.foundItem.itemName}</h3>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Claimant:</strong> {claim.claimant.fullName} &lt;{claim.claimant.email}&gt;
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
              ${claim.claimStatus === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}
            `}>
              {claim.claimStatus}
            </span>
          </div>

          {/* Side-by-Side Verification Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Finder's Hidden Description:</h4>
              <p className="text-gray-800 whitespace-pre-wrap text-sm">{claim.foundItem.description}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-xs font-bold text-blue-700 uppercase mb-1">Claimant's Verification Answer:</h4>
              <p className="text-gray-800 whitespace-pre-wrap text-sm">{claim.verificationAnswer}</p>
            </div>
          </div>

          {/* Action Buttons Component (Passes the status down to determine which buttons to show) */}
          <AdminClaimActions 
            claimId={claim.claimId} 
            foundItemId={claim.foundItemId} 
            claimStatus={claim.claimStatus} 
          />
          
        </div>
      ))}
    </div>
  );
}