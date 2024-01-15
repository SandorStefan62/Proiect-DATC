import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

function MapComponent({ apiKey, showAddModal }) {
    const [position, setPosition] = useState({ lat: 0, lng: 0 });
    const [allergenZones, setAllergenZones] = useState([]);
    const [newMarker, setNewMarker] = useState(null);
    const [allergenType, setAllergenType] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);
    apiKey = "AIzaSyAqs4IjsXNJNnlnNhW7atHmzLzmg0vNne8"

    const fetchAllergenZones = async () => {
        try {
            const response = await axios.get('https://datcbackend.azurewebsites.net/api/allergen/getAllAllergens', {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });

            if (response.status === 200) {
                const data = await response.data;
                console.log(data);
                setAllergenZones(data.allergens);
            }
        } catch (error) {
            console.error("Error fetching allergen zones:", error);
        }
    }

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            resolve({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            });
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                });
                setPosition(position);
            } catch (error) {
                console.error("Error getting location: ", error);
            }
        };

        fetchLocation();
        fetchAllergenZones();
    }, []);

    const handleMapClick = (e) => {
        if (showAddModal) {
            const clickedLatLng = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            }
            setShowModal(true);
            setNewMarker(clickedLatLng);
        }
    }

    const handleAddNewAllergenZone = async () => {
        try {
            if (!newMarker) {
                console.error("No new marker set");
                return;
            }

            setShowModal(false);

            const request = {
                latitude: newMarker.lat,
                longitude: newMarker.lng,
                allergenType: allergenType,
            }

            console.log(request);

            const response = await axios.post('https://datcbackend.azurewebsites.net/api/allergen/addAllergenZone', request, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });

            if (response.status === 200) {
                fetchAllergenZones();
            }
        } catch (error) {
            console.error("Error adding new allergen zone:", error);
        }
    };

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    const handleInfoWindowClose = () => {
        setSelectedMarker(null);
    };

    return (
        <div>
            <LoadScript googleMapsApiKey={apiKey}>
                <div className='w-full h-full flex justify-center items-center'>
                    <GoogleMap
                        mapContainerStyle={{
                            height: '80vh',
                            width: '80vw'
                        }}
                        zoom={14}
                        center={position}
                        onClick={handleMapClick}
                    >
                        {allergenZones.map((allergenZone) => (
                            <MarkerF
                                key={allergenZone._id}
                                position={{ lat: allergenZone.latitude, lng: allergenZone.longitude }}
                                onClick={() => handleMarkerClick(allergenZone)}
                            />
                        ))}

                        <MarkerF
                            position={position}
                            onClick={() => handleMarkerClick({ "originMarker": true })}
                        />

                        {selectedMarker && (
                            <InfoWindow
                                position={selectedMarker.originMarker ? position : { lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                                onCloseClick={handleInfoWindowClose}
                            >
                                <div className="w-full h-full bg-gray-800 text-white p-4 rounded-md shadow-md">
                                    {selectedMarker.originMarker ? (
                                        <p>You are here.</p>
                                    ) : (
                                        <>
                                            <h2 className="text-2xl font-bold mb-2">{selectedMarker.allergenType}</h2>
                                            <p>Reported by: {selectedMarker.reportedBy}</p>
                                        </>
                                    )}
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </div>
            </LoadScript>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="modal transition-opacity ease-in duration-700 opacity 100">
                        <div className="modal-content bg-gray-800 p-8 rounded-md shadow-md">
                            <h2 className="text-2xl font-bold mb-4">Add New Allergen Zone</h2>
                            <label className="block mb-4">
                                Allergen Type:
                                <input
                                    type="text"
                                    value={allergenType}
                                    onChange={(e) => setAllergenType(e.target.value)}
                                    className="mt-1 p-2 border rounded w-full"
                                />
                            </label>
                            <div className="flex justify-between">
                                <button
                                    onClick={handleAddNewAllergenZone}
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                >
                                    Add Zone
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MapComponent;