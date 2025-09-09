import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [editClient, setEditClient] = useState(false);
  const [editClientId, setEditClientId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      .catch((err) => console.error(err));
  }, []);

  // handle edit
  const handleEdit = (clientId) => {
  setEditClient(true);
  setEditClientId(clientId);

  const clientToEdit = clients.find((c) => c.clientId === clientId);
  reset(clientToEdit);

  // image preview for already stored image
  if (clientToEdit?.clientImage) {
    setImagePreview(`${apiBase}${clientToEdit.clientImage}`);
    console.log(`${apiBase}${clientToEdit.clientImage}`);
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
          formData.append(key, data[key][0]); // file
        } else if (
          data[key] !== "" &&
          data[key] !== "null" &&
          data[key] !== null &&
          data[key] !== undefined
        ) {
          formData.append(key, data[key]);
        }
      });

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
        reset({});
      }
    } catch (err) {
      console.error(err);
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
              navigate("/admin/add-client", { state: { size: clients.length + 1 } })
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
              {clients.map((client) => (
                <tr key={client.clientId}>
                  <td>{client.clientId}</td>
                  <td>{client.clientTitle}</td>
                  <td>{client.clientLocation}</td>
                  <td>{client.status}</td>
                  <td>
                    {client.updatedOn
                      ? new Date(client.updatedOn).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(client.clientId)}>
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
          <h2>Edit Client (ID: {editClientId})</h2>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div>
              <input type="text" {...register("clientId")} readOnly />
            </div>

            <div>
              <label>Title: </label>
              <input
                type="text"
                {...register("clientTitle", { required: true })}
              />
            </div>

            <div>
              <label>Description: </label>
              <textarea
                {...register("clientDescription", { required: true })}
              />
            </div>

            <div>
              <label>Location: </label>
              <input
                type="text"
                {...register("clientLocation", { required: true })}
              />
            </div>

            <div>
  <label>Image Upload (optional): </label>
  <input
    type="file"
    {...register("clientImage")}
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setImagePreview(URL.createObjectURL(e.target.files[0]));
        // console.log(e);
      }
    }}
  />
</div>

{imagePreview && (
  <div style={{ marginTop: "10px" }}>
    <img
      src={imagePreview}
      alt="Client Preview"
      style={{ width: "150px", border: "1px solid #ccc", borderRadius: "4px" }}
    />
  </div>
)}

            <div>
              <label>Client URL: </label>
              <input
                type="text"
                {...register("clientUrl", { required: true })}
              />
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
                setEditClient(false);
                setEditClientId(null);
                setImagePreview(null);
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
