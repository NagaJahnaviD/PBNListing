import React from 'react'
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function AddBlock() {
        const {register, handleSubmit,reset, formState: { errors },} = useForm();
        const location = useLocation();
        const navigate=useNavigate();
        const { size } = location.state || {};
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
        const handleAdd = async (data) => {
        try {
                const formData = new FormData();
                Object.keys(data).forEach((key) => {
                if (key === "blockImage" && data.blockImage && data.blockImage[0]) {
                formData.append("blockImage", data.blockImage[0]); // file
                } else {
                formData.append(key, data[key]);
                }
            });
                formData.set("blockId", size); 
                const res = await axios.post(`${apiBase}/block/block`,
                formData,
                { withCredentials:true,
                  headers: { "Content-Type": "multipart/form-data" } }
            );
            if (res.status === 201) {
            alert("Block updated successfully!");
            navigate('/admin/block-list');
            reset({});
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update block");
        }
        };


  return (
    <div>
        <h2>Block ID: {size} </h2>
          <form onSubmit={handleSubmit(handleAdd)}>

            <div>
              <label>Title: </label>
              <input
                type="text"
                {...register("blockTitle", { required: true })}
              />
            </div>

            <div>
              <label>Subtitle: </label>
              <input
                type="text"
                {...register("blockSubtitle", { required: true })}
              />
            </div>

            <div>
              <label>Content: </label>
              <textarea
                {...register("blockContent", { required: true })}
              />
            </div>

            <div>
              <label>Image Upload (optional): </label>
              <input type="file" {...register("blockImage")} />
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
  )
}

export default AddBlock;