import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

// In Next.js 15, params is a Promise
type Props = {
  params: Promise<{ foundItemId: string }>;
};

export default async function ClaimFoundItemPage({ params }: Props) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  // Await the params object
  const resolvedParams = await params;
  const foundItemId = Number(resolvedParams.foundItemId);
  
  if (!Number.isFinite(foundItemId)) notFound();

  const foundItem = await prisma.foundItem.findUnique({
    where: { foundItemId },
    include: { category: true, user: true },
  });

  if (!foundItem) notFound();

  // Basic: only allow claiming when available
  if (foundItem.status !== "available") {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Item not available for claims</h1>
        <p className="text-gray-600">This item is currently not open for claiming.</p>
      </div>
    );
  }

  // The Server Action
  async function submitClaim(formData: FormData) {
    "use server";
    
    // We must re-verify the user inside the server action for security
    const actionUser = await getCurrentUser();
    if (!actionUser) throw new Error("Unauthorized");

    const verificationAnswer = String(formData.get("verificationAnswer") ?? "").trim();
    if (!verificationAnswer) redirect(`/claim/${foundItemId}?error=missing_answer`);

    try {
      // Write directly to the database instead of making a fetch call
      await prisma.claim.create({
        data: {
          foundItemId: foundItemId,
          claimantId: actionUser.userId,
          verificationAnswer,
          claimStatus: "pending",
        },
      });
    } catch (error) {
      console.error("Error submitting claim:", error);
      // Handle the error appropriately, maybe redirect with an error param
    }

    // After submit, go back home
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-2">Claim this item</h1>
        <p className="text-gray-600 mb-6">
          Item: <span className="font-semibold">{foundItem.itemName}</span>
        </p>

        <form className="space-y-4" action={submitClaim}>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Answer Provided</span>
            <input
              name="verificationAnswer"
              required
              placeholder="Type why you believe this is your item..."
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-white text-gray-900" 
            />
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Claim
          </button>

          <p className="text-xs text-gray-500">
            After submitting, your claim will be reviewed by an admin.
          </p>
        </form>
      </div>
    </div>
  );
}