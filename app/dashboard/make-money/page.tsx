"use client";

import Link from "next/link";

export default function MakeMoneyPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Make Money</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/investment"
          className="block p-6 border rounded-lg shadow hover:shadow-lg transition-shadow bg-white dark:bg-slate-800"
        >
          <h2 className="text-xl font-semibold mb-2">Investments</h2>
          <p>Explore investment opportunities and manage your portfolio.</p>
        </Link>

        <Link
          href="/dashboard/partnerships"
          className="block p-6 border rounded-lg shadow hover:shadow-lg transition-shadow bg-white dark:bg-slate-800"
        >
          <h2 className="text-xl font-semibold mb-2">Partnerships</h2>
          <p>Find and manage business partnerships.</p>
        </Link>

        <Link
          href="/dashboard/marketplace"
          className="block p-6 border rounded-lg shadow hover:shadow-lg transition-shadow bg-white dark:bg-slate-800"
        >
          <h2 className="text-xl font-semibold mb-2">Selling & Buying</h2>
          <p>Manage your marketplace listings and transactions.</p>
        </Link>

        <Link
          href="/dashboard/storefront"
          className="block p-6 border rounded-lg shadow hover:shadow-lg transition-shadow bg-white dark:bg-slate-800"
        >
          <h2 className="text-xl font-semibold mb-2">Store Management</h2>
          <p>Build and customize your online stores.</p>
        </Link>
      </div>
    </div>
  );
}