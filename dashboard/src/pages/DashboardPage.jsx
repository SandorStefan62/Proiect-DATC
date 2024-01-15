import { useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import Sidebar from "../components/Sidebar";

function DashboardPage() {
    const [showAddModal, setShowAddModal] = useState(false);

    const handleAddButtonClick = () => {
        setShowAddModal(!showAddModal);
        console.log(showAddModal);
    }

    return (
        <div className="flex w-screen h-screen bg-red-400">
            <div className="bg-gray-800 text-white w-1/6 p-4 h-screen">
                <Sidebar onAddButtonClick={handleAddButtonClick} showAddModal={showAddModal} />
            </div>
            <div className="bg-orange-400 text-white w-5/6 flex items-center justify-center">
                <MapComponent showAddModal={showAddModal} />
            </div>
        </div>
    )
}

export default DashboardPage;