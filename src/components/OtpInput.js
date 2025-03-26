import { useState, useRef } from "react";
import PropTypes from "prop-types";

// Utility function to validate input
const isValidInput = (value) => /^\d?$/.test(value);

const OtpInput = ({ length, onChange }) => {
  // State to store OTP digits, initialized with empty strings
  const [otp, setOtp] = useState(() => Array.from({ length }, () => ""));
  const inputRefs = useRef([]);

  // Updates the OTP state and notifies the parent component
  const updateOtp = (index, value) => {
    if (!isValidInput(value)) return; // Allow only numeric input
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    onChange(updatedOtp.join(""));

    // Autofocus the next input field if value is entered
    if (value && index < length - 1) focusInput(index + 1);
  };

  // Handles backspace key to move focus to the previous input field
  const handleBackspace = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  //function to focus a specific input field
  const focusInput = (index) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
    }
  };

  // Reusable styles for input fields
  const inputStyle = {
    width: "2rem",
    textAlign: "center",
    fontSize: "1.2rem",
    padding: "0.5rem",
    border: "1px solid #000",
    borderRadius: "4px",
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          value={digit}
          onChange={(e) => {
            const value = e.target.value;
            if (isValidInput(value)) updateOtp(index, value);
          }}
          onKeyDown={(e) => handleBackspace(index, e)}
          maxLength={1}
          style={inputStyle}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

OtpInput.propTypes = {
  length: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

OtpInput.defaultProps = {
  length: 6,
};

export default OtpInput;
