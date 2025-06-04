'use client';
import { useState, useEffect } from 'react';
import styles from "./page.module.css";
import { redirect } from 'next/navigation';

// Custom Components
import ErrorMessage from '../components/general/ErrorMessage';
import SuccessMessage from '../components/general/SuccessMessage';
import LoginForm from '../components/login/LoginForm';
import SignupForm from '../components/login/SignupForm';

// API calls
import { signupUser, loginUser, hasUserToken, fetchAuthenticatedUser } from '../util/authApi';

// Input validators
import { emailIsValid, passwordIsValid, usernameIsValid } from '../util/InputValidators';


export default function Login() {
    const [loading, setLoading] = useState(true);
    const [loginShowing, setLoginShowing] = useState(true);
    const [bottomButtonText, setBottomButtonText] = useState("Signup");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);

    // Signup states
    const [signUpUsername, setSignupUsername] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

    // Login states
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const checkUserStatus = async () => {
        const res = await fetchAuthenticatedUser();

        switch (res.status) {
            case 200: {
                redirect('/dashboard');
                break;
            }

            case 404: {
                localStorage.removeItem('token');
                break;
            }

            case 400: {
                localStorage.removeItem('token');
                break;
            }

            default: {
                console.warn('Unexpected response status:', res.status);
                localStorage.removeItem('token');
                break;
            }
        };
    }

    // Redirect User if already logged in 
    useEffect(() => {
        if (hasUserToken()) {
            checkUserStatus();
        }
        setLoading(false);
    }, []);

    // Hook to loginShowing to update bottom button text as needed
    useEffect(() => {
        loginShowing ? setBottomButtonText("Signup") : setBottomButtonText("Login")

    }, [loginShowing]);

    const informAndRedirectUser = () => {
        setSuccess(true);
        // 2 second delay before redirecting so user has time to process message
        setTimeout(() => {
            redirect('/dashboard');
        }, 2000);
    };

    const onSignupSubmit = async () => {

        if (!emailIsValid(signupEmail)) {
            setError(true);
            setErrorMessage("Invalid E-Mail");
            return;
        }

        if (!usernameIsValid(signUpUsername)) {
            setError(true);
            setErrorMessage("Invalid Username length!");
            return;
        }

        if (!passwordIsValid(signupPassword)) {
            setError(true);
            setErrorMessage("Invalid Password length!");
            return;
        }

        if (signupPassword !== signupConfirmPassword) {
            setError(true);
            setErrorMessage("Passwords must match!");
            return;
        }

        const res = await signupUser({ 
            email: signupEmail, 
            username: signUpUsername, 
            password: signupPassword });

        switch (res.status) {
            case 201: {
                // Save token and user info locally (login the user)
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                informAndRedirectUser();
                break;
            }

            case 409:
                setError(true);
                setErrorMessage(res.data?.message || 'Username / Email taken!');
                break;

            case 400: {
                setError(true);
                setErrorMessage(res.data?.message || 'Validation error occurred.');
                break;
            }

            default: {
                setError(true);
                setErrorMessage(res.data?.message || 'Unknown error occurred.');
            }
        }
    };


    const onLoginSubmit = async () => {
        if (!usernameIsValid(loginEmail)) {
            setError(true);
            setErrorMessage("Invalid Username or E-Mail");
            return;
        }

        if (!passwordIsValid(loginPassword)) {
            setError(true);
            setErrorMessage("Invalid Password!");
            return;
        }

        const res = await loginUser({ 
            email: loginEmail, 
            password: loginPassword });

        switch (res.status) {
            case 201: {
                // Save token and user info locally (login the user)
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                informAndRedirectUser();
                break;
            }

            case 400: {
                setError(true);
                setErrorMessage(res.data?.message || "All fields (email, password) are required!");
                break;
            }

            default: {
                setError(true);
                setErrorMessage(res.data?.message || "Incorrect username or password!");
            }
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(false);
        if (loginShowing) {
            // Log in user
            onLoginSubmit();
        } else {
            // Sign up user
            onSignupSubmit();
        }
    }

    // Clears existing error if active, calls on every input to clear outdated errors
    const updateError = () => {
        if (error) {
            setError(false);
            setErrorMessage("");
        }
    }

    // Prevents loading errors
    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div className={styles.page}>
                <div className={styles.loginContainer}>
                    <h1 className={styles.loginContainerHeader}>{loginShowing ? "Login" : "Signup"}</h1>
                    <form onSubmit={handleSubmit}>
                        {loginShowing ? <LoginForm
                            email={loginEmail}
                            password={loginPassword}
                            setEmail={setLoginEmail}
                            setPassword={setLoginPassword}
                            onSubmit={onLoginSubmit}
                            updateError={updateError} />
                            : <SignupForm
                                email={signupEmail}
                                username={signUpUsername}
                                password={signupPassword}
                                confirmPassword={signupConfirmPassword}
                                setEmail={setSignupEmail}
                                setUsername={setSignupUsername}
                                setPassword={setSignupPassword}
                                setConfirmPassword={setSignupConfirmPassword}
                                onSubmit={onSignupSubmit}
                                updateError={updateError} />}
                        <ErrorMessage error={error} errorMessage={errorMessage} />
                        <SuccessMessage success={success} successMessage={"Successfully logged in, redirecting!"} />
                        <div className={styles.loginButtonsContainer}>
                            <button className={styles.submitButton}
                                type="submit">
                                Submit</button>

                            <div className={styles.loginSignupButtonContainer}>
                                <h2 className={styles.loginSignupButtonFlavorText}>
                                    {loginShowing ? "Don't Have An Acccount?" : "Already Have An Account?"}</h2>
                            </div>
                            <button className={styles.loginSignupButton}
                                onClick={(event) => {
                                    event.preventDefault();
                                    // Flips whatever value is currently selected
                                    setLoginShowing(!loginShowing);
                                }}>{bottomButtonText}</button>
                        </div>
                    </form>
                </div >
            </div>
        </>
    )
}