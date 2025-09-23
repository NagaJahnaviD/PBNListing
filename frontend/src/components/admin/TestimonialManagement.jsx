import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "./Editor"; // ✅ import your rich text editor

function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState([]);
  const [editTestimonial, setEditTestimonial] = useState(false);
  const [editTestimonialId, setEditTestimonialId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [testimonialDescription, setTestimonialDescription] = useState(""); // ✅ state for editor

  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // fetch all testimonials
  useEffect(() => {
    axios
      .get(`${apiBase}/testimonial/testimonials`, { withCredentials: true })
      .then((res) => setTestimonials(res.data.payload || []))
      .catch((err) => console.error("Failed to fetch testimonials:", err));
  }, [apiBase]);

  // preview handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  // handle edit click
  const handleEdit = (testimonialId) => {
    setEditTestimonial(true);
    setEditTestimonialId(testimonialId);

    const testimonialToEdit = testimonials.find(
      (t) => t.testimonialId === testimonialId
    );
    if (!testimonialToEdit) return;

    // prefill form + editor
    reset(testimonialToEdit);
    setTestimonialDescription(testimonialToEdit.testimonialDescription || "");

    if (testimonialToEdit.testimonialImage) {
      setImagePreview(`${apiBase}${testimonialToEdit.testimonialImage}`);
    } else {
      setImagePreview(null);
    }
  };

  // handle update
  const handleUpdate = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "testimonialImage" && data[key] && data[key][0]) {
          formData.append("testimonialImage", data[key][0]);
        } else if (
          data[key] !== "" &&
          data[key] !== "null" &&
          data[key] !== null &&
          data[key] !== undefined
        ) {
          formData.append(key, data[key]);
        }
      });

      // ✅ add editor content explicitly
      formData.set("testimonialDescription", testimonialDescription);

      const res = await axios.put(
        `${apiBase}/testimonial/testimonial/${editTestimonialId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        alert("Testimonial updated successfully!");
        const refreshed = await axios.get(
          `${apiBase}/testimonial/testimonials`,
          { withCredentials: true }
        );
        setTestimonials(refreshed.data.payload || []);

        setEditTestimonial(false);
        setEditTestimonialId(null);
        setImagePreview(null);
        setTestimonialDescription("");
        reset({});
      }
    } catch (err) {
      console.error("Failed to update testimonial:", err);
      alert("Failed to update testimonial");
    }
  };

  return (
    <div>
      {!editTestimonial ? (
        <>
          <h2>Testimonials</h2>
          <button
            onClick={() =>
              navigate("/admin/add-testimonial", {
                state: { size: testimonials.length + 1 },
              })
            }
          >
            Add Testimonial
          </button>

          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Author</th>
                <th>Last Updated</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.testimonialId}>
                  <td>{t.testimonialAuthor}</td>
                  <td>
                    {t.updatedOn
                      ? new Date(t.updatedOn).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(t.testimonialId)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h2>Edit Testimonial (ID: {editTestimonialId})</h2>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div>
              <input type="number" {...register("testimonialId")} readOnly />
            </div>

            <div>
              <label>Title:</label>
              <input
                type="text"
                {...register("testimonialTitle", { required: true })}
              />
              {errors.testimonialTitle && <span>Required</span>}
            </div>

            <div>
              <label>Author:</label>
              <input
                type="text"
                {...register("testimonialAuthor", { required: true })}
              />
              {errors.testimonialAuthor && <span>Required</span>}
            </div>

            <div>
              <label>Description:</label>
              {/* ✅ Replace textarea with Editor */}
              <Editor
                value={testimonialDescription}
                onChange={setTestimonialDescription}
                apiBase={apiBase}
              />
              {errors.testimonialDescription && <span>Required</span>}
            </div>

            <div>
              <label>Image Upload (optional):</label>
              <input
                type="file"
                {...register("testimonialImage")}
                onChange={handleFileChange}
              />
              {imagePreview && (
                <div>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "150px", marginTop: "10px" }}
                  />
                </div>
              )}
            </div>

            <div>
              <label>Status:</label>
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
                setEditTestimonial(false);
                setEditTestimonialId(null);
                setImagePreview(null);
                setTestimonialDescription("");
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

export default TestimonialManagement;
