import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "./Editor"

function AddBlog() {
  const [blogDescription, setBlogDescription] = useState("");
  const [blogImagePreview, setBlogImagePreview] = useState(null);
  const [blogBannerPreview, setBlogBannerPreview] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { size } = location.state || {};
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // handle file preview
  const handleFilePreview = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleAdd = async (data) => {
    const formData = new FormData();
    try {
      Object.keys(data).forEach((key) => {
        if ((key === "blogImage" || key === "blogBanner") && data[key] && data[key][0]) {
          formData.append(key, data[key][0]); // file
        } else if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });
      formData.set("blogId", size);
      formData.set("blogDescription", blogDescription);

      const res = await axios.post(`${apiBase}/blog/blog`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 201) {
        alert("Blog created successfully");
        reset({});
        setBlogImagePreview(null);
        setBlogBannerPreview(null);
        navigate('/admin/blog-list');
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create blog");
    }
  };

  return (
    <div>
      <h2>Blog ID: {size}</h2>
      <form onSubmit={handleSubmit(handleAdd)}>

        <div>
          <label>Title: </label>
          <input type="text" {...register("blogTitle", { required: true })} />
        </div>

        <div>
          <label>Date: </label>
          <input type="date" {...register("blogDate", { required: true })} />
        </div>

        <div>
          <label>Description: </label>
          <Editor value={blogDescription} onChange={setBlogDescription} apiBase={apiBase} />

        </div>

        <div>
          <label>Author: </label>
          <input type="text" {...register("blogAuthor")} />
        </div>

        <div>
          <label>URL: </label>
          <input type="text" {...register("blogUrl")} />
        </div>

        {/* Blog Image Preview */}
        <div>
          <label>Blog Image (optional): </label>
          {blogImagePreview && (
            <img
              src={blogImagePreview}
              alt="Blog Image Preview"
              style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
            />
          )}
          <input
            type="file"
            {...register("blogImage")}
            onChange={(e) => handleFilePreview(e, setBlogImagePreview)}
          />
        </div>

        {/* Blog Banner Preview */}
        <div>
          <label>Blog Banner (optional): </label>
          {blogBannerPreview && (
            <img
              src={blogBannerPreview}
              alt="Blog Banner Preview"
              style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
            />
          )}
          <input
            type="file"
            {...register("blogBanner")}
            onChange={(e) => handleFilePreview(e, setBlogBannerPreview)}
          />
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
          onClick={() => {
            reset({});
            setBlogImagePreview(null);
            setBlogBannerPreview(null);
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddBlog;
