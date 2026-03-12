'use client';

import { useEffect, useState } from 'react';

interface CalculationRecord {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
}

interface HistoryProps {
  refreshTrigger: number;
}

export default function History({ refreshTrigger }: HistoryProps) {
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/history');
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      setError('Could not load history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #2d0000 0%, #1a0000 100%)',
        border: '2px solid #7F0000',
        borderRadius: '12px',
        padding: '16px',
        marginTop: '16px',
        maxHeight: '200px',
        overflowY: 'auto',
      }}
    >
      <h3
        style={{
          color: '#EF5350',
          fontSize: '0.9rem',
          fontWeight: '600',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}
      >
        History
      </h3>

      {loading && (
        <p style={{ color: '#ffcdd2', fontSize: '0.85rem', opacity: 0.7 }}>Loading...</p>
      )}

      {error && (
        <p style={{ color: '#EF5350', fontSize: '0.85rem' }}>{error}</p>
      )}

      {!loading && !error && history.length === 0 && (
        <p style={{ color: '#ffcdd2', fontSize: '0.85rem', opacity: 0.5 }}>No calculations yet</p>
      )}

      {!loading && history.map((item) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '6px 0',
            borderBottom: '1px solid rgba(127, 0, 0, 0.4)',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ color: '#ffcdd2', opacity: 0.8 }}>{item.expression}</span>
          <span style={{ color: '#EF5350', fontWeight: '600', marginLeft: '8px' }}>= {item.result}</span>
        </div>
      ))}
    </div>
  );
}
