import React from "react";
import {useError} from "../../context/ErrorContext";

const ErrorPopup: React.FC = () => {
  const { error, setError } = useError();

  if (!error) return null;

  return (
      <div style={popupStyle}>
        <div style={contentStyle}>
          <p>{error}</p>
          <button onClick={() => setError(null)}>Close</button>
        </div>
      </div>
  );
};

const popupStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const contentStyle: React.CSSProperties = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

export default ErrorPopup;
