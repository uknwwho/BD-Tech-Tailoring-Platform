import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AddressMapPicker.css';

// Fix Leaflet's default icon path issue in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom indigo marker for primary selection
const primaryIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Service area marker (blue)
const serviceIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Default center: Dhaka, Bangladesh
const DHAKA_CENTER = [23.8103, 90.4125];
const API_URL = import.meta.env.VITE_API_URL;

// --- Sub-component: Handles map click events ---
const MapClickHandler = ({ onClick }) => {
    useMapEvents({
        click: (e) => {
            onClick(e.latlng);
        }
    });
    return null;
};

// --- Sub-component: Fly to location when it changes ---
const FlyToLocation = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 16, { duration: 1.2 });
        }
    }, [position, map]);
    return null;
};

/**
 * AddressMapPicker
 *
 * Props:
 *   mode        — 'single' (customer: one address) or 'multi' (tailor: multiple service areas)
 *   disabled    — read-only mode
 *   onAddressSelect(addressObj) — callback when address is selected (single mode)
 *   onServiceAreasChange(areas) — callback when service areas change (multi mode)
 *   initialPosition — [lat, lng] to center the map initially
 *   selectedAreas — array of { name, lat, lng } for multi mode pre-fill
 *   selectedAddress — { displayName, lat, lng } for single mode pre-fill
 */
