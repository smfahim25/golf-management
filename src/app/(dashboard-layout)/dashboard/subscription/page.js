"use client";
import React, { useState, useEffect } from "react";
import { Check, ArrowRight, Loader2, Gift, X, Tag } from "lucide-react";
import { usePlanStore } from "@/stores/PlanStore";

const SubscriptionPage = () => {
  const { plans, loading, error, getPlans } = usePlanStore();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    getPlans();
  }, [getPlans]);

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(price);
  };

  const calculateDiscountedPrice = (price) => {
    if (promoApplied && discount > 0) {
      return price - (price * discount) / 100;
    }
    return price;
  };

  const handlePromoCode = () => {
    setPromoError("");

    const validPromoCodes = {
      SAVE10: 10,
      WELCOME20: 20,
      STUDENT50: 50,
      HOLIDAY25: 25,
    };

    if (validPromoCodes[promoCode.toUpperCase()]) {
      setDiscount(validPromoCodes[promoCode.toUpperCase()]);
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setPromoApplied(false);
      setDiscount(0);
    }
  };

  const removePromoCode = () => {
    setPromoCode("");
    setPromoApplied(false);
    setDiscount(0);
    setPromoError("");
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      alert("Please select a plan");
      return;
    }

    setIsProcessing(true);

    // Replace with actual subscription API call
    setTimeout(() => {
      const finalPrice = calculateDiscountedPrice(selectedPlan.price);
      alert(
        `Subscription successful! Plan: ${
          selectedPlan.name
        }, Price: ${formatPrice(finalPrice, selectedPlan.currency)}`
      );
      setIsProcessing(false);
    }, 2000);
  };

  const getDurationDisplay = (duration) => {
    const durationMap = {
      monthly: "per month",
      yearly: "per year",
    };
    return durationMap[duration] || `per ${duration}`;
  };

  const getDurationBadgeColor = (duration) => {
    const colors = {
      monthly: "bg-blue-100 text-blue-800",
      yearly: "bg-green-100 text-green-800",
      weekly: "bg-purple-100 text-purple-800",
      daily: "bg-orange-100 text-orange-800",
    };
    return colors[duration] || "bg-gray-100 text-gray-800";
  };

  const isPopularPlan = (plan) => {
    // You can modify this logic based on your business rules
    return (
      plan.duration === "yearly" || plan.name.toLowerCase().includes("pro")
    );
  };

  if (loading && plans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin text-blue-600 mx-auto mb-4"
            size={48}
          />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Plans
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch available plans...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Plans</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => getPlans()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="pt-5 pb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Choose Your <span className="text-blue-600">Perfect Plan</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Select the subscription plan that best fits your needs. Upgrade or
            downgrade at any time.
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5">
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <Tag size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Plans Available
            </h3>
            <p className="text-gray-600">
              Please check back later for available subscription plans.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  selectedPlan?._id === plan._id
                    ? "ring-2 ring-blue-500 transform scale-105"
                    : "hover:transform hover:scale-105"
                } ${"border border-gray-200"}`}
              >
                {/* Popular Badge */}
                {isPopularPlan(plan) && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    {/* Duration Badge */}
                    <div className="mb-6">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${getDurationBadgeColor(
                          plan.duration
                        )}`}
                      >
                        {plan.duration}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      {promoApplied && selectedPlan?._id === plan._id ? (
                        <div>
                          <div className="text-lg text-gray-500 line-through">
                            {formatPrice(plan.price, plan.currency)}
                          </div>
                          <div className="text-4xl font-bold text-green-600">
                            {formatPrice(
                              calculateDiscountedPrice(plan.price),
                              plan.currency
                            )}
                          </div>
                          <div className="text-sm text-green-600 font-medium">
                            Save {discount}% with promo code!
                          </div>
                        </div>
                      ) : (
                        <div className="text-4xl font-bold text-gray-900">
                          {formatPrice(plan.price, plan.currency)}
                        </div>
                      )}
                      <div className="text-gray-600 mt-2">
                        {getDurationDisplay(plan.duration)}
                      </div>
                    </div>
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                      selectedPlan?._id === plan._id
                        ? "bg-blue-600 text-white shadow-lg"
                        : isPopularPlan(plan)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {selectedPlan?._id === plan._id ? (
                      <span className="flex items-center justify-center">
                        <Check size={20} className="mr-2" />
                        Selected
                      </span>
                    ) : (
                      "Select Plan"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Promo Code & Checkout Section */}
        {selectedPlan && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Complete Your Subscription
            </h3>

            {/* Selected Plan Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900">
                {selectedPlan.name}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {selectedPlan.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price:</span>
                <div className="text-right">
                  {promoApplied ? (
                    <div>
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(selectedPlan.price, selectedPlan.currency)}
                      </div>
                      <div className="font-semibold text-green-600">
                        {formatPrice(
                          calculateDiscountedPrice(selectedPlan.price),
                          selectedPlan.currency
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="font-semibold text-gray-900">
                      {formatPrice(selectedPlan.price, selectedPlan.currency)}
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    {getDurationDisplay(selectedPlan.duration)}
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promo Code (Optional)
              </label>

              {promoApplied ? (
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center">
                    <Gift className="text-green-600 mr-2" size={18} />
                    <span className="text-green-800 font-medium">
                      {promoCode}
                    </span>
                    <span className="ml-auto text-green-600 text-sm">
                      {discount}% off
                    </span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={handlePromoCode}
                    disabled={!promoCode.trim()}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-red-600 text-sm mt-2">{promoError}</p>
              )}
            </div>

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Subscribe Now</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By subscribing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
