

export const validateFullName = (name) => {
    if (!name.trim()) {
        return 'Full name is required';
    }
    if (name.trim().length < 2) {
        return 'Name must be at least 2 characters';
    }
    if (!/^[a-zA-Z\s]*$/.test(name)) {
        return 'Name can only contain letters and spaces';
    }
    return '';
};

export const validateEmail = (email) => {
    if (!email.trim()) {
        return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return '';
};

export const validatePhone = (phone) => {
    if (!phone.trim()) {
        return 'Phone number is required';
    }
    if (!/^\d+$/.test(phone)) {
        return 'Phone number can only contain digits';
    }
    if (phone.length < 10 || phone.length > 13) {
        return 'Phone number must be between 10 and 13 digits';
    }
    return '';
};

export const validatePassword = (password) => {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters';
    }
    // Add more password complexity rules if needed
    return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
        return 'Please confirm your password';
    }
    if (confirmPassword.trim() !== password.trim()) {
        return 'Passwords do not match';
    }
    return '';
};