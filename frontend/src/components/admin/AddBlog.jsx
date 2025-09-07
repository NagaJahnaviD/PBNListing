

import React from 'react'
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AddBlog() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { size } = location.state || {};
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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

      console.log("Form Data Entries:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const res = await axios.post(`${apiBase}/blog/blog`,
        formData,
        { withCredentials: true,headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 201) {
        alert("Blog created successfully");
        navigate('/admin/blog-list');
        reset({});
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
          <textarea {...register("blogDescription", { required: true })} />
        </div>

        <div>
          <label>Author: </label>
          <input type="text" {...register("blogAuthor")} />
        </div>

        <div>
          <label>URL: </label>
          <input type="text" {...register("blogUrl")} />
        </div>

        <div>
          <label>Blog Image (optional): </label>
          <input type="file" {...register("blogImage")} />
        </div>

        <div>
          <label>Blog Banner (optional): </label>
          <input type="file" {...register("blogBanner")} />
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
          onClick={() => reset({})}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddBlog;
