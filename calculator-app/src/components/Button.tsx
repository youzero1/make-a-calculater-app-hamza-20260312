'use client';

import { useState } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'action' | 'equals' | 'zero';
  span?: number;
}

export default function Button({ label, onClick, variant = 'number', span = 1 }: ButtonProps) {
  const [pressed, setPressed] = useState(false);

  const baseStyle: React.CSSProperties = {
    gridColumn: span > 1 ? `span ${span}` : undefined,
    borderRadius: '10px',
    fontSize: '1.3rem',
    fontWeight: '600',
    height: '64px',
    width: '100%',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    transition: 'all 0.12s ease',
    userSelect: 'none',
    letterSpacing: '0.02em',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    number: {
      background: pressed
        ? 'linear-gradient(145deg, #7F0000, #B71C1C)'
        : 'linear-gradient(145deg, #B71C1C, #9a1515)',
      color: '#ffffff',
      boxShadow: pressed
        ? '0 1px 2px rgba(0,0,0,0.5)'
        : '0 4px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      transform: pressed ? 'translateY(2px)' : 'translateY(0)',
    },
    operator: {
      background: pressed
        ? 'linear-gradient(145deg, #9a1515, #D32F2F)'
        : 'linear-gradient(145deg, #D32F2F, #b82828)',
      color: '#ffffff',
      boxShadow: pressed
        ? '0 1px 2px rgba(0,0,0,0.5)'
        : '0 4px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
      transform: pressed ? 'translateY(2px)' : 'translateY(0)',
    },
    action: {
      background: pressed
        ? 'linear-gradient(145deg, #4a0000, #7F0000)'
        : 'linear-gradient(145deg, #7F0000, #6a0000)',
      color: '#ffcdd2',
      boxShadow: pressed
        ? '0 1px 2px rgba(0,0,0,0.5)'
        : '0 4px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      transform: pressed ? 'translateY(2px)' : 'translateY(0)',
    },
    equals: {
      background: pressed
        ? 'linear-gradient(145deg, #c62828, #EF5350)'
        : 'linear-gradient(145deg, #EF5350, #e53935)',
      color: '#ffffff',
      boxShadow: pressed
        ? '0 1px 2px rgba(0,0,0,0.5)'
        : '0 4px 8px rgba(239, 83, 80, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
      transform: pressed ? 'translateY(2px)' : 'translateY(0)',
    },
    zero: {
      background: pressed
        ? 'linear-gradient(145deg, #7F0000, #B71C1C)'
        : 'linear-gradient(145deg, #B71C1C, #9a1515)',
      color: '#ffffff',
      boxShadow: pressed
        ? '0 1px 2px rgba(0,0,0,0.5)'
        : '0 4px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      transform: pressed ? 'translateY(2px)' : 'translateY(0)',
    },
  };

  return (
    <button
      style={{ ...baseStyle, ...variantStyles[variant] }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
