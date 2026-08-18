import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ClaimList from "@/components/ClaimList";
import InventoryList from "@/components/InventoryList";

async function getStats() {
  const results = await Promise.all([
    prisma.foundItem.count(),
    prisma.lostItem.count(),
    prisma.claim.count({ where: { claimStatus: "pending" } }),
    prisma.foundItem.count({ where: { status: "returned" } }),
  ]);

  const [totalFound, totalLost, totalPending, totalReturned] = results;

  return { totalFound, totalLost, totalPending, totalReturned };
}

export default async function AdminDashboard() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    redirect("/login");
  }

  // 1. Claims for the Review section (Pending and Approved)
  const claimsToReview = await prisma.claim.findMany({
    where: { 
      claimStatus: { in: ["pending", "approved"] } 
    },
    include: { foundItem: true, claimant: true },
  });

  // 2. Items for the Inventory Management section
  const itemsPendingDropoff = await prisma.foundItem.findMany({
    where: { custody: "with_finder" },
    include: { user: true }, 
    orderBy: { createdAt: "desc" }
  });

  // 3. NEW: Fetch all Lost Items for the Master Ledger
  const allLostItems = await prisma.lostItem.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  // 4. NEW: Fetch all Found Items for the Master Ledger
  const allFoundItems = await prisma.foundItem.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const stats = await getStats();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* --- ANALYTICS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Found Items" count={stats.totalFound} color="bg-blue-600" />
        <StatCard title="Lost Reports" count={stats.totalLost} color="bg-yellow-600" />
        <StatCard title="Pending Claims" count={stats.totalPending} color="bg-orange-600" />
        <StatCard title="Items Returned" count={stats.totalReturned} color="bg-green-600" />
      </div>

      <h1 className="text-2xl font-bold">Admin Panel - Welcome, {currentUser.fullName}</h1>
      
      {/* --- ACTION CENTER: CLAIMS REVIEW --- */}
      <h1 className="text-2xl font-bold mt-8 mb-6">Admin Claims Review</h1>
      <ClaimList claims={claimsToReview} />

      {/* --- ACTION CENTER: INVENTORY MANAGEMENT --- */}
      <h2 className="text-2xl font-bold mt-12 mb-6 border-t pt-8">
        Inventory Management (Pending Drop-offs)
      </h2>
      <InventoryList items={itemsPendingDropoff} />

      {/* --- MASTER REGISTRY SECTION --- */}
      <h2 className="text-3xl font-bold mt-16 mb-6 border-t pt-8 text-gray-900">Master Database Records</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Lost Items Ledger */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-yellow-700">All Lost Reports</h3>
          {allLostItems.length === 0 ? (
            <p className="text-gray-500 text-sm">No lost items reported.</p>
          ) : (
            <div className="space-y-4">
              {allLostItems.map((item) => (
                <div key={item.lostItemId} className="pb-4 border-b border-gray-100 last:border-0">
                  <h4 className="font-bold text-gray-900">{item.itemName}</h4>
                  <p className="text-xs text-gray-500 mb-1">
                    Lost on: {new Date(item.dateLost).toLocaleDateString()} | Location: {item.locationLost}
                  </p>
                  <p className="text-sm text-gray-700">{item.description}</p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">Reported by: {item.user.fullName}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Found Items Ledger */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-green-700">All Found Reports</h3>
          {allFoundItems.length === 0 ? (
            <p className="text-gray-500 text-sm">No found items reported.</p>
          ) : (
            <div className="space-y-4">
              {allFoundItems.map((item) => (
                <div key={item.foundItemId} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900">{item.itemName}</h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-gray-100 rounded text-gray-600">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    Found on: {new Date(item.dateFound).toLocaleDateString()} | Location: {item.locationFound}
                  </p>
                  <p className="text-sm text-gray-700">{item.description}</p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">Reported by: {item.user.fullName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  count,
  color,
}: {
  title: string;
  count: number;
  color: string;
}) {
  return (
    <div className={`${color} text-white p-6 rounded-xl shadow-lg`}>
      <h4 className="text-sm opacity-80 uppercase font-bold">{title}</h4>
      <p className="text-4xl font-extrabold mt-2">{count}</p>
    </div>
  );
}