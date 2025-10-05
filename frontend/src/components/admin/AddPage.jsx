import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "./Editor";

function AddPage() {
  const [bannerPreview, setBannerPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [pageContent, setPageContent] = useState("");
  const [pageTopContent, setPageTopContent] = useState("");
  const [pageBottomContent, setPageBottomContent] = useState("");

  const { register, handleSubmit, reset } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { size } = location.state || {};
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleFilePreview = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleAdd = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if ((key === "pageImage" || key === "pageBanner") && data[key]?.[0]) {
          formData.append(key, data[key][0]);
        } else if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      // Add editor values
      formData.set("pageId", size);
      formData.set("pageContent", pageContent);
      formData.set("pageTopContent", pageTopContent);
      formData.set("pageBottomContent", pageBottomContent);

      const res = await axios.post(`${apiBase}/page/page`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        alert("Page created successfully!");
        reset({});
        setBannerPreview(null);
        setImagePreview(null);
        setPageContent("");
        setPageTopContent("");
        setPageBottomContent("");
        navigate("/admin");
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

        {/* Main page content */}
        <div>
          <label>Content:</label>
          <Editor value={pageContent} onChange={setPageContent} apiBase={apiBase} />
        </div>

        <div>
          <label>Page URL: </label>
          <input type="text" {...register("pageUrl", { required: true })} />
        </div>

        {/* Banner upload */}
        <div>
          <label>Page Banner (optional): </label>
          {bannerPreview && (
            <img
              src={bannerPreview}
              alt="Banner Preview"
              style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
            />
          )}
          <input type="file" {...register("pageBanner")} onChange={(e) => handleFilePreview(e, setBannerPreview)} />
        </div>

        {/* Image upload */}
        <div>
          <label>Page Image (optional): </label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Page Image Preview"
              style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
            />
          )}
          <input type="file" {...register("pageImage")} onChange={(e) => handleFilePreview(e, setImagePreview)} />
        </div>

        {/* === Added Editors for Top & Bottom content === */}
        <div>
          <label>Page Top Content:</label>
          <Editor value={pageTopContent} onChange={setPageTopContent} apiBase={apiBase} />
        </div>

        <div>
          <label>Page Bottom Content:</label>
          <Editor value={pageBottomContent} onChange={setPageBottomContent} apiBase={apiBase} />
        </div>
        {/* ============================================= */}

        <div>
          <label>Send Email: </label>
          <input type="text" {...register("sendEmail", )} />
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
            setPageContent("");
            setPageTopContent("");
            setPageBottomContent("");
            navigate("/admin");
          }}
        >
          Cancel
        </button>
      </form>
    </>
  );
}

export default AddPage;
