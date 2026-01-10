import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    // 🔹 Fetch logged-in user
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Navbar checking token:", token ? "exists" : "missing");

        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        axios
            .get("http://localhost:5000/api/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log("User data fetched:", res.data);
                setIsLoggedIn(true);
                setUserName(res.data.username);
            })
            .catch((err) => {
                console.error("Auth error:", err);
                console.log("Removing token due to error");
                localStorage.removeItem("token");
                setIsLoggedIn(false);
            });
    }, []);

    // 🔹 Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserName("");
        setShowDropdown(false);
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* Logo */}
                <Link to="/" className="logo">
                    <div className="logo-box">ApparelDesk</div>
                </Link>

                {/* Center Links */}
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/shop" className="nav-link">Shop</Link>

                    {isLoggedIn && (
                        <Link to="/my-account" className="nav-link">
                            My Account
                        </Link>
                    )}
                </div>

                {/* Right Section */}
                <div className="nav-right">
                    <Link to="/cart" className="cart-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        <span className="cart-label">Cart</span>
                    </Link>

                    {/* Auth Section */}
                    {isLoggedIn ? (
                        <div className="user-section">
                            <button
                                className="user-name"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {userName}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {showDropdown && (
                                <div className="dropdown">
                                    <Link to="/my-account" className="dropdown-item">
                                        My Account
                                    </Link>
                                    <button className="sign-out-btn" onClick={handleLogout}>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="sign-in-btn">
                            Login / Sign Up
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
