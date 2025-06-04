// Contains a handful of useful input validation functions, exported from a previous project

const numbers = "0123456789";
const symbols = "!@#$%^&*()+=[]{}|\\;:'\"<>,.?/~`";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function filterNumbers(input) {
    for (let i = 0; i < input.length; i++) {
        if (numbers.includes(input[i])) {
            return false;
        }
    }
    return true;
};

export function filterSymbols(input) {
    for (let i = 0; i < input.length; i++) {
        if (symbols.includes(input[i])) {
            return false;
        }
    }
    return true;
};

export function filterNumbersAndSymbols(input) {
    for (let i = 0; i < input.length; i++) {
        if (numbers.includes(input[i]) || symbols.includes(input[i])) {
            return false;
        }
    }
    return true;
};

export function inputEndsWithSpace(input) {
    console.log(input.at(-1) === ' ');
    return input.at(-1) === ' ';
}

export function checkInputForSymbol(input) {
    return symbols.includes(input) ? true : false;
};

export function verifyIsMinor(birthday) {
    const [month, day, year] = birthday.split('/');
    const birthDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age < 18;
};

export function verifyIsNumber(input) {
    for (let i = 0; i < input.length; i++) {
        if (!numbers.includes(input[i])) {
            return false;
        }
    }
    return true;
};

export function emailIsValid(email) {
    return email.includes('@') && email.includes('.') && email.length > 6 && email.length < 45;
}

export function usernameIsValid(input) {
    return input.length < 50 && input.length > 2; 
}

// Generally this would have more checks (i.e for symbols, numbers, etc.) but given this is a proof of concept app I don't think it's needed
export function passwordIsValid(input) {
    return input.length < 50 && input.length > 5; 
}