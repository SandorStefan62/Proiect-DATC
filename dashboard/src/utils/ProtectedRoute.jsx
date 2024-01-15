import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useEffect, useState } from "react";
import validateToken from "./tokenValidation";

function ProtectedRoute({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                setIsLoading(false);
                return;
            }

            try {
                const isValid = await validateToken(token);

                if (isValid) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } catch (error) {
                console.error(`Error validating token: ${error}`);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthentication();
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>
    };

    return isAuthenticated ? children : null;
}

export default ProtectedRoute