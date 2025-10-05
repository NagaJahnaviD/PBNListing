import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "./Editor";
import "react-quill/dist/quill.snow.css";

function Index() {
  const [pages, setPages] = useState([]);
  const [editPage, setEditPage] = useState(false);
  const [editPageId, setEditPageId] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [newBannerPreview, setNewBannerPreview] = useState(null);

  // editor states
  const [contentValue, setContentValue] = useState("");
  const [topContentValue, setTopContentValue] = useState("");
  const [bottomContentValue, setBottomContentValue] = useState("");

  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const { register, handleSubmit, reset } = useForm();

  // Fetch all pages
  useEffect(() => {
    axios
      .get(`${apiBase}/page/pages`, { withCredentials: true })
      .then((res) => setPages(res.data.payload || []))
      .catch((err) => console.error(err));
  }, [apiBase]);

  // Handle edit click
  const handleEdit = (pageId) => {
    setEditPage(true);
    setEditPageId(pageId);
    setNewImagePreview(null);
    setNewBannerPreview(null);

    const pageToEdit = pages.find((p) => p.pageId === pageId);

    // Set editor content separately
    setContentValue(pageToEdit.pageContent || "");
    setTopContentValue(pageToEdit.pageTopContent || "");
    setBottomContentValue(pageToEdit.pageBottomContent || "");

    reset({
      ...pageToEdit,
      pageImage: "",
      pageBanner: "",
    });
  };

  // Preview handlers
  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) setNewImagePreview(URL.createObjectURL(file));
  };

  const handleBannerPreview = (e) => {
    const file = e.target.files[0];
    if (file) setNewBannerPreview(URL.createObjectURL(file));
  };

  // Update page
  const handleUpdate = async (data) => {
    try {
      const formData = new FormData();

      // Add editor fields
      formData.append("pageContent", contentValue);
      formData.append("pageTopContent", topContentValue);
      formData.append("pageBottomContent", bottomContentValue);

      Object.keys(data).forEach((key) => {
        if ((key === "pageImage" || key === "pageBanner") && data[key] && data[key][0]) {
          formData.append(key, data[key][0]);
        } else if (
          !["pageContent", "pageTopContent", "pageBottomContent"].includes(key) &&
          data[key] !== "" &&
          data[key] !== null &&
          data[key] !== undefined
        ) {
          formData.append(key, data[key]);
        }
      });

      const res = await axios.put(
        `${apiBase}/page/page/${editPageId}`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 200) {
        alert("Page updated successfully!");
        const refreshed = await axios.get(`${apiBase}/page/pages`, { withCredentials: true });
        setPages(refreshed.data.payload || []);

        setEditPage(false);
        setEditPageId(null);
        setNewImagePreview(null);
        setNewBannerPreview(null);
        reset({});
        setContentValue("");
        setTopContentValue("");
        setBottomContentValue("");
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
            onClick={() =>
              navigate("/admin/add-page", { state: { size: pages.length + 1 } })
            }
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
                  <td>{page.publishStatus ? "Yes" : "No"}</td>
                  <td>
                    {page.updatedOn
                      ? new Date(page.updatedOn).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(page.pageId)}>Edit</button>
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
              <input type="text" {...register("pageTitle", { required: true })} />
            </div>

            <div>
              <label>Banner Caption: </label>
              <input type="text" {...register("bannerCaption", { required: true })} />
            </div>

            {/* Rich Text Editors */}
            <div>
              <label>Content: </label>
              <Editor
                value={contentValue}
                onChange={setContentValue}
                apiBase={apiBase}
              />
           </div>

            <div className="pt-5">
              <label>Page Top Content: </label>
              <Editor
                value={topContentValue}
                onChange={setTopContentValue}
                apiBase={apiBase}
              />
              </div>

            <div className="pt-5">
              <label>Page Bottom Content: </label>
              <Editor
                value={bottomContentValue}
                onChange={setBottomContentValue}
                apiBase={apiBase}
              />
            </div>

            <div className="pt-5">
              <label>Page URL: </label>
              <input type="text" {...register("pageUrl", { required: true })} />
            </div>

            {/* Page Banner with preview */}
            <div>
              <label>Page Banner (optional): </label>
              {pages.find(p => p.pageId === editPageId)?.pageBanner && !newBannerPreview && (
                <img
                  src={`${apiBase}${pages.find(p => p.pageId === editPageId).pageBanner}`}
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
              <input type="file" {...register("pageBanner")} onChange={handleBannerPreview} />
            </div>

            {/* Page Image with preview */}
            <div>
              <label>Page Image (optional): </label>
              {pages.find(p => p.pageId === editPageId)?.pageImage && !newImagePreview && (
                <img
                  src={`${apiBase}${pages.find(p => p.pageId === editPageId).pageImage}`}
                  alt="Current Page"
                  style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
                />
              )}
              {newImagePreview && (
                <img
                  src={newImagePreview}
                  alt="New Image Preview"
                  style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
                />
              )}
              <input type="file" {...register("pageImage")} onChange={handleImagePreview} />
            </div>

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

            <br />
            <button type="submit">Save</button>
            <button
              type="button"
              onClick={() => {
                setEditPage(false);
                setEditPageId(null);
                setNewImagePreview(null);
                setNewBannerPreview(null);
                setContentValue("");
                setTopContentValue("");
                setBottomContentValue("");
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
