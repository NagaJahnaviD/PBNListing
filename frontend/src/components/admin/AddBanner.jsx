import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "./Editor"
import { useRef } from 'react';

function AddBanner() {
  const quillRef = useRef();
  const [bannerContent, setBannerContent] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { size } = location.state || {};
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const [bannerImagePreview, setBannerImagePreview] = useState(null);

  const handleFilePreview = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleAdd = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "bannerImage" && data.bannerImage && data.bannerImage[0]) {
          formData.append("bannerImage", data.bannerImage[0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      formData.set("bannerId", size);
      formData.set("bannerContent", bannerContent);

      const res = await axios.post(
        `${apiBase}/banner`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 201) {
        alert("Banner added successfully!");
        navigate("/admin/banner-list");
        reset({});
        setBannerImagePreview(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add banner");
    }
  };

  return (
    <div>
      <h2>Banner ID: {size}</h2>
      <form onSubmit={handleSubmit(handleAdd)}>

        <div>
          <label>Title: </label>
          <input type="text" {...register("bannerTitle", { required: true })} />
        </div>

        <div>
          <label>Content:</label>
          <Editor value={bannerContent} onChange={setBannerContent} apiBase={apiBase} />

        </div>

        <div>
          <label>Image Upload (optional): </label>
          {bannerImagePreview && (
            <img
              src={bannerImagePreview}
              alt="Banner Preview"
              style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
            />
          )}
          <input
            type="file"
            {...register("bannerImage")}
            onChange={(e) => handleFilePreview(e, setBannerImagePreview)}
          />
        </div>

        <div>
          <label>Link: </label>
          <input type="text" {...register("bannerLink")} />
        </div>

        <div>
          <label>Visible: </label>
          <input type="checkbox" {...register("bannerVisibility")} />
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
        <button type="submit">Add</button>
        <button
          type="button"
          onClick={() => { reset({}); setBannerImagePreview(null); }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddBanner;
