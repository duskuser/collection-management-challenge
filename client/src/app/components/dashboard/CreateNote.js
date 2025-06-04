'use client'
import { useState } from 'react';

// Custom components
import ErrorMessage from '../general/ErrorMessage';
import SuccessMessage from '../general/SuccessMessage';

import NOTE_SIZES from '@/app/constants/NoteSizes';

import styles from './createnote.module.css';

import { createNote } from '@/app/util/noteApi';

export default function CreateNote(props) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = ("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        const res = await createNote({
            title: title, 
            body: body});

        switch (res.status) {
            case 201: {
                setSuccess(true);
                // Triggers useEffect in parent component causing API call to be called again to grab newly added note
                props.setUser(res.data.user);
                // Update local component state for reuse as needed
                setTitle("");
                setBody("");
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


    return (
        <>
            <div className={styles.createNoteContainer}>
                <div className={styles.createNoteSectionContainer}>
                    <label>Title:</label>
                    <input
                        type="title"
                        value={title}
                        className={styles.noteTitle}
                        onChange={(event) => {
                            if (event.target.value.length <= NOTE_SIZES.MAX_TITLE_LENGTH) {
                                setTitle(event.target.value);
                            } else {
                                setError(true);
                                setErrorMessage("Title length can not be greater than " + NOTE_SIZES.MAX_TITLE_LENGTH);
                            }
                        }} />
                </div>

                <div className={styles.createNoteSectionContainer}>
                    <label>Body:</label>
                    <textarea
                        id="noteBody"
                        name="noteBody"
                        value={body}
                        rows={6}
                        className={styles.noteBody}
                        onChange={(event) => {
                            if (event.target.value.length <= NOTE_SIZES.MAX_BODY_LENGTH) {
                                setBody(event.target.value);
                            } else {
                                setError(true);
                                setErrorMessage("Body length can not be greater than " + NOTE_SIZES.MAX_BODY_LENGTH);
                            }
                        }} />
                </div>

                <div className={styles.createNoteSectionContainer}>
                    <ErrorMessage error={error} errorMessage={errorMessage} />
                    <SuccessMessage success={success} successMessage={"Note added!"} />
                    <button className={styles.submitButton} onClick={handleSubmit} >Submit</button>
                </div>
            </div>
        </>
    )
}