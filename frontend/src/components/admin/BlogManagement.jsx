import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(false);
  const [editBlogId, setEditBlogId] = useState(null);
  const navigate = useNavigate();

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // fetch all blogs
  useEffect(() => {
    axios
      .get(`${apiBase}/blog/blogs`,{withCredentials: true})
      .then((res) => setBlogs(res.data.payload || []))
      .catch((err) => console.error(err));
  }, []);

  // handle edit
  const handleEdit = (blogId) => {
    setEditBlog(true);
    setEditBlogId(blogId);

    const blogToEdit = blogs.find((b) => b.blogId === blogId);
    reset(blogToEdit);
  };

  // handle update
  const handleUpdate = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if ((key === "blogImage" || key === "blogBanner") && data[key] && data[key][0]) {
          formData.append(key, data[key][0]); // files
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await axios.put(
        `${apiBase}/blog/blog/${editBlogId}`,
        formData,
        { withCredentials: true,headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 200) {
        alert("Blog updated successfully!");
        const refreshed = await axios.get(`${apiBase}/blog/blogs`,{withCredentials: true});
        setBlogs(refreshed.data.payload || []);

        setEditBlog(false);
        setEditBlogId(null);
        reset({});
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
          <button
            onClick={() => navigate('/admin/add-blog', { state: { size: blogs.length + 1 } })}
          >
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
                  <td>{new Date(blog.blogDate).toLocaleDateString()}</td>
                  <td>{blog.blogAuthor}</td>
                  <td>{blog.status}</td>
                  <td>
                    {blog.updatedOn
                      ? new Date(blog.updatedOn).toLocaleDateString()
                      : "-"}
                  </td>
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

            <div>
              <label>Description: </label>
              <textarea {...register("blogDescription", { required: true })} />
            </div>

            <div>
              <label>Image Upload (optional): </label>
              <input type="file" {...register("blogImage")} />
            </div>

            <div>
              <label>Banner Upload (optional): </label>
              <input type="file" {...register("blogBanner")} />
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
                setEditBlog(false);
                setEditBlogId(null);
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
