import React, { useEffect, useState } from "react";
import axios from "axios";
import BannerCarousel from "./BannerCarousel";
import "../styles/stylesFramework.css";
import "react-quill/dist/quill.snow.css";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function Home() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await axios.get(`${apiBase}/block`);
        setBlocks(res.data.payload || []);
      } catch (err) {
        console.error("Error fetching blocks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlocks();
  }, []);

  if (loading) return <p className="text-center">Loading blocks...</p>;

  // 🔹 Renderer: Block with Image
  const RenderWithImage = (block) => (
    <div className="mb-md container ">
      <div className="grid-2">
        {/* Left Content */}
        <div
          className="flex-center"
          style={{ flexDirection: "column", alignItems: "flex-start" }}
        >
          {block.blockTitle && (
            <h2 className="heading-2 mb-sm">{block.blockTitle}</h2>
          )}
          {block.blockSubtitle && (
            <h4 className="heading-3 text-muted mb-sm">
              {block.blockSubtitle}
            </h4>
          )}
          {block.blockContent && (
            <div
              className="text-body mb-sm"
              dangerouslySetInnerHTML={{ __html: block.blockContent }}
            />
          )}
          {block.blockLink && (
            <a
              href={block.blockLink}
              className="button-app"
              style={{
                background: "var(--color-primary)",
                color: "#fff",
                padding: "var(--space-sm) var(--space-md)",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
              }}
            >
              Learn More
            </a>
          )}
        </div>

        {/* Right Image */}
        <div className="flex-center">
          <img
            src={`${apiBase}${block.blockImage}`}
            alt={block.blockTitle}
            className="img-responsive "
          />
        </div>
      </div>
    </div>
  );

  // 🔹 Renderer: Simple centered block
  const RenderSimple = (block) => (
    <div className="mb-md container ">
      <div className="flex-center" style={{ flexDirection: "column" }}>
        {block.blockTitle && (
          <h2 className="heading-2 mb-sm text-center">{block.blockTitle}</h2>
        )}
        {block.blockSubtitle && (
          <h4 className="heading-3 text-muted mb-sm text-center">
            {block.blockSubtitle}
          </h4>
        )}
        {block.blockContent && (
          <div
            className="text-center text-body mb-sm w-75"
            dangerouslySetInnerHTML={{ __html: block.blockContent }}
          />
        )}
        {block.blockLink && (
          <a
            href={block.blockLink}
            className="button-app"
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              padding: "var(--space-sm) var(--space-md)",
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
            }}
          >
            Learn More
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <BannerCarousel />

      {/* Block 1 → With Image */}
      <div  className="mt-md">
      {blocks[0] && blocks[0].blockVisibility && RenderWithImage(blocks[0])}
      </div>
      {/* Remaining Blocks → Simple */}
      {blocks[1] && blocks[1].blockVisibility && RenderSimple(blocks[1])}
      {blocks[2] && blocks[2].blockVisibility && RenderSimple(blocks[2])}
      {blocks[3] && blocks[3].blockVisibility && RenderSimple(blocks[3])}
      {blocks[4] && blocks[4].blockVisibility && RenderSimple(blocks[4])}
      {blocks[5] && blocks[5].blockVisibility && RenderSimple(blocks[5])}
      {blocks[6] && blocks[6].blockVisibility && RenderSimple(blocks[6])}
      {blocks[7] && blocks[7].blockVisibility && RenderSimple(blocks[7])}
    </div>
  );
}

export default Home;
