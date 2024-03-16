"use client";
import axios from "axios";
import { useRouter } from "next/navigation.js";
import { useState } from "react";
import { useForm } from "react-hook-form";

const AdminLogin = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loginErrors, setLoginErrors] = useState();
  const onSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/admin/login`,
        { ...values }
      );
      const token = response.data.authorization;
      localStorage.setItem("admin_authorization", token);
      router.replace("/admin/dashboard");
    } catch (error) {
      setLoginErrors(error?.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block font-medium text-gray-700">
              Username
            </label>
            <input
              {...register("username", {
                required: { value: true, message: "Username is missed!" },
              })}
              type="text"
              id="username"
              name="username"
              className="mt-1 p-2 border w-full rounded-md focus:outline-none focus:border-blue-500"
              required
            />
            {errors && errors?.password?.message && (
              <div className="text-red-500 text-base font-medium">
                {errors?.password?.message}
              </div>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password", {
                required: { value: true, message: "Password is missed!" },
              })}
              type="password"
              id="password"
              name="password"
              className="mt-1 p-2 border w-full rounded-md focus:outline-none focus:border-blue-500"
              required
            />
            {errors && errors?.password?.message && (
              <div className="text-red-500 text-base font-medium">
                {errors?.password?.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
            Login
          </button>
          {loginErrors && (
            <div className="text-red-500 font-medium mt-3 text-sm">
              {loginErrors}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
