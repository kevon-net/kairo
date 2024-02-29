import otpResend from "./otp-resend";
import otpSend from "./otp-send";
import passwordForgot from "./password-forgot";
import passwordReset from "./password-reset";
import signIn from "./sign-in";
import signUp from "./sign-up";

const authentication = { otpResend, otpSend, passwordForgot, passwordReset, signIn, signUp };

export default authentication;
