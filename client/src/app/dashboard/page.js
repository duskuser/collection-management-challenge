'use client'
import { useState, useEffect } from 'react';

// Custom components
import DashboardNav from '../components/dashboard/DashboardNav';
import CreateNote from '../components/dashboard/CreateNote';
import Note from '../components/dashboard/Note';

import styles from './page.module.css';

// Nav values
import VIEW_MODES from '../constants/DashboardViewModes';

import { hasUserToken, fetchAuthenticatedUser } from '../util/authApi';
import { getUserNotes } from '../util/noteApi';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [displaying, setDisplaying] = useState(0);
    const [notes, setNotes] = useState([]);

    const checkUserStatus = async () => {
        if (!hasUserToken()) {
            redirect('/login');
        }

        const res = await fetchAuthenticatedUser();

        switch (res.status) {
            case 200: {
                setUser(res.data.user);
                break;
            }

            case 404: {
                localStorage.removeItem('token');
                redirect('/login');
                break;
            }

            case 400: {
                localStorage.removeItem('token');
                redirect('/login');
                break;
            }

            default: {
                console.warn('Unexpected response status:', res.status);
                localStorage.removeItem('token');
                redirect('/login');
                break;
            }
        };
    }

    const handleUserNotes = async () => {
        const res = await getUserNotes();
        switch (res.status) {
            case 200: {
                setNotes(res.data.notes);
                setLoading(false);
                break;
            }

            case 404: {
                console.log("404");
                break;
            }

            case 400: {
                console.log("400");
                break;
            }

            default: {
                console.warn('Unexpected response status:', res.status);
                break;
            }
        }
    }

    // Verify user
    useEffect(() => {
        checkUserStatus();
    }, []);

    // 
    useEffect(() => {
        handleUserNotes();
    }, [user]);

    const updateNoteByKey = (updatedNote) => {
        console.log("Updating notes...");
        setNotes(prevNotes =>
            prevNotes.map(note =>
                note.generatedKey === updatedNote.generatedKey ? updatedNote : note
            )
        );
    };

    // Renders
    const renderUserSelection = () => {
        switch (displaying) {
            case (VIEW_MODES.VIEW_ALL): {
                if (notes.length === 0) {
                    return <h1 className={styles.noNotesText}>No notes found!</h1>
                }

                return (
                    <>
                        <div className={styles.noteGrid}>
                            {notes.map((note) => {
                                return <Note
                                    key={note.generatedKey}
                                    title={note.title}
                                    body={note.body}
                                    generatedKey={note.generatedKey}
                                    updateNoteByKey={updateNoteByKey}
                                    setUser={setUser} />
                            })}
                        </div>
                    </>
                )
            }

            case (VIEW_MODES.CREATE_NEW): {
                return <CreateNote user={user} setUser={setUser} />
            }

            default:
                break;
        }
    }

    // Prevents loading errors
    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div className={styles.page}>
                <DashboardNav displaying={displaying} setDisplaying={setDisplaying} />
                {renderUserSelection()}
            </div>
        </>
    )

}