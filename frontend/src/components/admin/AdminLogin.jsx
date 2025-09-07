import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleLogin = async (data) => {
    try {
      // backend expects POST, not PUT
      const res = await axios.post(
        `${apiBase}/admin/login`,
        data,
        { withCredentials: true } // ✅ allow cookies
      );


      if (res.status === 200) {
        // ✅ save token for later

        alert("Logged in successfully!");
        navigate("/admin");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="bg-white shadow-md rounded-xl p-6 w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          {...register("username", { required: "Username is required" })}
          className="w-full border p-2 mb-2 rounded"
        />
        {errors.username && (
          <p className="text-red-500 text-sm mb-2">{errors.username.message}</p>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          className="w-full border p-2 mb-2 rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
