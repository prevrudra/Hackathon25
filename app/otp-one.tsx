
"use client";
import React, { useState } from "react";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOtpEmail = async (email: string, otp: string) => {
  // Calls API route to send OTP
  const res = await fetch("/api/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return res.ok;
};

const OTPOne: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    const newOtp = generateOTP();
    setOtp(newOtp);
    setError("");
    const ok = await sendOtpEmail(email, newOtp);
    if (ok) {
      setStatus("sent");
    } else {
      setError("Failed to send OTP. Try again.");
    }
  };

  const handleVerify = () => {
    if (input === otp) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>OTP Verification (Gmail)</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter your email"
        style={{ width: "100%", padding: 8, marginBottom: 12, fontSize: 16 }}
        disabled={status === "sent"}
      />
      <button onClick={handleSendOtp} style={{ width: "100%", padding: 10, fontSize: 16 }} disabled={status === "sent"}>
        Send OTP
      </button>
      {status === "sent" && (
        <>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter OTP"
            style={{ width: "100%", padding: 8, marginBottom: 12, fontSize: 16, marginTop: 12 }}
          />
          <button onClick={handleVerify} style={{ width: "100%", padding: 10, fontSize: 16 }}>Verify OTP</button>
        </>
      )}
      {status === "success" && <p style={{ color: "green", marginTop: 12 }}>OTP Verified Successfully!</p>}
      {status === "error" && <p style={{ color: "red", marginTop: 12 }}>Invalid OTP. Please try again.</p>}
      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
    </div>
  );
};

export default OTPOne;
