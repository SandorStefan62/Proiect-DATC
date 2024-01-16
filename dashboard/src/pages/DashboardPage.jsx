import { useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import Sidebar from "../components/Sidebar";
import axios from "axios";

function DashboardPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showSpecificZoneModal, setShowSpecificZoneModal] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [allergen, setAllergen] = useState('');

    const handleAddButtonClick = () => {
        setShowAddModal(!showAddModal);
    }

    const handleEdidUserButtonClick = (user) => {
        setShowModal(true);
        setSelectedUser(user);
    }

    const handleDeleteUserButtonClick = (user) => {
        setSelectedUser(user);
        handleDeleteUser(selectedUser);
    }

    const handleShowUserRegistrationModal = () => {
        setShowRegisterModal(true);
    }

    const handleShowSpecificZonesButtonClick = () => {
        setShowSpecificZoneModal(true);
    }

    const handleRemoveFilterButtonClick = () => {
        setAllergen('');
    }

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get('https://datcbackend.azurewebsites.net/api/user/getAllUsers', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });

            if (response.status === 200) {
                const userData = response.data.users;
                setUsers(userData);
            }
        } catch (error) {
            console.error(`Error fetching users: ${error}`);
        }
    }

    useEffect(() => {
        fetchAllUsers();
    }, [])

    const handleShowUsersButtonClick = async () => {
        fetchAllUsers();
        setShowTable(!showTable);
    }

    const handleEditUser = async (selectedUser) => {
        try {
            const response = await axios.put(
                `https://datcbackend.azurewebsites.net/api/user/profile/${selectedUser._id}`,
                {
                    username,
                    email,
                    role
                },
                {
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                    },
                }
            );

            if (response.status === 200) {
                console.log(`User with id: ${selectedUser._id} has been updated successfully`);
                setShowModal(false);
                fetchAllUsers();
            }
        } catch (error) {
            console.error(`Failed to update user with id: ${selectedUser._id}: ${error}`);
        }
    };

    const handleDeleteUser = async (selectedUser) => {
        try {
            const response = await axios.delete(
                `https://datcbackend.azurewebsites.net/api/user/${selectedUser._id}`,
                {
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                    },
                }
            );

            if (response.status === 200) {
                console.log(`User with id: ${selectedUser._id} has been deleted successfully`);
                fetchAllUsers();
            }
        } catch (error) {
            console.error(`Failed to delete user with id: ${selectedUser._id}: ${error}`);
        }
    };

    const handleRegisterUser = async () => {
        try {
            if (!username || !email || !password) {
                console.error(`Incomplete data for registration`);
                return;
            }

            const response = await axios.post('https://datcbackend.azurewebsites.net/api/auth/register', {
                username,
                email,
                password
            });

            if (response.status === 201) {
                console.log(`User registered successfully`);
                setShowRegisterModal(false);
                fetchAllUsers();
            } else {
                console.error(`Failed to register user: ${response.data.error}`);
            }
        } catch (error) {
            console.error(`Error registering new user: ${error}`);
        }
    };

    const handleShowSpecificZones = (allergen) => {
        setAllergen(allergen);
        setShowSpecificZoneModal(false);
    }

    return (
        <div className="flex w-screen h-screen bg-red-400 relative">
            <div className="bg-gray-800 text-white w-1/6 p-4 h-screen">
                <Sidebar
                    onAddButtonClick={handleAddButtonClick}
                    onShowUsersButtonClick={handleShowUsersButtonClick}
                    onShowRegisterUserButtonClick={handleShowUserRegistrationModal}
                    onShowSpecificZonesButtonClick={handleShowSpecificZonesButtonClick}
                    onRemoveFilterButtonClick={handleRemoveFilterButtonClick}
                    showAddModal={showAddModal}
                    showTable={showTable}
                    showRegisterModal={showRegisterModal}
                />
            </div>
            <div className="bg-gray-700 text-white w-5/6 flex items-center justify-center relative">
                <MapComponent showAddModal={showAddModal} allergen={allergen} username={username} />
                {showTable && (
                    <div className="absolute top-0 left-0 w-full h-full bg-gray-700 text-white flex items-center justify-center">
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold mb-2">User Information Table</h2>
                            <table className="table-auto">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Username</th>
                                        <th className="px-4 py-2">Email</th>
                                        <th className="px-4 py-2">Role</th>
                                        <th className="px-4 py-2">Actions</th> {/* New column for buttons */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td className="border px-4 py-2">{user.username}</td>
                                            <td className="border px-4 py-2">{user.email}</td>
                                            <td className="border px-4 py-2">{user.role}</td>
                                            <td className="border px-4 py-2">
                                                <button className="bg-indigo-900 text-white py-1 px-2 rounded mr-2" onClick={() => handleEdidUserButtonClick(user)}>Edit</button>
                                                <button className="bg-red-900 text-white py-1 px-2 rounded" onClick={() => handleDeleteUserButtonClick(user)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {showModal && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="modal transition-opacity ease-in duration-700 opacity 100">
                                    <div className="modal-content bg-gray-800 p-8 rounded-md shadow-md">
                                        <h2 className="text-2xl font-bold mb-4">Edit user data</h2>
                                        <label className="block mb-4 text-left">
                                            Username:
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="mt-1 p-2 border rounded w-full"
                                            />
                                        </label>
                                        <label className="block mb-4 text-left">
                                            Email:
                                            <input
                                                type="text"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="mt-1 p-2 border rounded w-full"
                                            />
                                        </label>
                                        <label className="block mb-4 text-left">
                                            Role:
                                            <input
                                                type="text"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="mt-1 p-2 border rounded w-full"
                                            />
                                        </label>
                                        <div className="flex justify-between">
                                            <button
                                                onClick={() => handleEditUser(selectedUser)}
                                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                            >
                                                Edit user
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
                )}
                {showRegisterModal && (
                    <div className="z-1 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="modal transition-opacity ease-in duration-700 opacity 100">
                            <div className="modal-content bg-gray-800 p-8 rounded-md shadow-md">
                                <h2 className="text-2xl font-bold mb-4">Edit user data</h2>
                                <label className="block mb-4 text-left">
                                    Username:
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </label>
                                <label className="block mb-4 text-left">
                                    Email:
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </label>
                                <label className="block mb-4 text-left">
                                    Password:
                                    <input
                                        type="text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </label>
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => handleRegisterUser()}
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                    >
                                        Register user
                                    </button>
                                    <button
                                        onClick={() => setShowRegisterModal(false)}
                                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showSpecificZoneModal && (
                    <div className="z-1 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="modal transition-opacity ease-in duration-700 opacity 100">
                            <div className="modal-content bg-gray-800 p-8 rounded-md shadow-md">
                                <h2 className="text-2xl font-bold mb-4">Edit user data</h2>
                                <label className="block mb-4 text-left">
                                    Allergen:
                                    <input
                                        type="text"
                                        value={allergen}
                                        onChange={(e) => setAllergen(e.target.value)}
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </label>
                                <label className="block mb-4 text-left">
                                    User:
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </label>
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => handleShowSpecificZones(allergen)}
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                    >
                                        Find zones
                                    </button>
                                    <button
                                        onClick={() => setShowSpecificZoneModal(false)}
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
        </div>
    )
}

export default DashboardPage;