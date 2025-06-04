// Styles shared by /login
import styles from "../../login/page.module.css";


export default function SignupForm(props) {

    return (
        <>
            <div className={styles.loginInputContainer}>
                <label
                    className={styles.loginInputLabel}>Username:</label>
                <input
                    type='username'
                    className={styles.loginInput}
                    value={props.username}
                    onChange={(event) => {
                        props.updateError();
                        props.setUsername(event.target.value);
                    }}
                />
            </div>

            <div className={styles.loginInputContainer}>
                <label
                    className={styles.loginInputLabel}>E-Mail:</label>
                <input
                    type='email'
                    className={styles.loginInput}
                    value={props.email}
                    onChange={(event) => {
                        props.updateError();
                        props.setEmail(event.target.value);
                    }}
                />
            </div>

            <div className={styles.loginInputContainer}>
                <label
                    className={styles.loginInputLabel}>Password:</label>
                <input
                    type='password'
                    className={styles.loginInput}
                    value={props.password}
                    onChange={(event) => {
                        props.updateError();
                        props.setPassword(event.target.value);
                    }}
                />
            </div>

            <div className={styles.loginInputContainer}>
                <label
                    className={styles.loginInputLabel}>Confirm Password:</label>
                <input
                    type='password'
                    className={styles.loginInput}
                    value={props.confirmPassword}
                    onChange={(event) => {
                        props.updateError();
                        props.setConfirmPassword(event.target.value);
                    }}
                />
            </div>
        </>
    )
}