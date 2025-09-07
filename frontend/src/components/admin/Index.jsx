import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Index() {
  const [pages, setPages] = useState([]);
  const [editPage, setEditPage] = useState(false);
  const [editPageId, setEditPageId] = useState(null);

  const navigate=useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // fetch all pages
  useEffect(() => {
    axios
      .get(`${apiBase}/page/pages`)
      .then((res) => setPages(res.data.payload || []))
      .catch((err) => console.error(err));
  }, []);

  // handle edit click
  const handleEdit = (pageId) => {
    setEditPage(true);
    setEditPageId(pageId);

    const pageToEdit = pages.find((p) => p.pageId === pageId);

    // Reset form (except for file input which must be empty always)
    reset({
      ...pageToEdit,
      pageImage: "", // file input stays empty
    });
  };

  // handle update with FormData (file + text fields)
  const handleUpdate = async (data) => {
    try {
      const formData = new FormData();

      // creating the image in form data 
      Object.keys(data).forEach((key) => {
        if (key === "pageImage" && data.pageImage && data.pageImage[0]) {
          formData.append("pageImage", data.pageImage[0]); // file
        } else {
          formData.append(key, data[key]);
        }
      });
     
      const res = await axios.put(
        `${apiBase}/page/page/${editPageId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 200) {
        alert("Page updated successfully!");
        const refreshed = await axios.get(`${apiBase}/page/pages`);
        setPages(refreshed.data.payload || []);

        setEditPage(false);
        setEditPageId(null);
        reset({});
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update page");
    }
  };

  return (
    <div>
      {!editPage ? (
        <>
          <h2>Pages</h2>
          <button
            onClick={() => navigate('/admin/add-page', { state: { size: pages.length + 1 } })}
          >
            Add Page
          </button>
          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Page Title</th>
                <th>Visible</th>
                <th>Last Updated</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.pageId}>
                  <td>{page.pageId}</td>
                  <td>{page.pageTitle}</td>
                  <td>{page.pageVisibility ? "Yes" : "No"}</td>
                  <td>
                    {page.updatedOn
                      ? new Date(page.updatedOn).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(page.pageId)}>
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
          <h2>Edit Page (ID: {editPageId})</h2>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div>
              <input type="number" {...register("pageId")} readOnly />
            </div>

            <div>
              <label>Title: </label>
              <input
                type="text"
                {...register("pageTitle", { required: true })}
              />
            </div>
            

            <div>
              <label>Banner Caption: </label>
              <input
                type="text"
                {...register("bannerCaption", { required: true })}
              />
            </div>

            <div>
              <label>Content: </label>
              <textarea {...register("pageContent", { required: true })} />
            </div>

            <div>
              <label>Image Upload (optional): </label>
              <input type="file" {...register("pageImage")} />
            </div>

            <div>
              <label>Url: </label>
              <input type="text" {...register("pageUrl")} />
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
                setEditPage(false);
                setEditPageId(null);
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

export default Index;
