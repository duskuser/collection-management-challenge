
// Styles shared by /login
import styles from "../../login/page.module.css";

export default function LoginForm(props) {

    return (
        <>
            <div className={styles.loginInputContainer}>
                <label
                    className={styles.loginInputLabel}>E-Mail:</label>
                <input
                    type='email'
                    className={styles.loginInput}
                    value={props.email}
                    onKeyDown={(event) => {
                        // Filter spaces
                        if (event.key === ' ') {
                            event.preventDefault();
                        }
                    }}
                    onChange={(event) => {
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
                        props.setPassword(event.target.value);
                    }}
                />
            </div>

        </>
    )
}