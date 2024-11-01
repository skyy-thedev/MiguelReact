import React from 'react';
import styles from './AlertSystem.module.css';

const AlertSystem = ({ error, success }) => {
  if (!error && !success) return null;

  return (
    <div className={styles.alertContainer}>
      {error && <div className={`${styles.alert} ${styles['alert-error']}`}>{error}</div>}
      {success && <div className={`${styles.alert} ${styles['alert-success']}`}>{success}</div>}
    </div>
  );
};

export default AlertSystem;