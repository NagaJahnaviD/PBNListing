import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(false);
  const [editBlogId, setEditBlogId] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [newBannerPreview, setNewBannerPreview] = useState(null);
  const [editorValue, setEditorValue] = useState(""); // <-- state for Quill content

  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    axios
      .get(`${apiBase}/blog/blogs`, { withCredentials: true })
      .then((res) => setBlogs(res.data.payload || []))
      .catch((err) => console.error(err));
  }, [apiBase]);

  const handleFilePreview = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleEdit = (blogId) => {
    setEditBlog(true);
    setEditBlogId(blogId);
    setNewImagePreview(null);
    setNewBannerPreview(null);

    const blogToEdit = blogs.find((b) => b.blogId === blogId);

    if (blogToEdit?.blogDate) {
      blogToEdit.blogDate = new Date(blogToEdit.blogDate).toISOString().split("T")[0];
    }

    // Set Quill editor value separately
    setEditorValue(blogToEdit.blogDescription || "");

    reset({
      ...blogToEdit,
      blogImage: "",
      blogBanner: "",
    });
  };

  const handleUpdate = async (data) => {
    try {
      const formData = new FormData();

      // Attach editor content to formData
      formData.append("blogDescription", editorValue);

      Object.keys(data).forEach((key) => {
        if ((key === "blogImage" || key === "blogBanner") && data[key] && data[key][0]) {
          formData.append(key, data[key][0]);
        } else if (
          key !== "blogDescription" && // avoid duplicate
          data[key] !== "" &&
          data[key] !== null &&
          data[key] !== undefined
        ) {
          formData.append(key, data[key]);
        }
      });

      const res = await axios.put(`${apiBase}/blog/blog/${editBlogId}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        alert("Blog updated successfully!");
        const refreshed = await axios.get(`${apiBase}/blog/blogs`, { withCredentials: true });
        setBlogs(refreshed.data.payload || []);
        setEditBlog(false);
        setEditBlogId(null);
        setNewImagePreview(null);
        setNewBannerPreview(null);
        reset({});
        setEditorValue("");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update blog");
    }
  };

  return (
    <div>
      {!editBlog ? (
        <>
          <h2>Blogs</h2>
          <button onClick={() => navigate("/admin/add-blog", { state: { size: blogs.length + 1 } })}>
            Add Blog
          </button>
          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Date</th>
                <th>Author</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.blogId}>
                  <td>{blog.blogId}</td>
                  <td>{blog.blogTitle}</td>
                  <td>{blog.blogDate ? new Date(blog.blogDate).toLocaleDateString() : "-"}</td>
                  <td>{blog.blogAuthor}</td>
                  <td>{blog.status}</td>
                  <td>{blog.updatedOn ? new Date(blog.updatedOn).toLocaleDateString() : "-"}</td>
                  <td>
                    <button onClick={() => handleEdit(blog.blogId)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h2>Edit Blog (ID: {editBlogId})</h2>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div>
              <input type="number" {...register("blogId")} readOnly />
            </div>

            <div>
              <label>Title: </label>
              <input type="text" {...register("blogTitle", { required: true })} />
            </div>

            <div>
              <label>Date: </label>
              <input type="date" {...register("blogDate", { required: true })} />
            </div>

            {/* Rich-text editor for description */}
            <div>
              <label>Description: </label>
              <ReactQuill
                theme="snow"
                value={editorValue}
                onChange={setEditorValue}
                style={{ height: "250px", marginBottom: "40px" }}
              />
            </div>

            {/* Blog Image Preview */}
            <div>
              <label>Blog Image (optional): </label>
              {blogs.find(b => b.blogId === editBlogId)?.blogImage && !newImagePreview && (
                <img
                  src={`${apiBase}${blogs.find(b => b.blogId === editBlogId).blogImage}`}
                  alt="Current Blog"
                  style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
                />
              )}
              {newImagePreview && (
                <img
                  src={newImagePreview}
                  alt="New Blog Preview"
                  style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
                />
              )}
              <input type="file" {...register("blogImage")} onChange={(e) => handleFilePreview(e, setNewImagePreview)} />
            </div>

            {/* Blog Banner Preview */}
            <div>
              <label>Blog Banner (optional): </label>
              {blogs.find(b => b.blogId === editBlogId)?.blogBanner && !newBannerPreview && (
                <img
                  src={`${apiBase}${blogs.find(b => b.blogId === editBlogId).blogBanner}`}
                  alt="Current Banner"
                  style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
                />
              )}
              {newBannerPreview && (
                <img
                  src={newBannerPreview}
                  alt="New Banner Preview"
                  style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
                />
              )}
              <input type="file" {...register("blogBanner")} onChange={(e) => handleFilePreview(e, setNewBannerPreview)} />
            </div>

            <div>
              <label>Author: </label>
              <input type="text" {...register("blogAuthor")} />
            </div>

            <div>
              <label>Blog URL: </label>
              <input type="text" {...register("blogUrl")} />
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
                setEditBlog(false);
                setEditBlogId(null);
                setNewImagePreview(null);
                setNewBannerPreview(null);
                setEditorValue("");
                reset({});
              }}
            >
              Cancel
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default BlogManagement;
