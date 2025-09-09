import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AddClient() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { size } = location.state || {};
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleAdd = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "clientImage" && data[key] && data[key][0]) {
          formData.append(key, data[key][0]); // file upload
        } else if (
          data[key] !== "" &&
          data[key] !== null &&
          data[key] !== undefined
        ) {
          formData.append(key, data[key]);
        }
      });

      formData.set("clientId", size);

      const res = await axios.post(`${apiBase}/client/client`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        alert("Client created successfully!");
        reset({});
        navigate("/admin");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create client");
    }
  };

  return (
    <>
      <h2>Client ID: {size}</h2>
      <form onSubmit={handleSubmit(handleAdd)}>
        <div>
          <label>Title: </label>
          <input
            type="text"
            {...register("clientTitle", { required: true })}
          />
        </div>

        <div>
          <label>Description: </label>
          <textarea
            {...register("clientDescription", { required: true })}
          />
        </div>

        <div>
          <label>Location: </label>
          <input
            type="text"
            {...register("clientLocation", { required: true })}
          />
        </div>

        <div>
          <label>Image Upload: </label>
          <input type="file" {...register("clientImage")} />
        </div>

        <div>
          <label>Client URL: </label>
          <input type="text" {...register("clientUrl")} />
        </div>

        <div>
          <label>Status: </label>
          <select {...register("status")}>
            <option value="A">Active</option>
            <option value="I">Inactive</option>
          </select>
        </div>

        <div>
          <label>Created By (UserId): </label>
          <input type="number" {...register("createdBy")} />
        </div>

        <div>
          <label>Created On: </label>
          <input type="date" {...register("createdOn")} />
        </div>

        <div>
          <label>Updated By (UserId): </label>
          <input type="number" {...register("updatedBy")} />
        </div>

        <div>
          <label>Updated On: </label>
          <input type="date" {...register("updatedOn")} />
        </div>

        <br />
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            reset({});
            navigate("/admin");
          }}
        >
          Cancel
        </button>
      </form>
    </>
  );
}

export default AddClient;
