const socket = io();
// Object to store markers
const markers = {};

// Listen for "receive-location" event from server
socket.on('receive-location', (data) => {
  const { id, latitude, longitude } = data;
  console.log('Location received:', data);
  updateMarker(id, latitude, longitude);
});

// Listen for "user-disconnected" event from server
socket.on('user-disconnected', (id) => {
  console.log('User disconnected:', id);
  removeMarker(id);
});

// Function to update or create marker on map
function updateMarker(id, latitude, longitude) {
  if (!markers[id]) {
    console.log('Creating new marker for:', id);
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  } else {
    console.log('Updating marker for:', id);
    markers[id].setLatLng([latitude, longitude]);
  }
}

// Function to remove marker from map
function removeMarker(id) {
  if (markers[id]) {
    console.log('Removing marker for:', id);
    map.removeLayer(markers[id]);
    delete markers[id];
  }
}

// Code for obtaining geolocation and emitting "send-location" event
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log('Sending location:', { latitude, longitude });
      socket.emit('send-location', { latitude, longitude });
    },
    (error) => {
      console.error('Geolocation error:', error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}

// Initialize Leaflet map
const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Your attribution here',
}).addTo(map);
