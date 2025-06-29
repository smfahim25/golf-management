"use client";

import useAuthStore from "@/stores/AuthStore";
import useUserStore from "@/stores/UserStore";
import { UserCircle2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    firstName: "Mithun",
    email: "chakrabortypranto39@gmail.com",
    password: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuthStore();
  const { isLoading, error, updateUser } = useUserStore();

  useEffect(() => {
    try {
      if (user) {
        setFormData({
          firstName: user.name || "",
          email: user.email || "",
          password: "",
        });
      }
    } catch (error) {
      console.error("Error setting form data from user:", error);
    }
  }, [user]);

  const handleChange = (e) => {
    try {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear any previous errors when user starts typing
      if (submitError) {
        setSubmitError(null);
      }
    } catch (error) {
      console.error("Error handling form input change:", error);
    }
  };

  const handleImageChange = (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          toast.error("Please select a valid image file");
          return;
        }

        // Validate file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          toast.error("Please select an image smaller than 5MB");
          return;
        }

        setProfileImage(file);

        // Create preview URL safely
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);

        // Clear any previous errors
        if (submitError) {
          setSubmitError(null);
        }
      }
    } catch (error) {
      console.error("Error handling image change:", error);
      toast.error("Error processing the selected image. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Basic validation
      if (!formData.firstName.trim()) {
        throw new Error("Full name is required");
      }

      if (!formData.email.trim()) {
        throw new Error("Email is required");
      }

      if (!user?._id) {
        throw new Error(
          "User ID not found. Please refresh the page and try again."
        );
      }

      const data = new FormData();
      data.append("firstName", formData.firstName.trim());
      data.append("email", formData.email.trim());

      if (formData.password.trim()) {
        data.append("password", formData.password);
      }

      if (profileImage) {
        data.append("profile_photo", profileImage);
      }

      await updateUser(user._id, data);
    } catch (error) {
      console.error("Error updating user:", error);
      setSubmitError(
        error.message || "Failed to update user. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManageSubscription = () => {
    try {
      alert("Manage Subscription functionality would go here!");
    } catch (error) {
      console.error("Error managing subscription:", error);
      alert(
        "Unable to manage subscription at this time. Please try again later."
      );
    }
  };

  // Clean up preview URL on component unmount
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <div className="flex items-center justify-center py-10 p-4 bg-white">
      <div className="">
        <div className="flex flex-col items-center mb-6">
          <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Preview"
                width={160}
                height={160}
                className="object-cover w-full h-full"
                onError={() => {
                  console.error("Error loading preview image");
                  setPreviewImage(null);
                }}
              />
            ) : (
              <UserCircle2 className="w-24 h-24 text-gray-500" />
            )}
          </div>
          <label className="bg-blue-600 text-white px-4 py-2.5 rounded-sm hover:bg-blue-700 cursor-pointer">
            <span>Select Profile Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Error Display */}
        {(submitError || error) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {submitError || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              readOnly
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Password{" "}
              <span className="text-xs text-gray-500">
                (Leave blank to keep the same password)
              </span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-sm cursor-pointer hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              className="bg-primary text-white px-4 py-2.5 rounded-sm cursor-pointer hover:bg-primary/90 focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleManageSubscription}
            >
              Manage Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
