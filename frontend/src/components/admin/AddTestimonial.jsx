import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "./Editor"

function AddTestimonial() {
  const [imagePreview, setImagePreview] = useState(null); // 1️⃣ state for preview
    const [testimonialDescription, setTestimonialDescription] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { size } = location.state || {};
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // 2️⃣ handle file selection for preview
  const handleFilePreview = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleAdd = async (data) => {
    const formData = new FormData();
    try {
      Object.keys(data).forEach((key) => {
        if (key === "testimonialImage" && data.testimonialImage && data.testimonialImage[0]) {
          formData.append("testimonialImage", data.testimonialImage[0]);
        } else if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      formData.set("testimonialId", size);
      formData.set("testimonialDescription", testimonialDescription);

      const res = await axios.post(
        `${apiBase}/testimonial/testimonial`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 201) {
        alert("Testimonial created successfully");
        reset({});
        setImagePreview(null); // clear preview
        navigate("/admin/testimonial-list");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create testimonial");
    }
  };

  return (
    <div>
      <h2>Testimonial ID: {size} </h2>
      <form onSubmit={handleSubmit(handleAdd)}>

        <div>
          <label>User ID: </label>
          <input type="number" {...register("userId", { required: true })} />
        </div>

        <div>
          <label>Service ID: </label>
          <input type="number" {...register("serviceId", { required: true })} />
        </div>

        <div>
          <label>User Name: </label>
          <input type="text" {...register("userName", { required: true })} />
        </div>

        <div>
          <label>Title: </label>
          <input type="text" {...register("testimonialTitle", { required: true })} />
        </div>

        <div>
          <label>Description: </label>
          <Editor value={testimonialDescription} onChange={setTestimonialDescription} apiBase={apiBase} />

        </div>

        <div>
          <label>Author: </label>
          <input type="text" {...register("testimonialAuthor", { required: true })} />
        </div>

        <div>
          <label>Author City: </label>
          <input type="text" {...register("authorCity")} />
        </div>

        <div>
          <label>Review Value (1-5): </label>
          <input type="number" min="1" max="5" {...register("reviewValue", { required: true })} />
        </div>

         <div>
          <label>Image Upload (optional): </label>

          {/* 3️⃣ display image preview */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Testimonial Preview"
              style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
            />
          )}

          <input
            type="file"
            {...register("testimonialImage")}
            onChange={handleFilePreview} // attach preview handler
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
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddTestimonial;
