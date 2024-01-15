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
            const response = await axios.post('http://localhost:3000/auth/login', credentials);
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
        <>
            <h1 className="text-3xl font-bold underline">
                Login Page!
            </h1>
            <div>
                <label>Username:</label>
                <input type="text" name="username" value={credentials.username} onChange={handleChange} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={credentials.password} onChange={handleChange} />
            </div>
            <button onClick={handleLogin}>Login</button>
        </>
    );
}

export default LoginPage;