'use client';

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'operator' | 'equals' | 'clear' | 'backspace' | 'zero';
  wide?: boolean;
}

export default function Button({ label, onClick, variant = 'default', wide }: ButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${wide ? styles.wide : ''}`}
      onClick={onClick}
      aria-label={label}
    >
      {label}
    </button>
  );
}
