import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PlansAdmin from "@/components/plan/AdminPlan";

const AdminPageLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading</h2>
      <p className="text-gray-600">
        Please wait while we load the plans management...
      </p>
    </div>
  </div>
);

export default function Page() {
  return (
    <div>
      <Suspense fallback={<AdminPageLoading />}>
        <PlansAdmin />
      </Suspense>
    </div>
  );
}
