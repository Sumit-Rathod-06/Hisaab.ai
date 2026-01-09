import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import BASE_URL from "../api/url";

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return setIsValid(false);
      }
      try {
        const res = await fetch(`${BASE_URL}/api/auth/validate-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.status);
        if (!res.ok) {
          setIsValid(false);
          return;
        }

        const data = await res.json();
        setIsValid(data.valid === true);
      } catch {
        setIsValid(false);
      }
    };

    checkToken();
  }, []);

  if (isValid === null) return <div>Loading...</div>; // spinner better

  return isValid ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
