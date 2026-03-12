'use client';

import React from 'react';
import styles from './Display.module.css';

interface DisplayProps {
  expression: string;
  current: string;
}

export default function Display({ expression, current }: DisplayProps) {
  return (
    <div className={styles.display}>
      <div className={styles.expression}>{expression || '\u00A0'}</div>
      <div className={styles.current}>
        {current || '0'}
      </div>
    </div>
  );
}
