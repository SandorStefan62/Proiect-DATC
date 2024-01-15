import axios from "axios";

async function validateToken(token) {
    try {
        const response = await axios.post(
            'https://datcbackend.azurewebsites.net/api/validate/validateToken',
            null,
            {
                headers: {
                    Authorization: token,
                },
            },
        );

        if (response.status !== 200) {
            throw new Error("Token validation failed");
        }

        if (response.data.user.role === "user") {
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Error validating token: ${error}`);
        return false;
    }
}

export default validateToken;