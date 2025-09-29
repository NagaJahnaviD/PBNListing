import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
import '../styles/bannerCarousel.css';
export default function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await axios.get(`${apiBase}/banner/banners`);
        setBanners(res.data.payload || []);
      } catch (err) {
        console.error('Failed to load banners', err);
      }
    }
    fetchBanners();
  }, [apiBase]);

  if (!banners.length) return null;

  return (
    <section className="banner-wrapper">
      <Carousel
        fade
        interval={5000}
        pause="hover"
        className="banner-carousel"
      >
        {banners.map(b => {
  if (!b.bannerVisibility) return null; // skip invisible banners
  return (
    <Carousel.Item key={b.bannerId} className="banner-slide">
      {b.bannerImage && (
        <img
          className="d-block w-100 banner-img"
          src={`${apiBase}${b.bannerImage}`}
          alt={b.bannerTitle}
        />
      )}
      <Carousel.Caption className="banner-caption">
        <h2>{b.bannerTitle}</h2>
        {b.bannerContent && (
          <div
            className="banner-content"
            dangerouslySetInnerHTML={{ __html: b.bannerContent }}
          />
        )}
        {b.bannerLink && (
          <a
            href={b.bannerLink}
            className="banner-btn"
            target="_blank"
            rel="noreferrer"
          >
            Learn More
          </a>
        )}
      </Carousel.Caption>
    </Carousel.Item>
  );
})}

      </Carousel>
    </section>
  );
}
