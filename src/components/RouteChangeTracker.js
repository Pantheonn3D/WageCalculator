// src/components/RouteChangeTracker.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const pagePath = location.pathname + location.search;
    ReactGA.send({ hitType: "pageview", page: pagePath, title: document.title });
    console.log(`GA: Pageview sent for ${pagePath}`);
  }, [location]);

  return null;
};

export default RouteChangeTracker;