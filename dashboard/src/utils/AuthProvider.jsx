import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        axios.interceptors.request.use((config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Unauthorized error, handle as needed (e.g., log out)
                    setToken(null);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            // Cleanup interceptors when the component unmounts
            axios.interceptors.request.eject();
            axios.interceptors.response.eject();
        };
    }, [token]);

    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:3000/auth/login', credentials);

            if (response.data.token) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                return true;
            }
        } catch (error) {
            console.error(`Login failed: ${error}`);
        }

        return false;
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    const contextValue = useMemo(() => ({
        token,
        login,
        logout,
    }), [token]);

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;