// PageView.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap"; // Bootstrap JS for accordion

function PageView() {
  const { pageUrl } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    axios
      .get(`${apiBase}/page/pages/${pageUrl}`)
      .then((res) => {
        setPage(res.data.payload);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pageUrl]);

  // Initialize Bootstrap JS on dynamically added content
  useEffect(() => {
    if (!page) return;

    const accordionElList = document.querySelectorAll(".accordion");
    accordionElList.forEach((el) => {
      // eslint-disable-next-line no-new
      new bootstrap.Collapse(el, { toggle: false });
    });
  }, [page]);

  if (loading) return <p>Loading...</p>;
  if (!page) return <p>Page not found</p>;

  // template fallback (now supports 1,2,3,4)
  const templateId =
    [1, 2, 3, 4].includes(Number(page.templateId))
      ? Number(page.templateId)
      : 1;

  // reusable components
  const TopContent = () =>
    page.pageTopContent && (
      <div
        className="mb-md"
        dangerouslySetInnerHTML={{ __html: page.pageTopContent }}
      />
    );

  const Content = () =>
    page.pageContent && (
      <div dangerouslySetInnerHTML={{ __html: page.pageContent }} />
    );

  const BottomContent = () =>
    page.pageBottomContent && (
      <div
        className="mt-md"
        dangerouslySetInnerHTML={{ __html: page.pageBottomContent }}
      />
    );

  const Image = () =>
    page.pageImage && (
      <img
        src={`${apiBase}${page.pageImage}`}
        alt={page.pageTitle}
        className="img-responsive"
      />
    );

  return (
    <div>
      {/* Banner always visible */}
      <div
        className="page-banner"
        style={{
          backgroundImage: `url(${apiBase}${page.pageBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          height: "300px",
        }}
      >
        <div
          className="banner-overlay flex-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            height: "100%",
            width: "100%",
          }}
        >
          <h1 className="heading-1 text-center" style={{ color: "#fff" }}>
            {page.bannerCaption}
          </h1>
        </div>
      </div>
          <h1 className="container-app mt-md mx-5 px-5 mb-0">{page.pageTitle}</h1>
      <div className="container-app mt-0">
        <TopContent />
        {/* Template layouts */}
        {templateId === 1 && (
          <div className="row align-items-center mt-0">
            <div className="col-md-6">{<Image />}</div>
            <div className="col-md-6">{<Content />}</div>
          </div>
        )}

        {templateId === 2 && (
          <div className="row align-items-center mt-0">
            <div className="col-md-6">{<Content />}</div>
            <div className="col-md-6">{<Image />}</div>
          </div>
        )}

        {templateId === 3 && (
          <div className="text-center mt-0">
            <div className="mb-md">{<Image />}</div>
            <div>{<Content />}</div>
          </div>
        )}

        {templateId === 4 && (
          <div className="px-6 mx-5 mt-0">
            <div>{<Content />}</div>
          </div>
        )}

        <BottomContent />
      </div>
    </div>
  );
}

export default PageView;
