'use client'
import { useState } from 'react';

// Custom components
import ErrorMessage from '../general/ErrorMessage';
import SuccessMessage from '../general/SuccessMessage';

import NOTE_SIZES from '@/app/constants/NoteSizes';
import VIEW_MODES from '@/app/constants/NoteViewModes';

import styles from './note.module.css';

import { updateNote, deleteNote } from '@/app/util/noteApi';

export default function Note(props) {
    const [displaying, setDisplaying] = useState(VIEW_MODES.VIEWING);
    const [newTitle, setNewTitle] = useState(props.title);
    const [newBody, setNewBody] = useState(props.body);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleEditSubmit = async () => {
        const res = await updateNote({
            title: newTitle,
            body: newBody,
            key: props.generatedKey,
        });

        switch (res.status) {
            case 201: {
                setSuccess(true);
                props.updateNoteByKey(res.data.note);
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
    };

    const handleNoteDeletion = async () => {
        const res = await deleteNote({
            generatedKey: props.generatedKey,
        });

        switch (res.status) {
            case 200: {
                setSuccess(true);
                props.setUser(res.data.user);
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
    };

    const renderNoteInformation = () => {

        switch (displaying) {
            case (VIEW_MODES.VIEWING): {
                return (
                    <>
                        <div className={styles.noteSectionContainer}>
                            <label>Title:</label>
                            <h2 className={styles.noteTitle}>{props.title}</h2>
                        </div>

                        <div className={styles.noteSectionContainer}>
                            <label>Body:</label>
                            <h2 className={styles.noteBody}>{props.body}</h2>
                        </div>
                    </>
                )
            };

            case (VIEW_MODES.DELETING): {
                return (
                    <>
                        <div className={styles.deleteNoteSectionContainer}>
                            <h1 className={styles.confirmText}>Are you sure you want to delete?</h1>
                            <div className={styles.deleteNoteButtons}>
                                <button onClick={() => {
                                    setDisplaying(VIEW_MODES.VIEWING);
                                }}>No</button>

                                <button onClick={() => {
                                    handleNoteDeletion();
                                }}>Yes</button>

                            </div>
                        </div>
                    </>
                )
            };

            case (VIEW_MODES.EDITING): {
                return (
                    <>
                        <div className={styles.noteSectionContainer}>
                            <label>Title:</label>
                            <input
                                type="title"
                                value={newTitle}
                                className={styles.noteTitle}
                                onChange={(event) => {
                                    if (event.target.value.length <= NOTE_SIZES.MAX_TITLE_LENGTH) {
                                        setNewTitle(event.target.value);
                                    } else {
                                        setError(true);
                                        setErrorMessage("Title length can not be greater than " + NOTE_SIZES.MAX_TITLE_LENGTH);
                                    };
                                }} />
                        </div>

                        <div className={styles.noteSectionContainer}>
                            <label>Body:</label>
                            <textarea
                                id="noteBody"
                                name="noteBody"
                                value={newBody}
                                rows={6}
                                className={styles.noteBody}
                                onChange={(event) => {
                                    if (event.target.value.length <= NOTE_SIZES.MAX_BODY_LENGTH) {
                                        setNewBody(event.target.value);
                                    } else {
                                        setError(true);
                                        setErrorMessage("Body length can not be greater than " + NOTE_SIZES.MAX_BODY_LENGTH);
                                    };
                                }} />
                        </div>
                    </>
                );
            };
        };
    };

    return (
        <>
            <div className={styles.noteContainer}>
                {renderNoteInformation()}

                <div className={styles.noteSectionContainer}>
                    <button onClick={() => {
                        if (error) {
                            setError(false);
                        }

                        if (success) {
                            setSuccess(false);
                        }

                        if (displaying === VIEW_MODES.VIEWING) {
                            setDisplaying(VIEW_MODES.EDITING);
                        } else {
                            setDisplaying(VIEW_MODES.VIEWING);
                        }
                    }}>{displaying === VIEW_MODES.VIEWING ? "Edit" : "Go Back"}</button>
                    {displaying === VIEW_MODES.VIEWING ? <button onClick={() => {
                        setDisplaying(VIEW_MODES.DELETING);
                    }}>Delete Note</button> : ""}
                    {displaying === VIEW_MODES.EDITING ? <ErrorMessage error={error} errorMessage={errorMessage} /> : ""}
                    {displaying === VIEW_MODES.EDITING ? <SuccessMessage success={success} successMessage="Note updated!" /> : ""}
                    {displaying === VIEW_MODES.EDITING ? <button onClick={handleEditSubmit}>Submit Changes</button> : ""}
                </div>
            </div>
        </>
    )
}