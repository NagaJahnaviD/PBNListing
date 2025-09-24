import React, { useEffect, useState } from "react";
import axios from "axios";

function buildMenuTree(items) {
  const lookup = {};
  const roots = [];
  items.forEach(item => (lookup[item.menuId] = { ...item, children: [] }));
  items.forEach(item => {
    if (item.menuParent && item.menuParent !== 0) {
      lookup[item.menuParent]?.children.push(lookup[item.menuId]);
    } else {
      roots.push(lookup[item.menuId]);
    }
  });
  const sortTree = node => {
    node.children.sort((a, b) => a.menuOrder - b.menuOrder);
    node.children.forEach(sortTree);
  };
  roots.sort((a, b) => a.menuOrder - b.menuOrder);
  roots.forEach(sortTree);
  return roots;
}

/** Desktop menu node using state for hover */
function DesktopMenuNode({ node }) {
  const [open, setOpen] = useState(false);

  return (
    <li
      style={{ position: "relative", listStyle: "none" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a
        href={node.menuLink}
        target={node.targetStatus === "_blank" ? "_blank" : "_self"}
        style={{ padding: "8px 12px", display: "block", textDecoration: "none", color: "#fff" }}
      >
        {node.menuName}
      </a>
      {node.children.length > 0 && open && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "#444",
            margin: 0,
            padding: 0,
            minWidth: "150px",
          }}
        >
          {node.children.map(child => (
            <DesktopMenuNode key={child.menuId} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

/** Mobile menu node */
function MobileMenuNode({ node }) {
  const [open, setOpen] = useState(false);
  return (
    <li style={{ listStyle: "none", borderBottom: "1px solid #555" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px" }}>
        <a
          href={node.menuLink}
          target={node.targetStatus === "_blank" ? "_blank" : "_self"}
          style={{ textDecoration: "none", color: "#fff" }}
        >
          {node.menuName}
        </a>
        {node.children.length > 0 && (
          <button
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", color: "#fff", fontSize: "16px", cursor: "pointer" }}
          >
            {open ? "-" : "+"}
          </button>
        )}
      </div>
      {open && node.children.length > 0 && (
        <ul style={{ paddingLeft: "16px" }}>
          {node.children.map(child => (
            <MobileMenuNode key={child.menuId} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function UserHeader() {
  const [menuTree, setMenuTree] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axios.get(`${apiBase}/menu/users/menus`, { withCredentials: true });
        setMenuTree(buildMenuTree(res.data.payload || []));
      } catch (err) {
        console.error(err);
      }
    };
    fetchMenus();
  }, [apiBase]);

  return (
    <header style={{ background: "#333", color: "#fff", position: "relative" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", height: "60px" }}>
        <div style={{ fontWeight: "bold", fontSize: "20px" }}>My Website</div>

        {/* Desktop */}
        <nav style={{ display: "none" }} className="desktop-menu">
          <ul style={{ display: "flex", margin: 0, padding: 0 }}>
            {menuTree.map(node => (
              <DesktopMenuNode key={node.menuId} node={node} />
            ))}
          </ul>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", color: "#fff", fontSize: "24px", cursor: "pointer", display: "block" }} className="mobile-toggle">
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav style={{ background: "#444" }} className="mobile-menu">
          <ul style={{ margin: 0, padding: 0 }}>
            {menuTree.map(node => (
              <MobileMenuNode key={node.menuId} node={node} />
            ))}
          </ul>
        </nav>
      )}

      {/* Responsive CSS */}
      <style>{`
        @media(min-width: 768px) {
          .desktop-menu { display: block !important; }
          .mobile-toggle, .mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  );
}
