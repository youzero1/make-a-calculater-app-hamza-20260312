'use client';

interface DisplayProps {
  expression: string;
  current: string;
}

export default function Display({ expression, current }: DisplayProps) {
  const fontSize = current.length > 12 ? '1.5rem' : current.length > 8 ? '2rem' : '2.8rem';

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #2d0000 0%, #1a0000 100%)',
        border: '2px solid #7F0000',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '16px',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          color: '#ffcdd2',
          fontSize: '0.85rem',
          textAlign: 'right',
          minHeight: '20px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          opacity: 0.8,
        }}
      >
        {expression || '\u00A0'}
      </div>
      <div
        style={{
          color: '#ffffff',
          fontSize: fontSize,
          fontWeight: '600',
          textAlign: 'right',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          transition: 'font-size 0.1s ease',
          lineHeight: 1.2,
        }}
      >
        {current || '0'}
      </div>
    </div>
  );
}
