// Shares styles with parent component
import styles from './dashboardnav.module.css';
import { redirect } from 'next/navigation';

// Nav values
import VIEW_MODES from "@/app/constants/DashboardViewModes";
import { logoutUser } from "@/app/util/authApi";

export default function DashboardNav(props) {
    return (
        <>
            <div className={styles.dashboardNav}>
                <button className={props.displaying === VIEW_MODES.VIEW_ALL ?
                    `${styles.dashboardNavButton} ${styles.selectedButton}` : styles.dashboardNavButton} onClick={() => {
                        if (props.displaying !== VIEW_MODES.VIEW_ALL) {
                            props.setDisplaying(VIEW_MODES.VIEW_ALL);
                        }
                    }}>View Notes</button>
                <button className={props.displaying === VIEW_MODES.CREATE_NEW ?
                    `${styles.dashboardNavButton} ${styles.selectedButton}` : styles.dashboardNavButton} onClick={() => {
                        if (props.displaying !== VIEW_MODES.CREATE_NEW) {
                            props.setDisplaying(VIEW_MODES.CREATE_NEW);
                        }
                    }}>Add Note</button>

                <button className={styles.dashboardNavButton} onClick={() => {
                    logoutUser();
                    redirect('/login');
                }}>Logout</button>
            </div>
        </>
    )
}