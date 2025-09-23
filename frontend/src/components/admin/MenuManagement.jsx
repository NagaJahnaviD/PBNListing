import React, { useEffect, useState } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";

export default function MenuTree() {
  const [treeData, setTreeData] = useState([]);
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axios.get(`${apiBase}/menu/menus`,{withCredentials:true});
        const formatted = res.data.payload.map((m) => ({
          id: m.menuId,
          parent: m.menuParent || 0, // 0 = root
          text: m.menuName,
          droppable: true,
        }));
        setTreeData(formatted);
      } catch (err) {
        console.error("Failed to fetch menus:", err);
      }
    };
    fetchMenus();
  }, []);

  // Handle drop & update database
  const handleDrop = async (newTree) => {
    setTreeData(newTree);

    const payload = newTree.map((node, index) => ({
      menuId: node.id,
      menuParent: node.parent === 0 ? 0 : node.parent,
      menuOrder: index + 1,
    }));

    try {
      await axios.put(`${apiBase}/menu/menus/reorder`, payload,{withCredentials:true});
      console.log("Menu order updated successfully!");
    } catch (err) {
      console.error("Failed to update menu order:", err);
      alert("Failed to update menu order");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>Menu Tree</h2>
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => (
            <div
              style={{
                marginLeft: depth * 20,
                padding: "6px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                marginBottom: "4px",
                background: "#f9f9f9",
                display: "flex",
                alignItems: "center",
                cursor: "grab",
              }}
            >
              {node.droppable && (
                <span
                  onClick={onToggle}
                  style={{ marginRight: "8px", userSelect: "none" }}
                >
                  {isOpen ? "▼" : "▶"}
                </span>
              )}
              {node.text}
            </div>
          )}
          dragPreviewRender={(monitorProps) => (
            <div
              style={{
                padding: "6px 10px",
                border: "1px solid #aaa",
                borderRadius: "4px",
                background: "#eee",
              }}
            >
              {monitorProps.item.text}
            </div>
          )}
          onDrop={handleDrop}
        />
      </div>
    </DndProvider>
  );
}
