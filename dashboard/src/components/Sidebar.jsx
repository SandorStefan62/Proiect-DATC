import React from 'react';
import { useNavigate } from "react-router-dom";

function Sidebar({ onAddButtonClick, showAddModal }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <ul>
                <li>
                    <button className="w-full py-2 mb-2 bg-blue-500 text-white rounded" onClick={onAddButtonClick}>
                        {showAddModal ? "Click again to stop adding" : "Add New Allergen Zone"}
                    </button>
                </li>
                <li>
                    <button className="w-full py-2 mb-2 bg-red-500 text-white rounded">Remove Allergen Zone</button>
                </li>
                <li>
                    <button className="w-full py-2 mb-2 bg-gray-500 text-white rounded" onClick={handleLogout}>Logout</button>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;