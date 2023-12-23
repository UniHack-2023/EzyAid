import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const customMarkerIcon = new L.Icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const Map = () => {
  const [waypoints, setWaypoints] = useState([]);

  useEffect(() => {
    const fetchWaypoints = async () => {
      try {
        const response = await axios.get('/locatii');
        const locatiiData = response.data;
        const newWaypoints = Object.entries(locatiiData).map(([location, data]) => {
          let coordinates = [];
          if (Array.isArray(data.coords)) {
            coordinates = data.coords.map(coord => coord.split(',').map(c => parseFloat(c)));
          } else if (typeof data.coords === 'string') {
            coordinates = [data.coords.split(',').map(c => parseFloat(c))];
          }

          const items = data.items.map(item => `${item.item}: ${item.count}`).join('<br>');
          return {
            coordinates,
            title: `${location}<br>${items}`,
          };
        });
        setWaypoints(newWaypoints);
      } catch (error) {
        console.error('Error fetching waypoints:', error);
      }
    };

    fetchWaypoints();
  }, []);

  useEffect(() => {
    const map = L.map('map').setView([45.9432, 24.9668], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    waypoints.forEach((waypoint) => {
      waypoint.coordinates.forEach(coord => {
        L.marker(coord, { icon: customMarkerIcon })
          .bindPopup(`<h3>${waypoint.title}</h3>`)
          .addTo(map);
      });
    });

    return () => map.remove();
  }, [waypoints]);

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default Map;
