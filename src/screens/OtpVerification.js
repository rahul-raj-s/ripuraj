import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import OtpInput from "../components/OtpInput";

// Reusable Button component
const Button = ({ onClick, children, style }) => (
  <button
    onClick={onClick}
    style={{
      padding: "0.5rem 1rem",
      fontSize: "1rem",
      cursor: "pointer",
      border: "1px solid #000", 
      borderRadius: "4px", 
      ...style,
    }}
  >
    {children}
  </button>
);

const OTPValidation = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      phoneNumber: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      setIsOtpSent(true);
      try {
        const data = await apiRequest("/api/sendOtp", { phoneNumber: values.phoneNumber });
        if (data.message === "OTP sent successfully") {
          setIsOtpSent(true);
          setError(""); // Clear any previous errors
        } else {
          setError(data.message || "Failed to send OTP.");
        }
      } catch (err) {
        setError(err.message);
      }
    },
  });

  // Handles API requests with error handling
  const apiRequest = async (url, payload) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Network error. Please try again.");
    }
  };

  // Verifies the entered OTP
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }
    try {
      const data = await apiRequest("verifyOtp", { phoneNumber: formik.values.phoneNumber, otp });//here api used to verify OTP
      if (data.success) {
        window.location.href = "/next-page"; // Redirect on successful verification
      } else {
        setError(data.message || "Failed to verify OTP.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h1>Phone Number OTP Validation</h1>
      {isOtpSent ? (
        // OTP input section
        <div>
          <h2>Enter OTP</h2>
          <OtpInput length={6} onChange={setOtp} />
          <Button onClick={verifyOtp} style={{ marginTop: "1rem" }}>
            Verify OTP
          </Button>
        </div>
      ) : (
        // Phone number input section
        <form onSubmit={formik.handleSubmit}>
          {/* <h2>Enter Phone Number</h2> */}
          <input
            type="text"
            name="phoneNumber"
            placeholder="Enter phone number"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              fontSize: "1rem",
              border: formik.touched.phoneNumber && formik.errors.phoneNumber ? "1px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <div style={{ color: "red", marginBottom: "1rem" }}>{formik.errors.phoneNumber}</div>
          )}
          <Button type="submit">Send OTP</Button>
        </form>
      )}
    </div>
  );
};

export default OTPValidation;
