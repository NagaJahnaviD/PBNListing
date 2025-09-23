import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "./Editor"

function AddClient() {
  const [clientDescription, setClientDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // 1️⃣ preview state

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

  // 2️⃣ handle file selection
  const handleFilePreview = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleAdd = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "clientImage" && data[key] && data[key][0]) {
          formData.append(key, data[key][0]);
        } else if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
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
        setImagePreview(null); // clear preview after save
        navigate("/admin/client-list");
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
          <input type="text" {...register("clientTitle", { required: true })} />
        </div>

        <div>
          <label>Description: </label>
          <Editor value={clientDescription} onChange={setClientDescription} apiBase={apiBase} />

        </div>

        <div>
          <label>Location: </label>
          <input type="text" {...register("clientLocation", { required: true })} />
        </div>

        <div>
          <label>Image Upload: </label>
          
          {/* 3️⃣ Preview image */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Client Preview"
              style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
            />
          )}

          <input
            type="file"
            {...register("clientImage")}
            onChange={handleFilePreview} // attach preview handler
          />
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

        <br />
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            reset({});
            setImagePreview(null); // clear preview on cancel
            navigate("/admin/client-list");
          }}
        >
          Cancel
        </button>
      </form>
    </>
  );
}

export default AddClient;
