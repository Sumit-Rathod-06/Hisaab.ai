// Loader.jsx
import React from "react";
import { Wallet } from "lucide-react";

const Loader = () => {
  return (
    <div style={styles.wrapper}>
      <Wallet size={72} color="#2563eb" />

      <div style={styles.coins}>
        <span style={{ ...styles.coin, animationDelay: "0s" }}></span>
        <span style={{ ...styles.coin, animationDelay: "0.15s" }}></span>
        <span style={{ ...styles.coin, animationDelay: "0.3s" }}></span>
      </div>

      <p style={styles.text}>Calculating your finances...</p>

      <style>
        {`
          @keyframes wave {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.6;
            }
            50% {
              transform: translateY(-12px);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  wrapper: {
    height: "100vh",
    width: "100%",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  coins: {
    display: "flex",
    gap: "12px",
    marginTop: "18px",
  },
  coin: {
    width: "14px",
    height: "14px",
    backgroundColor: "#2563eb", // professional blue
    borderRadius: "50%",
    animation: "wave 1s ease-in-out infinite",
  },
  text: {
    marginTop: "22px",
    fontSize: "16px",
    color: "black",
    letterSpacing: "0.6px",
  },
};

export default Loader;
