import styles from './errormessage.module.css';

export default function ErrorMessage(props) {
    if (props.error) {
        return <h2 className={styles.error}>{props.errorMessage}</h2>
    }
}