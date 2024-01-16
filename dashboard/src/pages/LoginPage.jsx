import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import validateToken from "../utils/tokenValidation";

function LoginPage() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token");
            if (token && await validateToken(token)) {
                navigate("/");
            }
        }

        checkToken();
    }, [navigate]);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            console.log(credentials);
            const response = await axios.post('https://datcbackend.azurewebsites.net/api/auth/login', credentials);
            console.log(JSON.stringify(response.data.token));

            if (response.status === 201) {
                localStorage.setItem("token", response.data.token);
                navigate("/");
            }
        } catch (error) {
            console.error(`Login failed: ${error}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-700">
            <div className="bg-gray-700 p-8 rounded w-96">
                <h1 className="text-3xl font-bold mb-6">Login Page</h1>
                <form>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-white font-semibold mb-2 text-left"
                        >
                            Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-white font-semibold mb-2 text-left"
                        >
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        onClick={handleLogin}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;