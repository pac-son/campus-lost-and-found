export default function ClaimRootPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Claim</h1>
        <p className="text-gray-600">
          This page proves the <code>/claim</code> route is working.
        </p>
        <p className="text-gray-600 mt-2">
          Try <code>/claim/1</code> next.
        </p>
      </div>
    </div>
  );
}
