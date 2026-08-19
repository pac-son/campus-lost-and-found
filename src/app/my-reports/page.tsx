import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MyReportsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  // Fetch items THIS user reported as found
  const myReportedItems = await prisma.foundItem.findMany({
    where: { userId: currentUser.userId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Items I Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">Back to Dashboard</Link>
        </div>

        {myReportedItems.length === 0 ? (
          <p className="text-gray-600 bg-white p-6 rounded-lg shadow-sm border border-gray-200">You haven't reported any found items.</p>
        ) : (
          <div className="space-y-4">
            {myReportedItems.map(item => (
              <div key={item.foundItemId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-2">{item.itemName}</h3>
                
                {/* --- DEBUG TEXT: Tells us exactly what is in the DB right now --- */}
                <div className="mb-4 text-xs font-mono text-gray-400 bg-gray-100 p-1 rounded inline-block">
                  Raw Status: {item.custody} | Message: {item.adminMessage || "null"}
                </div>
                
                {item.custody === "with_finder" && !item.adminMessage && (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-bold text-gray-700 mb-1">Status: Waiting for Admin</h4>
                    <p className="text-gray-600 text-sm">Please keep this item safe. The administration will send you drop-off instructions shortly.</p>
                  </div>
                )}

                {item.custody === "with_finder" && item.adminMessage && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-bold text-yellow-900 mb-1">Action Required: Drop Off Item</h4>
                    <p className="text-yellow-800 text-sm">
                      <strong>Admin Message:</strong> "{item.adminMessage}"
                    </p>
                  </div>
                )}
                
                {item.custody === "with_admin" && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-bold text-green-900 mb-1">Item Secured</h4>
                    <p className="text-green-800 text-sm">Thank you! You have successfully handed this item over to the administration.</p>
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