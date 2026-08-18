import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

// This is a Server Component, so it queries the DB directly on page load
export default async function Dashboard() {
  const currentUser = await getCurrentUser();
  // Fetch the 6 most recently found items that are still available
  const recentItems = await prisma.foundItem.findMany({
    where: { status: "available" },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { category: true }, // Joins the Category table to get the name
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">DONAPP</h1>
        <div className="flex gap-4 items-center">
          {currentUser ? (
            <>
              <span className="text-gray-700 font-medium text-sm mr-2">Hello, {currentUser.fullName}</span>
              
              {/* User Dashboard Links */}
              <Link href="/my-claims" className="text-gray-600 font-medium hover:text-blue-600 text-sm">
                My Claims
              </Link>
              <Link href="/my-reports" className="text-gray-600 font-medium hover:text-blue-600 text-sm">
                My Reports
              </Link>

              {/* Admin Link (Only visible to admins) */}
              {currentUser.role === 'admin' && (
                <Link href="/admin" className="text-blue-600 font-bold hover:underline text-sm ml-2">
                  Admin Panel
                </Link>
              )}
              
              <div className="ml-2 pl-4 border-l border-gray-300">
                <LogoutButton />
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 font-medium hover:text-blue-600">Login</Link>
              <Link href="/register" className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-200 transition-colors">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero & CTAs */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Campus Lost & Found Platform</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            A centralized system for the students and staff of Federal University Otuoke to securely report, track, and recover misplaced items.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/report-lost" className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 shadow-sm transition-all">
              I LOST SOMETHING
            </Link>
            <Link href="/report-found" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all">
              I FOUND SOMETHING
            </Link>
          </div>
        </div>

        {/* Search Bar Area */}
        <div className="max-w-3xl mx-auto mb-12 relative">
          <input 
            type="text" 
            placeholder="Search for laptops, IDs, keys..." 
            className="w-full px-6 py-4 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-lg"
          />
          <button className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-full font-medium hover:bg-blue-700 transition-all">
            Search
          </button>
        </div>

        {/* Dynamic Feed of Found Items */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recently Found Items</h3>
          
          {recentItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
              <p className="text-gray-500">No items have been reported found yet. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentItems.map((item) => (
                <div key={item.foundItemId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  <div className="p-6 grow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider">
                        {item.category?.categoryName || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {new Date(item.dateFound).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{item.itemName}</h4>
                    <p className="text-gray-500 text-sm italic mb-4">Description hidden for security verification.</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {item.locationFound}
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <Link
                      href={`/claim/${item.foundItemId}`}
                      className="w-full text-center text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                    >
                      Claim this item &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}