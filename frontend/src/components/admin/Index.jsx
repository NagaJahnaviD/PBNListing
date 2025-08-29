import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function Index() {
  const [blocks, setBlocks] = useState([]);
  const [editBlock, setEditBlock] = useState(false);
  const [editBlockId, setEditBlockId] = useState(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // fetch all blocks
  useEffect(() => {
    axios
      .get(`${apiBase}/block/blocks`)
      .then((res) => setBlocks(res.data.payload || []))
      .catch((err) => console.error(err));
  }, []);

  // handle edit click
  const handleEdit = (blockId) => {
    setEditBlock(true);
    setEditBlockId(blockId);

    const blockToEdit = blocks.find((b) => b.blockId === blockId);
    reset(blockToEdit); // fill form with existing values
  };

const handleUpdate = async (data) => {
  try {
    const res = await axios.put(`${apiBase}/block/block/${editBlockId}`, data);

    console.log("Update response:", res.data); // 👀 see what your API sends

    // instead of matching an exact string
    if (res.status === 200) {
      alert("Block updated successfully!");
      const refreshed = await axios.get(`${apiBase}/block/blocks`);
      setBlocks(refreshed.data.payload || []);

      // ✅ switch back to table immediately
      setEditBlock(false);
      setEditBlockId(null);
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
                    <button onClick={() => handleEdit(block.blockId)}>
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
          <h2>Edit Block (ID: {editBlockId})</h2>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div>
              <input type="number" {...register("blockId")} readOnly />
            </div>

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
              <label>Image URL: </label>
              <input type="text" {...register("blockImage")} />
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
            <button type="submit">Save</button>
            <button
              type="button"
              onClick={() => {
                setEditBlock(false);
                setEditBlockId(null);
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
