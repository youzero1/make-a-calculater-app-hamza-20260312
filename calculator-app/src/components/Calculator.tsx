'use client';

import React, { useState, useCallback } from 'react';
import Display from './Display';
import Button from './Button';
import styles from './Calculator.module.css';

interface HistoryItem {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
}

type ButtonVariant = 'default' | 'operator' | 'equals' | 'clear' | 'backspace' | 'zero';

interface ButtonConfig {
  label: string;
  variant: ButtonVariant;
  wide?: boolean;
  action: () => void;
}

export default function Calculator() {
  const [current, setCurrent] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setCurrent(digit);
      setWaitingForOperand(false);
    } else {
      setCurrent(prev => {
        if (prev === '0') return digit;
        if (prev.length >= 15) return prev;
        return prev + digit;
      });
    }
  }, [waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setCurrent('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!current.includes('.')) {
      setCurrent(prev => prev + '.');
    }
  }, [current, waitingForOperand]);

  const clear = useCallback(() => {
    setCurrent('0');
    setExpression('');
    setWaitingForOperand(false);
  }, []);

  const backspace = useCallback(() => {
    if (waitingForOperand) return;
    setCurrent(prev => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  }, [waitingForOperand]);

  const handleOperator = useCallback((op: string) => {
    const currentVal = parseFloat(current);
    let displayOp = op;
    if (op === '*') displayOp = '×';
    if (op === '/') displayOp = '÷';

    // If there is already a pending expression and not waiting, evaluate first
    if (expression && !waitingForOperand) {
      // evaluate current expression
      const fullExpr = expression + ' ' + current;
      try {
        const evalExpr = expression.replace(/×/g, '*').replace(/÷/g, '/');
        // eslint-disable-next-line no-new-func
        const result = Function('"use strict"; return (' + evalExpr + ' ' + current + ')')();
        const resultStr = formatResult(result);
        setCurrent(resultStr);
        setExpression(resultStr + ' ' + displayOp);
        setWaitingForOperand(true);
        return;
      } catch {
        // ignore eval errors
      }
    }

    setExpression(current + ' ' + displayOp);
    setWaitingForOperand(true);
  }, [current, expression, waitingForOperand]);

  const formatResult = (value: number): string => {
    if (!isFinite(value)) return 'Error';
    if (isNaN(value)) return 'Error';
    // Limit to reasonable precision
    const str = parseFloat(value.toPrecision(12)).toString();
    return str;
  };

  const calculate = useCallback(async () => {
    if (!expression) return;

    const fullExpression = expression + ' ' + current;
    const evalExpression = fullExpression.replace(/×/g, '*').replace(/÷/g, '/');

    let result: string;
    try {
      if (evalExpression.includes('/ 0') || evalExpression.includes('/0')) {
        const parts = evalExpression.split('/');
        const divisor = parts[parts.length - 1].trim();
        if (parseFloat(divisor) === 0) {
          result = 'Error: Div/0';
        } else {
          // eslint-disable-next-line no-new-func
          const res = Function('"use strict"; return (' + evalExpression + ')')();
          result = formatResult(res);
        }
      } else {
        // eslint-disable-next-line no-new-func
        const res = Function('"use strict"; return (' + evalExpression + ')')();
        result = formatResult(res);
      }
    } catch {
      result = 'Error';
    }

    setCurrent(result);
    setExpression(fullExpression + ' =');
    setWaitingForOperand(true);

    // Save to DB
    if (result !== 'Error' && result !== 'Error: Div/0') {
      try {
        const response = await fetch('/api/calculations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expression: fullExpression, result }),
        });
        if (response.ok) {
          const data = await response.json();
          if (showHistory) {
            setHistory(prev => [data.calculation, ...prev]);
          }
        }
      } catch (err) {
        console.error('Failed to save calculation:', err);
      }
    }
  }, [current, expression, showHistory]);

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/calculations');
      const data = await res.json();
      setHistory(data.calculations || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const toggleHistory = useCallback(() => {
    if (!showHistory) {
      loadHistory();
    }
    setShowHistory(prev => !prev);
  }, [showHistory, loadHistory]);

  const buttons: ButtonConfig[] = [
    { label: 'C', variant: 'clear', action: clear },
    { label: '⌫', variant: 'backspace', action: backspace },
    { label: '%', variant: 'operator', action: () => {
      const val = parseFloat(current) / 100;
      setCurrent(formatResult(val));
    }},
    { label: '÷', variant: 'operator', action: () => handleOperator('/') },
    { label: '7', variant: 'default', action: () => inputDigit('7') },
    { label: '8', variant: 'default', action: () => inputDigit('8') },
    { label: '9', variant: 'default', action: () => inputDigit('9') },
    { label: '×', variant: 'operator', action: () => handleOperator('*') },
    { label: '4', variant: 'default', action: () => inputDigit('4') },
    { label: '5', variant: 'default', action: () => inputDigit('5') },
    { label: '6', variant: 'default', action: () => inputDigit('6') },
    { label: '−', variant: 'operator', action: () => handleOperator('-') },
    { label: '1', variant: 'default', action: () => inputDigit('1') },
    { label: '2', variant: 'default', action: () => inputDigit('2') },
    { label: '3', variant: 'default', action: () => inputDigit('3') },
    { label: '+', variant: 'operator', action: () => handleOperator('+') },
    { label: '0', variant: 'zero', wide: true, action: () => inputDigit('0') },
    { label: '.', variant: 'default', action: inputDecimal },
    { label: '=', variant: 'equals', action: calculate },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.calculator}>
        <div className={styles.header}>
          <h1 className={styles.title}>Calculator</h1>
          <button className={styles.historyToggle} onClick={toggleHistory}>
            {showHistory ? 'Hide History' : 'History'}
          </button>
        </div>

        <Display expression={expression} current={current} />

        <div className={styles.grid}>
          {buttons.map((btn, i) => (
            <Button
              key={i}
              label={btn.label}
              onClick={btn.action}
              variant={btn.variant}
              wide={btn.wide}
            />
          ))}
        </div>
      </div>

      {showHistory && (
        <div className={styles.historyPanel}>
          <h2 className={styles.historyTitle}>Calculation History</h2>
          {loadingHistory ? (
            <p className={styles.historyLoading}>Loading...</p>
          ) : history.length === 0 ? (
            <p className={styles.historyEmpty}>No calculations yet.</p>
          ) : (
            <ul className={styles.historyList}>
              {history.map(item => (
                <li key={item.id} className={styles.historyItem}>
                  <span className={styles.historyExpr}>{item.expression}</span>
                  <span className={styles.historyResult}>= {item.result}</span>
                  <span className={styles.historyDate}>
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
