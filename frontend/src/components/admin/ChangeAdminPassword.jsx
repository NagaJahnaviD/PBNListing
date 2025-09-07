import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function ChangeAdminPassword() {
  const { register, handleSubmit } = useForm();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleChangePassword = async (data) => {
    try {
      const { oldPassword, newPassword } = data;
      const res = await axios.post(
        `${apiBase}/admin/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );


      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleChangePassword)}>
      <input
        type="password"
        placeholder="Old Password"
        {...register("oldPassword", { required: true })}
      />
      <input
        type="password"
        placeholder="New Password"
        {...register("newPassword", { required: true })}
      />
      <button type="submit">Change Password</button>
    </form>
  );
}

export default ChangeAdminPassword;
