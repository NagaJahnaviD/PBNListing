import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "./Editor"
import { useRef } from 'react';
function AddBlock() {
  const quillRef = useRef();
  const [blockContent, setBlockContent] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { size } = location.state || {};
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Image preview state
  const [blockImagePreview, setBlockImagePreview] = useState(null);

  // Handle file preview
  const handleFilePreview = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleAdd = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "blockImage" && data.blockImage && data.blockImage[0]) {
          formData.append("blockImage", data.blockImage[0]); // file
        } 
        else {
          formData.append(key, data[key]);
        }
      });
      formData.set("blockId", size);
      formData.set("blockContent", blockContent);
      const res = await axios.post(`${apiBase}/block/block`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 201) {
        alert("Block added successfully!");
        navigate('/admin/block-list');
        reset({});
        setBlockImagePreview(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add block");
    }
  };

  return (
    <div>
      <h2>Block ID: {size}</h2>
      <form onSubmit={handleSubmit(handleAdd)}>

        <div>
          <label>Title: </label>
          <input type="text" {...register("blockTitle", { required: true })} />
        </div>

        <div>
          <label>Subtitle: </label>
          <input type="text" {...register("blockSubtitle", { required: true })} />
        </div>

        <div>
          <label>Content:</label>
          <Editor value={blockContent} onChange={setBlockContent} apiBase={apiBase} />

        </div>

        {/* Block Image Preview */}
        <div>
          <label>Image Upload (optional): </label>
          {blockImagePreview && (
            <img
              src={blockImagePreview}
              alt="Block Preview"
              style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
            />
          )}
          <input
            type="file"
            {...register("blockImage")}
            onChange={(e) => handleFilePreview(e, setBlockImagePreview)}
          />
        </div>

        <div>
          <label>Link: </label>
          <input type="text" {...register("blockLink")} />
        </div>

        <div>
          <label>Visible: </label>
          <input type="checkbox" {...register("blockVisibility")} />
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
        <button type="button" onClick={() => { reset({}); setBlockImagePreview(null); }}>
          Cancel
        </button>
      </form>
    </div>
  )
}

export default AddBlock;
