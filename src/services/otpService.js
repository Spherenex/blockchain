// ============================================
// src/services/otpService.js
// ============================================
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const verifyOTP = (inputOTP, storedOTP) => {
    return inputOTP === storedOTP;
};

// Simulate OTP expiry (5 minutes)
export const isOTPExpired = (generatedTime) => {
    const currentTime = new Date().getTime();
    const otpTime = new Date(generatedTime).getTime();
    const difference = currentTime - otpTime;
    return difference > 5 * 60 * 1000; // 5 minutes in milliseconds
};