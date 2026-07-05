import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminClaimActions from "@/components/AdminClaimActions";

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

  const pendingClaims = await prisma.claim.findMany({
    where: { claimStatus: "pending" },
    include: {
      foundItem: true,
      claimant: true,
    },
  });

  const stats = await getStats();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Found Items" count={stats.totalFound} color="bg-blue-600" />
        <StatCard title="Lost Reports" count={stats.totalLost} color="bg-yellow-600" />
        <StatCard title="Pending Claims" count={stats.totalPending} color="bg-orange-600" />
        <StatCard title="Items Returned" count={stats.totalReturned} color="bg-green-600" />
      </div>

      <h1 className="text-2xl font-bold">Admin Panel - Welcome, {currentUser.fullName}</h1>
      <h1 className="text-2xl font-bold mb-6">Admin Claims Review</h1>

      <div className="space-y-4">
        {pendingClaims.map((claim) => (
          <div key={claim.claimId} className="border p-4 rounded bg-white shadow">
            <h3 className="font-bold">Item: {claim.foundItem.itemName}</h3>
            <p>
              <strong>Claimant:</strong> {claim.claimant.fullName}
            </p>
            <p>
              <strong>Answer Provided:</strong> {claim.verificationAnswer}
            </p>

            <AdminClaimActions claimId={claim.claimId} foundItemId={claim.foundItemId} />
          </div>
        ))}
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
