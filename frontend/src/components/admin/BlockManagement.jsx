import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "./Editor";

function BlockManagement() {
  const [blocks, setBlocks] = useState([]);
  const [editBlock, setEditBlock] = useState(false);
  const [editBlockId, setEditBlockId] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [editBlockContent, setEditBlockContent] = useState("");

  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch all blocks
  useEffect(() => {
    axios
      .get(`${apiBase}/block/blocks`, { withCredentials: true })
      .then((res) => setBlocks(res.data.payload || []))
      .catch((err) => console.error(err));
  }, []);

  // Handle file preview
  const handleFilePreview = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Handle edit click
  const handleEdit = (blockId) => {
    setEditBlock(true);
    setEditBlockId(blockId);
    setNewImagePreview(null);

    const blockToEdit = blocks.find((b) => b.blockId === blockId);
    reset(blockToEdit);
    setEditBlockContent(blockToEdit.blockContent || "");
  };

  // Handle update
  const handleUpdate = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "blockImage" && data.blockImage && data.blockImage[0]) {
          formData.append("blockImage", data.blockImage[0]);
        } else if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      // Include editor content
      formData.set("blockContent", editBlockContent);

      const res = await axios.put(
        `${apiBase}/block/block/${editBlockId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        alert("Block updated successfully!");
        const refreshed = await axios.get(`${apiBase}/block/blocks`, {
          withCredentials: true,
        });
        setBlocks(refreshed.data.payload || []);

        setEditBlock(false);
        setEditBlockId(null);
        setNewImagePreview(null);
        setEditBlockContent("");
        reset({});
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update block");
    }
  };

  return (
    <div>
      {!editBlock ? (
        <>
          <h2>Blocks</h2>
          <button
            onClick={() =>
              navigate("/admin/add-block", { state: { size: blocks.length + 1 } })
            }
          >
            Add Block
          </button>

          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Block Title</th>
                <th>Subtitle</th>
                <th>Status</th>
                <th>Visible</th>
                <th>Last Updated</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block) => (
                <tr key={block.blockId}>
                  <td>{block.blockId}</td>
                  <td>{block.blockTitle}</td>
                  <td>{block.blockSubtitle}</td>
                  <td>{block.status}</td>
                  <td>{block.blockVisibility ? "Yes" : "No"}</td>
                  <td>
                    {block.updatedOn
                      ? new Date(block.updatedOn).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(block.blockId)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h2>Edit Block (ID: {editBlockId})</h2>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div>
              <input type="number" {...register("blockId")} readOnly />
            </div>

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
              <Editor
                value={editBlockContent}
                onChange={setEditBlockContent}
                apiBase={apiBase}
              />
            </div>

            {/* Block Image Preview */}
            <div>
              <label>Image Upload (optional): </label>

              {/* Existing image */}
              {blocks.find((b) => b.blockId === editBlockId)?.blockImage &&
                !newImagePreview && (
                  <img
                    src={`${apiBase}${blocks.find((b) => b.blockId === editBlockId).blockImage}`}
                    alt="Current Block"
                    style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
                  />
                )}

              {/* New image preview */}
              {newImagePreview && (
                <img
                  src={newImagePreview}
                  alt="New Block Preview"
                  style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
                />
              )}

              <input
                type="file"
                {...register("blockImage")}
                onChange={(e) => handleFilePreview(e, setNewImagePreview)}
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

            <br />
            <button type="submit">Save</button>
            <button
              type="button"
              onClick={() => {
                setEditBlock(false);
                setEditBlockId(null);
                setNewImagePreview(null);
                setEditBlockContent("");
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

export default BlockManagement;
