import axios, { HttpStatusCode } from "axios"
import { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

export const AuthContext = createContext({})

const client = axios.create({
    baseURL: "http://localhost:5000/api/auth"
})

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState({});

    // Only use navigate inside functions that are called after render
    const getRouter = () => {
        // This will be called from components that are already inside router context
        return null;
    };

    const handleRegister = async ({ first_name, last_name, email, password, role = 'customer' }, navigate) => {
        try {
            let request = await client.post("/register", {
                first_name,
                last_name,
                email,
                password,
                role
            })
            if (request.status === HttpStatusCode.Created) {
                if (navigate) navigate("/login");
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
    }


    const handleLogin = async ({ email, password }, navigate) => {
        try {
            let request = await client.post("/login", {
                email,
                password
            })
            console.log("Login response:", request.data);
            if (request.status === HttpStatusCode.Ok) {
                console.log("Storing token:", request.data.token);
                localStorage.setItem("token", request.data.token)
                localStorage.setItem("user", JSON.stringify(request.data.user))
                console.log("Token stored, navigating to /shop");
                if (navigate) navigate("/shop")
                return request.data.token
            }
        } catch (err) {
            console.error("Login error:", err);
            throw err;
        }
    }

    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            })
            return request.data;
        } catch (e) {
            throw e;
        }
    }


    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                params: {
                    token: localStorage.getItem("token"),
                    meeting_code: meetingCode
                }
            })
            return request;
        } catch (e) {
            throw e;
        }
    }

    const data = {
        userData, setUserData, handleRegister, handleLogin, getHistoryOfUser, addToUserHistory
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