const AddressMapPicker = ({
    mode = 'single',
    disabled = false,
    onAddressSelect,
    onServiceAreasChange,
    initialPosition,
    selectedAreas = [],
    selectedAddress = null
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [locating, setLocating] = useState(false);

    // Single mode state
    const [markerPos, setMarkerPos] = useState(
        selectedAddress ? [selectedAddress.lat, selectedAddress.lng] : null
    );
    const [addressInfo, setAddressInfo] = useState(selectedAddress || null);

    // Multi mode state
    const [areas, setAreas] = useState(selectedAreas || []);

    // Fly-to target
    const [flyTarget, setFlyTarget] = useState(null);

    const searchTimeout = useRef(null);
    const searchInputRef = useRef(null);

    // Sync external selectedAreas prop
    useEffect(() => {
        if (mode === 'multi' && selectedAreas) {
            setAreas(selectedAreas);
        }
    }, [selectedAreas, mode]);

    // --- Reverse geocode a lat/lng ---
    const reverseGeocode = useCallback(async (lat, lng) => {
        try {
            const res = await fetch(`${API_URL}/address/reverse?lat=${lat}&lng=${lng}`);
            const data = await res.json();
            if (data.success) {
                return data.result;
            }
        } catch (err) {
            console.error('Reverse geocode error:', err);
        }
        return null;
    }, []);

    // --- Handle map click ---
    const handleMapClick = useCallback(async (latlng) => {
        if (disabled) return;

        const { lat, lng } = latlng;
        const result = await reverseGeocode(lat, lng);

        if (mode === 'single') {
            setMarkerPos([lat, lng]);
            const info = result ? {
                displayName: result.displayName,
                lat: result.lat,
                lng: result.lng,
                address: result.address
            } : {
                displayName: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                lat, lng,
                address: {}
            };
            setAddressInfo(info);
            setFlyTarget([lat, lng]);
            if (onAddressSelect) onAddressSelect(info);
        } else {
            // Multi mode — add new service area
            const areaName = result
                ? (result.address.area || result.address.city || result.displayName.split(',')[0])
                : `Area (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

            // Deduplicate — don't add if already exists within ~500m
            const isDuplicate = areas.some(a =>
                Math.abs(a.lat - lat) < 0.005 && Math.abs(a.lng - lng) < 0.005
            );
            if (isDuplicate) return;

            const newArea = { name: areaName, lat, lng };
            const updatedAreas = [...areas, newArea];
            setAreas(updatedAreas);
            setFlyTarget([lat, lng]);
            if (onServiceAreasChange) onServiceAreasChange(updatedAreas);
        }

        // Clear search
        setSearchQuery('');
        setSearchResults([]);
    }, [disabled, mode, areas, reverseGeocode, onAddressSelect, onServiceAreasChange]);

    // --- Search with debounce ---
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (value.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        searchTimeout.current = setTimeout(async () => {
            try {
                const res = await fetch(`${API_URL}/address/search?q=${encodeURIComponent(value)}`);
                const data = await res.json();
                if (data.success) {
                    setSearchResults(data.results);
                }
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setSearching(false);
            }
        }, 400);
    };

    // --- Select a search result ---
    const handleSelectResult = (result) => {
        const lat = result.lat;
        const lng = result.lng;

        if (mode === 'single') {
            setMarkerPos([lat, lng]);
            setAddressInfo(result);
            setFlyTarget([lat, lng]);
            if (onAddressSelect) onAddressSelect(result);
        } else {
            const areaName = result.address.area || result.address.city || result.displayName.split(',')[0];
            const isDuplicate = areas.some(a =>
                Math.abs(a.lat - lat) < 0.005 && Math.abs(a.lng - lng) < 0.005
            );
            if (!isDuplicate) {
                const newArea = { name: areaName, lat, lng };
                const updatedAreas = [...areas, newArea];
                setAreas(updatedAreas);
                setFlyTarget([lat, lng]);
                if (onServiceAreasChange) onServiceAreasChange(updatedAreas);
            }
        }

        setSearchQuery('');
        setSearchResults([]);
    };

    // --- Remove a service area tag ---
    const handleRemoveArea = (index) => {
        if (disabled) return;
        const updatedAreas = areas.filter((_, i) => i !== index);
        setAreas(updatedAreas);
        if (onServiceAreasChange) onServiceAreasChange(updatedAreas);
    };

    // --- Use My Location ---
    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const result = await reverseGeocode(lat, lng);

                if (mode === 'single') {
                    setMarkerPos([lat, lng]);
                    const info = result ? {
                        displayName: result.displayName,
                        lat: result.lat,
                        lng: result.lng,
                        address: result.address
                    } : { displayName: `${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng, address: {} };
                    setAddressInfo(info);
                    setFlyTarget([lat, lng]);
                    if (onAddressSelect) onAddressSelect(info);
                } else {
                    // In multi mode, locate just centers the map
                    setFlyTarget([lat, lng]);
                }

                setLocating(false);
            },
            (err) => {
                console.error('Geolocation error:', err);
                alert('Could not detect your location. Please allow location access.');
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const mapCenter = initialPosition || DHAKA_CENTER;

    return (
        <div className={`address-map-picker ${disabled ? 'disabled' : ''}`}>
            {/* Map */}
            <div className="amp-map-container">
                <MapContainer
                    center={mapCenter}
                    zoom={initialPosition ? 14 : 12}
                    scrollWheelZoom={!disabled}
                    dragging={!disabled}
                    doubleClickZoom={!disabled}
                    zoomControl={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {!disabled && <MapClickHandler onClick={handleMapClick} />}
                    <FlyToLocation position={flyTarget} />

                    {/* Single mode marker */}
                    {mode === 'single' && markerPos && (
                        <Marker position={markerPos} icon={primaryIcon}>
                            <Popup>
                                <strong>📍 Selected Location</strong>
                                <br />
                                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                    {addressInfo?.displayName || 'Loading...'}
                                </span>
                            </Popup>
                        </Marker>
                    )}

                    {/* Multi mode markers */}
                    {mode === 'multi' && areas.map((area, idx) => (
                        <Marker key={idx} position={[area.lat, area.lng]} icon={serviceIcon}>
                            <Popup>
                                <strong>📌 {area.name}</strong>
                                <br />
                                <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                                    Service Area #{idx + 1}
                                </span>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Search Overlay */}
            {!disabled && (
                <div className="amp-search-overlay">
                    <div className="amp-search-bar">
                        <span className="amp-search-icon">🔍</span>
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="amp-search-input"
                            placeholder={mode === 'single'
                                ? "Search for your address..."
                                : "Search for a service area..."
                            }
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button
                            type="button"
                            className={`amp-locate-btn ${locating ? 'loading' : ''}`}
                            onClick={handleLocateMe}
                            title="Use my location"
                        >
                            {locating ? '⏳' : '📍'}
                        </button>
                    </div>

                    {/* Search Results */}
                    {(searchResults.length > 0 || searching) && (
                        <div className="amp-search-results">
                            {searching && (
                                <div className="amp-loading">
                                    <div className="amp-spinner"></div>
                                    Searching...
                                </div>
                            )}
                            {searchResults.map((result, idx) => (
                                <div
                                    key={idx}
                                    className="amp-search-result-item"
                                    onClick={() => handleSelectResult(result)}
                                >
                                    <span className="amp-result-pin">📌</span>
                                    <span className="amp-result-text">{result.displayName}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Single mode — Selected Address Card */}
            {mode === 'single' && addressInfo && (
                <div className="amp-address-card">
                    <div className="amp-address-pin">📍</div>
                    <div className="amp-address-details">
                        <div className="amp-address-label">Selected Address</div>
                        <div className="amp-address-text">{addressInfo.displayName}</div>
                        <div className="amp-address-coords">
                            {addressInfo.lat?.toFixed(6)}, {addressInfo.lng?.toFixed(6)}
                        </div>
                    </div>
                </div>
            )}

            {/* Multi mode — Service Area Tags */}
            {mode === 'multi' && (
                <>
                    {areas.length > 0 ? (
                        <div className="amp-tags-container">
                            {areas.map((area, idx) => (
                                <div key={idx} className="amp-tag">
                                    <span className="amp-tag-icon">📌</span>
                                    {area.name}
                                    {!disabled && (
                                        <button
                                            type="button"
                                            className="amp-tag-remove"
                                            onClick={() => handleRemoveArea(idx)}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="amp-helper">
                            <span className="amp-helper-icon">💡</span>
                            Click on the map or search to add service areas
                        </div>
                    )}
                </>
            )}

            {/* Single mode — Empty helper */}
            {mode === 'single' && !addressInfo && (
                <div className="amp-helper">
                    <span className="amp-helper-icon">💡</span>
                    Click on the map, search, or use your location to set your address
                </div>
            )}
        </div>
    );
};

export default AddressMapPicker;
