import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "./Editor"; // ✅ import the same rich text editor

function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [editClient, setEditClient] = useState(false);
  const [editClientId, setEditClientId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [clientDescription, setClientDescription] = useState(""); // ✅ state for rich text

  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // fetch all clients
  useEffect(() => {
    axios
      .get(`${apiBase}/client/clients`, { withCredentials: true })
      .then((res) => setClients(res.data.payload || []))
      .catch((err) => console.error("Failed to fetch clients:", err));
  }, [apiBase]);

  // handle edit
  const handleEdit = (clientId) => {
    setEditClient(true);
    setEditClientId(clientId);

    const clientToEdit = clients.find((c) => c.clientId === clientId);
    if (!clientToEdit) return;

    reset(clientToEdit);
    setClientDescription(clientToEdit.clientDescription || ""); // ✅ load editor value

    if (clientToEdit.clientImage) {
      setImagePreview(`${apiBase}${clientToEdit.clientImage}`);
    } else {
      setImagePreview(null);
    }
  };

  // handle update
  const handleUpdate = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "clientImage" && data[key] && data[key][0]) {
          formData.append(key, data[key][0]);
        } else if (
          data[key] !== "" &&
          data[key] !== "null" &&
          data[key] !== null &&
          data[key] !== undefined
        ) {
          formData.append(key, data[key]);
        }
      });

      // ✅ add editor value separately
      formData.set("clientDescription", clientDescription);

      const res = await axios.put(
        `${apiBase}/client/client/${editClientId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        alert("Client updated successfully!");
        const refreshed = await axios.get(`${apiBase}/client/clients`, {
          withCredentials: true,
        });
        setClients(refreshed.data.payload || []);

        setEditClient(false);
        setEditClientId(null);
        setImagePreview(null);
        setClientDescription("");
        reset({});
      }
    } catch (err) {
      console.error("Failed to update client:", err);
      alert("Failed to update client");
    }
  };

  return (
    <div>
      {!editClient ? (
        <>
          <h2>Clients</h2>
          <button
            onClick={() =>
              navigate("/admin/add-client", {
                state: { size: clients.length + 1 },
              })
            }
          >
            Add Client
          </button>

          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Location</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.clientId}>
                  <td>{c.clientId}</td>
                  <td>{c.clientTitle}</td>
                  <td>{c.clientLocation}</td>
                  <td>{c.status}</td>
                  <td>
                    {c.updatedOn
                      ? new Date(c.updatedOn).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(c.clientId)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h2>Edit Client (ID: {editClientId})</h2>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div>
              <input type="text" {...register("clientId")} readOnly />
            </div>

            <div>
              <label>Title:</label>
              <input
                type="text"
                {...register("clientTitle", { required: true })}
              />
              {errors.clientTitle && <span>Required</span>}
            </div>

            <div>
              <label>Description:</label>
              {/* ✅ Replace textarea with the rich text Editor */}
              <Editor
                value={clientDescription}
                onChange={setClientDescription}
                apiBase={apiBase}
              />
              {errors.clientDescription && <span>Required</span>}
            </div>

            <div>
              <label>Location:</label>
              <input
                type="text"
                {...register("clientLocation", { required: true })}
              />
              {errors.clientLocation && <span>Required</span>}
            </div>

            <div>
              <label>Image Upload (optional):</label>
              <input
                type="file"
                {...register("clientImage")}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </div>

            {imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={imagePreview}
                  alt="Client Preview"
                  style={{
                    width: "150px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </div>
            )}

            <div>
              <label>Client URL:</label>
              <input
                type="text"
                {...register("clientUrl", { required: true })}
              />
              {errors.clientUrl && <span>Required</span>}
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
                setEditClient(false);
                setEditClientId(null);
                setImagePreview(null);
                setClientDescription("");
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

export default ClientManagement;
