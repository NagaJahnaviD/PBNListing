import React from 'react'
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AddPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { size } = location.state || {};
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleAdd = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if ((key === "pageImage" || key === "pageBanner") && data[key] && data[key][0]) {
          formData.append(key, data[key][0]); // file upload
        } else if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      formData.set("pageId", size);

      const res = await axios.post(
        `${apiBase}/page/page`,
        formData,
        { withCredentials: true,headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 201) {
        alert("Page created successfully!");
        reset({});
        navigate('/admin');
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create page");
    }
  };

  return (
    <>
      <h2>Page ID: {size}</h2>
      <form onSubmit={handleSubmit(handleAdd)}>

        <div>
          <label>Page Content ID: </label>
          <input type="number" {...register("pageContentId", { required: true })} />
        </div>

        <div>
          <label>Title: </label>
          <input type="text" {...register("pageTitle", { required: true })} />
        </div>

        <div>
          <label>Banner Caption: </label>
          <input type="text" {...register("bannerCaption", { required: true })} />
        </div>

        <div>
          <label>Page Content: </label>
          <textarea {...register("pageContent", { required: true })} />
        </div>

        <div>
          <label>Page URL: </label>
          <input type="text" {...register("pageUrl", { required: true })} />
        </div>

        <div>
          <label>Page Banner (optional): </label>
          <input type="file" {...register("pageBanner")} />
        </div>

        <div>
          <label>Page Image (optional): </label>
          <input type="file" {...register("pageImage")} />
        </div>

        <div>
          <label>Page Top Content: </label>
          <textarea {...register("pageTopContent")} />
        </div>

        <div>
          <label>Page Bottom Content: </label>
          <textarea {...register("pageBottomContent")} />
        </div>

        <div>
          <label>Send Email: </label>
          <select {...register("sendEmail")}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div>
          <label>Provided Menu Link: </label>
          <input type="text" {...register("providedMenuLink", { required: true })} />
        </div>

        <div>
          <label>Class: </label>
          <input type="text" {...register("class")} />
        </div>

        <div>
          <label>Meta Description: </label>
          <textarea {...register("metaDescrition")} />
        </div>

        <div>
          <label>Meta Keywords: </label>
          <textarea {...register("metaKeywords")} />
        </div>

        <div>
          <label>Template ID: </label>
          <input type="number" {...register("templateId", { required: true })} />
        </div>

        <div>
          <label>Publish Status: </label>
          <select {...register("publishStatus")}>
            <option value="false">Unpublished</option>
            <option value="true">Published</option>
          </select>
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
            navigate('/admin');
          }}
        >
          Cancel
        </button>
      </form>
    </>
  );
}

export default AddPage;
