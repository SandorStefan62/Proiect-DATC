import { useNavigate } from "react-router-dom";

function LoginPage() {

    const navigate = useNavigate();

    const handleLogin = async () => {
        navigate("/dashboard");
    }

    return (
        <>
            <h1 className="text-3xl font-bold underline">
                Login Page!
            </h1>
            <div>
                <label>Username:</label>
                <input type="text" name="username" />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" />
            </div>
            <button onClick={handleLogin}>Login</button>
        </>
    )
}

export default LoginPage;