export const generateOtp = () => {
    const multiplyBy = Math.floor(Math.random() * 10) * 100000 || 100000;
    const otpEmailVerify =  Math.floor((Math.random() * 100000) + multiplyBy);
    return otpEmailVerify;
}