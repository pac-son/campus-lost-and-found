import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MyClaimsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const myClaims = await prisma.claim.findMany({
    where: { claimantId: currentUser.userId },
    include: { foundItem: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Claims</h1>
          <Link href="/" className="text-blue-600 hover:underline">Back to Dashboard</Link>
        </div>

        {myClaims.length === 0 ? (
          <p className="text-gray-600 bg-white p-6 rounded-lg shadow-sm border border-gray-200">You haven't submitted any claims yet.</p>
        ) : (
          <div className="space-y-4">
            {myClaims.map(claim => (
              <div key={claim.claimId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{claim.foundItem.itemName}</h3>
                  
                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${claim.claimStatus === 'pending' ? 'bg-orange-100 text-orange-800' : ''}
                    ${claim.claimStatus === 'approved' ? 'bg-blue-100 text-blue-800' : ''}
                    ${claim.claimStatus === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    ${claim.claimStatus === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {claim.claimStatus}
                  </span>
                </div>

                {/* Conditional Instructions based on status */}
                {/* Conditional Instructions based on status */}
                {claim.claimStatus === "approved" && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-1">Collection Instructions</h4>
                    <p className="text-blue-800 text-sm">
                      Your claim has been approved! The admin has left you the following instructions to retrieve your item:
                      <br /><br />
                      <strong>"{claim.collectionInstructions}"</strong>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}