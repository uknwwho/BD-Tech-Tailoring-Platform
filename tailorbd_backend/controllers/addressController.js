// Address Controller — Proxy to Nominatim (OpenStreetMap) geocoding API
// This avoids CORS issues and centralizes geocoding logic server-side

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'TailorBD-Platform/1.0';

// Forward search: address text → coordinates + structured address
export const searchAddress = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({ success: false, message: "Query must be at least 2 characters." });
        }

        const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=5&countrycodes=bd`;

        const response = await fetch(url, {
            headers: { 'User-Agent': USER_AGENT }
        });
        const data = await response.json();

        const results = data.map(item => ({
            displayName: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            address: {
                street: item.address?.road || item.address?.pedestrian || '',
                area: item.address?.suburb || item.address?.neighbourhood || item.address?.county || '',
                city: item.address?.city || item.address?.town || item.address?.state_district || '',
                division: item.address?.state || '',
                postalCode: item.address?.postcode || '',
                country: item.address?.country || 'Bangladesh'
            }
        }));

        res.status(200).json({ success: true, results });
    } catch (error) {
        console.error("Address search error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Reverse geocode: coordinates → structured address
export const reverseGeocode = async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: "lat and lng are required." });
        }

        const url = `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

        const response = await fetch(url, {
            headers: { 'User-Agent': USER_AGENT }
        });
        const data = await response.json();

        if (data.error) {
            return res.status(404).json({ success: false, message: "No address found for these coordinates." });
        }

        const result = {
            displayName: data.display_name,
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lon),
            address: {
                street: data.address?.road || data.address?.pedestrian || '',
                area: data.address?.suburb || data.address?.neighbourhood || data.address?.county || '',
                city: data.address?.city || data.address?.town || data.address?.state_district || '',
                division: data.address?.state || '',
                postalCode: data.address?.postcode || '',
                country: data.address?.country || 'Bangladesh'
            }
        };

        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error("Reverse geocode error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
