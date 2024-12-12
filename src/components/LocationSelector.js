import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';

const LocationSelector = ({ location, setLocation }) => {
  // const [location, setLocalLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const geocoder = L.Control.Geocoder.nominatim();

  const handleChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  }

  const handleSearch = (e) => {
    const query = searchQuery;
    setLoading(true);
    setSearchResults([]);
    if (query.length > 2) {
      geocoder.geocode(query, (results) => {
        setSearchResults(results);
        setLoading(false);
      });
    } else {
      setLoading(false);
      setSearchResults([]);
    }
  };

  const handleSelectResult = (result) => {
    const { lat, lng } = result.center;
    //setLocalLocation({ lat, lng });
    setLocation({ lat, lng }); // Cập nhật location từ setLocation được truyền vào
    setSearchQuery(result.name);
    setSearchResults([]);
  };

  const MapMoveToLocation = () => {
    const map = useMap();
    if (location) {
      map.flyTo([location.lat, location.lng], 15);
    }
    return null;
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchQuery}
          placeholder="Tìm kiếm địa chỉ..."
          onChange={handleChange}
          style={{ width: '80%', padding: '10px', marginBottom: '10px' }}
        />
        <button
          type="button"
          onClick={handleSearch}
          style={{ width: '20%', padding: '10px', marginBottom: '10px' }}
          disabled={loading}
        >
          Chọn
        </button>
        {loading && <div>Loading...</div>}
        {searchResults.length > 0 && (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {searchResults.map((result, index) => (
              <li
                key={index}
                style={{ padding: '5px', cursor: 'pointer' }}
                onClick={() => handleSelectResult(result)}
              >
                {result.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {(
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={20}
          style={{ width: '100%', height: '400px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapMoveToLocation />
          <MapClickHandler setLocation={setLocation} />
          {location && (
            <Marker position={location}>
              <Popup>
                Latitude: {location.lat} <br /> Longitude: {location.lng}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      )}

    </div>
  );
};

const MapClickHandler = ({ setLocation }) => {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      setLocation({ lat, lng });
    }
  });

  return null;
};

export default LocationSelector;
