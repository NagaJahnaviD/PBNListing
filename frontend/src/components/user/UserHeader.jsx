import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/header.css";
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

/* Desktop Node */
function DesktopMenuNode({ node }) {
  return (
    <li className="menu-item">
      <a
        href={node.menuLink}
        target={node.targetStatus === "_blank" ? "_blank" : "_self"}
        className="menu-link"
      >
        {node.menuName}
      </a>
      {node.children.length > 0 && (
        <ul className="submenu">
          {node.children.map(child => (
            <DesktopMenuNode key={child.menuId} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

/* Mobile Node */
function MobileMenuNode({ node }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="mobile-item">
      <div className="mobile-row">
        <a
          href={node.menuLink}
          target={node.targetStatus === "_blank" ? "_blank" : "_self"}
          className="menu-link"
        >
          {node.menuName}
        </a>
        {node.children.length > 0 && (
          <button
            className="mobile-toggle-btn"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Submenu"
          >
            {open ? "−" : "+"}
          </button>
        )}
      </div>
      {open && node.children.length > 0 && (
        <ul className="mobile-submenu">
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
        const res = await axios.get(`${apiBase}/menu/users/menus`, {
          withCredentials: true,
        });
        setMenuTree(buildMenuTree(res.data.payload || []));
      } catch (err) {
        console.error(err);
      }
    };
    fetchMenus();
  }, [apiBase]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="logo">My Website</div>

        {/* Desktop Menu */}
        <nav className="desktop-menu">
          <ul className="menu-list">
            {menuTree.map(node => (
              <DesktopMenuNode key={node.menuId} node={node} />
            ))}
          </ul>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Open Menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="mobile-menu">
          <ul className="mobile-list">
            {menuTree.map(node => (
              <MobileMenuNode key={node.menuId} node={node} />
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
