// ============================================
// src/utils/validators.js
// ============================================
export const validateAadhaar = (aadhaar) => {
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(aadhaar);
};

export const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
};

export const validateName = (name) => {
    return name && name.trim().length >= 2;
};

export const validateDate = (date) => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj);
};

export const validateEducation = (education) => {
    return education && education.trim().length >= 2;
};