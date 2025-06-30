"use client";

import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PaymentFailed = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard/subscription");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            We couldn&#39;t process your payment. Please try again or use a
            different payment method.
          </p>
        </div>

        {/* Common Reasons */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">
            Common reasons for payment failure:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Insufficient funds in your account</li>
            <li>• Incorrect card details entered</li>
            <li>• Card expired or blocked</li>
            <li>• Network connectivity issues</li>
            <li>• Bank security restrictions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
