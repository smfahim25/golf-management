"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/stores/AuthStore";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { register } = useAuthStore();

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        return value.trim() === "" ? "First Name is required" : "";
      case "email":
        if (value.trim() === "") return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? "Please enter a valid email" : "";
      case "password":
        if (value.trim() === "") return "Password is required";
        return value.length < 6 ? "Password must be at least 6 characters" : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      firstName: true,
      email: true,
      password: true,
    });

    if (Object.keys(newErrors).length === 0) {
      const result = await register({
        name: `${formData.firstName}`,
        email: formData.email,
        phone: "",
        address: "",
        password: formData.password,
      });

      if (result) {
        router.push("/login");
        console.log("Registration successful:", result);
      } else {
        console.log("Registration failed.");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      email: "",
      password: "",
    });
    setErrors({});
    setTouched({});
    router.push("/login");
  };

  return (
    <div className="min-h-screen font-sans flex pt-16 justify-center p-4 bg-gray-50">
      <div className="w-full max-h-fit max-w-5xl bg-white border border-gray-200 rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-100">
          <h1 className="text-xl font-medium text-gray-900">Register</h1>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full ${
                    errors.firstName && touched.firstName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                {errors.firstName && touched.firstName && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
              </div>
              {errors.firstName && touched.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full ${
                    errors.email && touched.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                {errors.email && touched.email && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
              </div>
              {errors.email && touched.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full ${
                  errors.password && touched.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              {errors.password && touched.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-2"
              >
                Register
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="text-blue-600 cursor-pointer hover:text-blue-800 hover:bg-blue-50 px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
