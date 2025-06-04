import styles from './successmessage.module.css';

export default function SuccessMessage(props) {
    if (props.success) {
        return <h2 className={styles.success}>{props.successMessage}</h2>
    }
}