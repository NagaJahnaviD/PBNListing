// src/components/SiteFooter.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/stylesFramework.css';

function Footer() {
  const [config, setConfig] = useState(null);
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";


  useEffect(() => {
    console.log("Footer component mounted");
    // fetch the latest configuration (public endpoint—remove adminAuth in API)
    axios
      .get(`${apiBase}/configuration/latest-public`)
      .then((res) => setConfig(res.data.payload))
      .catch((err) => console.error("Footer config error:", err));
  }, [apiBase]);

  if (!config){ console.log("nope");return null;}

  return (
    <div className="footer-app">
      <div className="container-app footer-grid">
        {/* Left: Logo & About */}
        <div className="footer-section">
          <img
            src={`${apiBase}${config.footerLogo}`}
            alt={config.websiteTitle}
            className="footer-logo"
          />
          <p className="mt-md">{config.footerText}</p>
<div className="footer-social mt-md">
  {config.facebookLink && (
    <a href={config.facebookLink} target="_blank" rel="noreferrer">
      Facebook
    </a>
  )}
  {config.instagramLink && (
    <a href={config.instagramLink} target="_blank" rel="noreferrer">
      Instagram
    </a>
  )}
  {config.linkedinLink && (
    <a href={config.linkedinLink} target="_blank" rel="noreferrer">
      LinkedIn
    </a>
  )}
  {config.youTubeLink && (
    <a href={config.youTubeLink} target="_blank" rel="noreferrer">
      YouTube
    </a>
  )}
</div>

        </div>

        {/* Middle: Quick Links */}
        <div className="footer-section">
  <h3 className="heading-3">Quick Links</h3>
  <p className="footer-links">
    {config.quickLinks[0]
      .split(",")                     // turn "Home,About,FAQ" into ["Home","About","FAQ"]
      .map((link, i, arr) => (
        <React.Fragment key={i}>
          <a href={`/${link.trim().toLowerCase()}`}>{link.trim()}</a><br/>
        </React.Fragment>
      ))}
  </p>
</div>

        {/* Right: Contact */}
        <div className="footer-section">
          <h3 className="heading-3">Contact</h3>
          <p>{config.footerContact}</p>
          <p>
            <a href={`tel:${config.websiteMobileNumber}`}>{config.websiteMobileNumber}</a>
          </p>
          <p>
             <a href={`mailto:${config.websiteEmail}`}>{config.websiteEmail}</a>
          </p>
        </div>
      </div>
      <div className="footer-bottom mt-md">
        <small>{config.footerCopyRight}</small>
      </div>
    </div>
  );
}
export default Footer;