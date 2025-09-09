import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AddBanner() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { size } = location.state || {};
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleAdd = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "bannerImage" && data.bannerImage && data.bannerImage[0]) {
          formData.append("bannerImage", data.bannerImage[0]); // file
        } else {
          formData.append(key, data[key]);
        }
      });

      // set auto bannerId
      formData.set("bannerId", size);

      const res = await axios.post(
        `${apiBase}/banner/banner`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 201) {
        alert("Banner added successfully!");
        navigate("/admin/banner-list");
        reset({});
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add banner");
    }
  };

  return (
    <div>
      <h2>Banner ID: {size} </h2>
      <form onSubmit={handleSubmit(handleAdd)}>

        <div>
          <label>Title: </label>
          <input
            type="text"
            {...register("bannerTitle", { required: true })}
          />
        </div>

        <div>
          <label>Content: </label>
          <textarea
            {...register("bannerContent", { required: true })}
          />
        </div>

        <div>
          <label>Image Upload (optional): </label>
          <input type="file" {...register("bannerImage")} />
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

export default AddBanner;
