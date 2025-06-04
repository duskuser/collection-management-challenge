'use client';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import styles from "./page.module.css";

import { hasUserToken, fetchAuthenticatedUser } from './util/authApi';

export default function Home() {
  const checkUserStatus = async () => {
    if (!hasUserToken()) {
      redirect('/login');
    }

    const res = await fetchAuthenticatedUser();

    switch (res.status) {
      case 200: {
        redirect('/dashboard');
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

  useEffect(() => {
    checkUserStatus();
  }, []);

  return (
    <div className={styles.page}>
      <p>Redirecting...</p>
    </div>
  );
}
