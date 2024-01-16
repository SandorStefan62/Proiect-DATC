import React from 'react';
import { useNavigate } from "react-router-dom";

function Sidebar({
    onAddButtonClick,
    onShowUsersButtonClick,
    onShowRegisterUserButtonClick,
    onShowSpecificZonesButtonClick,
    onRemoveFilterButtonClick,
    showAddModal,
    showTable }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <ul>
                {!showTable &&
                    <li>
                        <button className="w-full py-2 mb-2 bg-indigo-900 text-white rounded" onClick={onAddButtonClick}>
                            {showAddModal ? "Click again to stop adding" : "Add New Allergen Zone"}
                        </button>
                    </li>
                }
                {!showTable &&
                    <li>
                        <button className="w-full py-2 mb-2 bg-indigo-900 text-white rounded" onClick={onShowSpecificZonesButtonClick}>
                            Show specific allergen zones
                        </button>
                    </li>
                }
                {!showTable &&
                    <li>
                        <button className="w-full py-2 mb-2 bg-indigo-900 text-white rounded" onClick={onRemoveFilterButtonClick}>
                            Remove filter
                        </button>
                    </li>
                }
                <li>
                    <button className="w-full py-2 mb-2 bg-indigo-900 text-white rounded" onClick={onShowUsersButtonClick}>
                        {showTable ? "Click to return to the map" : "Show all users"}
                    </button>
                </li>
                <li>
                    <button className="w-full py-2 mb-2 bg-indigo-900 text-white rounded" onClick={onShowRegisterUserButtonClick}>
                        Register new user
                    </button>
                </li>
                <li>
                    <button className="w-full py-2 mb-2 bg-gray-500 text-white rounded" onClick={handleLogout}>Logout</button>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;