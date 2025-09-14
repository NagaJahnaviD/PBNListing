import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [editBanner, setEditBanner] = useState(false);
  const [editBannerId, setEditBannerId] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);

  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const { register, handleSubmit, reset, setValue } = useForm();

  // Fetch all banners
  useEffect(() => {
    axios
      .get(`${apiBase}/banner/banners`, { withCredentials: true })
      .then((res) => setBanners(res.data.payload || []))
      .catch((err) => console.error(err));
  }, []);

  // Handle file preview
 const handleFilePreview = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Handle edit click
  const handleEdit = (bannerId) => {
    setEditBanner(true);
    setEditBannerId(bannerId);
    setNewImagePreview(null);

    const bannerToEdit = banners.find((b) => b.bannerId === bannerId);
    reset(bannerToEdit);
  };

  // Handle update
  const handleUpdate = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "bannerImage" && data.bannerImage?.length > 0) {
          formData.append("bannerImage", data.bannerImage[0]);
        } else if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      const res = await axios.put(
        `${apiBase}/banner/banner/${editBannerId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        alert("Banner updated successfully!");
        const refreshed = await axios.get(`${apiBase}/banner/banners`, { withCredentials: true });
        setBanners(refreshed.data.payload || []);
        setEditBanner(false);
        setEditBannerId(null);
        setNewImagePreview(null);
        reset({});
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update banner");
    }
  };

  return (
    <div>
      {!editBanner ? (
        <>
          <h2>Banners</h2>
          <button
            onClick={() =>
              navigate("/admin/add-banner", { state: { size: banners.length + 1 } })
            }
          >
            Add Banner
          </button>

          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Content</th>
                <th>Status</th>
                <th>Visible</th>
                <th>Last Updated</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.bannerId}>
                  <td>{banner.bannerId}</td>
                  <td>{banner.bannerTitle}</td>
                  <td>{banner.bannerContent}</td>
                  <td>{banner.status}</td>
                  <td>{banner.bannerVisibility ? "Yes" : "No"}</td>
                  <td>
                    {banner.updatedOn
                      ? new Date(banner.updatedOn).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(banner.bannerId)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h2>Edit Banner (ID: {editBannerId})</h2>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div>
              <input type="number" {...register("bannerId")} readOnly />
            </div>

            <div>
              <label>Title: </label>
              <input type="text" {...register("bannerTitle", { required: true })} />
            </div>

            <div>
              <label>Content: </label>
              <textarea {...register("bannerContent", { required: true })} />
            </div>

            <div>
              <label>Image Upload (optional): </label>

              {/* Existing image */}
              {/* Existing image */}
              {banners.find((b) => b.bannerId === editBannerId)?.bannerImage &&
                !newImagePreview && (
                  <img
                    src={`${apiBase}${banners.find((b) => b.bannerId === editBannerId).bannerImage}`}
                    alt="Current Banner"
                    style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
                  />
                )}


              {/* New image preview */}
              {newImagePreview && (
                <img
                  src={newImagePreview}
                  alt="New Banner Preview"
                  style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
                />
              )}

              <input type="file" {...register("bannerImage")} onChange={(e) => handleFilePreview(e, setNewImagePreview)} />
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

            <br />
            <button type="submit">Save</button>
            <button
              type="button"
              onClick={() => {
                setEditBanner(false);
                setEditBannerId(null);
                setNewImagePreview(null);
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

export default BannerManagement;
