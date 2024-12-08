import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaMapMarkerAlt } from 'react-icons/fa';

const LocationSelector = ({ setLocation }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const handleLocationSelect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          console.error(error);
          alert('Không thể lấy vị trí hiện tại');
        }
      );
    } else {
      alert('Trình duyệt của bạn không hỗ trợ Geolocation');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Button variant="info" onClick={handleLocationSelect}>
        <FaMapMarkerAlt className="me-2" />
        Chọn Vị Trí
      </Button>
      {lat && lng && (
        <div className="ms-3">
          Vị trí: {lat.toFixed(2)}, {lng.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
