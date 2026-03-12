'use client';

import { useState, useCallback } from 'react';
import Display from './Display';
import Button from './Button';
import History from './History';

type ButtonConfig = {
  label: string;
  variant: 'number' | 'operator' | 'action' | 'equals' | 'zero';
  span?: number;
  action: () => void;
};

export default function Calculator() {
  const [current, setCurrent] = useState('0');
  const [expression, setExpression] = useState('');
  const [operator, setOperator] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setCurrent(digit);
      setWaitingForOperand(false);
    } else {
      if (justCalculated) {
        setCurrent(digit);
        setExpression('');
        setJustCalculated(false);
      } else {
        setCurrent(current === '0' ? digit : current + digit);
      }
    }
  }, [current, waitingForOperand, justCalculated]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setCurrent('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!current.includes('.')) {
      setCurrent(current + '.');
    }
    setJustCalculated(false);
  }, [current, waitingForOperand]);

  const handleOperator = useCallback((op: string) => {
    const currentVal = parseFloat(current);

    if (prevValue !== null && !waitingForOperand && !justCalculated) {
      const prev = parseFloat(prevValue);
      let result: number;
      switch (operator) {
        case '+': result = prev + currentVal; break;
        case '-': result = prev - currentVal; break;
        case '×': result = prev * currentVal; break;
        case '÷': result = currentVal !== 0 ? prev / currentVal : NaN; break;
        default: result = currentVal;
      }
      const resultStr = isNaN(result) ? 'Error' : String(parseFloat(result.toPrecision(12)));
      setCurrent(resultStr);
      setPrevValue(resultStr);
      setExpression(`${resultStr} ${op}`);
    } else {
      setPrevValue(current);
      setExpression(`${current} ${op}`);
    }

    setOperator(op);
    setWaitingForOperand(true);
    setJustCalculated(false);
  }, [current, prevValue, operator, waitingForOperand, justCalculated]);

  const calculate = useCallback(async () => {
    if (operator === null || prevValue === null) return;

    const prev = parseFloat(prevValue);
    const curr = parseFloat(current);
    let result: number;

    switch (operator) {
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case '×': result = prev * curr; break;
      case '÷': result = curr !== 0 ? prev / curr : NaN; break;
      default: return;
    }

    const resultStr = isNaN(result) ? 'Error' : String(parseFloat(result.toPrecision(12)));
    const expr = `${prevValue} ${operator} ${current}`;

    setExpression(`${expr} =`);
    setCurrent(resultStr);
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setJustCalculated(true);

    if (resultStr !== 'Error') {
      try {
        await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expression: expr, result: resultStr }),
        });
        setRefreshTrigger(t => t + 1);
      } catch (err) {
        console.error('Failed to save calculation:', err);
      }
    }
  }, [current, prevValue, operator]);

  const clear = useCallback(() => {
    setCurrent('0');
    setExpression('');
    setOperator(null);
    setPrevValue(null);
    setWaitingForOperand(false);
    setJustCalculated(false);
  }, []);

  const toggleSign = useCallback(() => {
    setCurrent(String(parseFloat(current) * -1));
    setJustCalculated(false);
  }, [current]);

  const percentage = useCallback(() => {
    setCurrent(String(parseFloat(current) / 100));
    setJustCalculated(false);
  }, [current]);

  const backspace = useCallback(() => {
    if (justCalculated || current === '0') {
      setCurrent('0');
      return;
    }
    const newVal = current.length > 1 ? current.slice(0, -1) : '0';
    setCurrent(newVal);
  }, [current, justCalculated]);

  const buttons: ButtonConfig[] = [
    { label: 'C', variant: 'action', action: clear },
    { label: '+/-', variant: 'action', action: toggleSign },
    { label: '%', variant: 'action', action: percentage },
    { label: '÷', variant: 'operator', action: () => handleOperator('÷') },

    { label: '7', variant: 'number', action: () => inputDigit('7') },
    { label: '8', variant: 'number', action: () => inputDigit('8') },
    { label: '9', variant: 'number', action: () => inputDigit('9') },
    { label: '×', variant: 'operator', action: () => handleOperator('×') },

    { label: '4', variant: 'number', action: () => inputDigit('4') },
    { label: '5', variant: 'number', action: () => inputDigit('5') },
    { label: '6', variant: 'number', action: () => inputDigit('6') },
    { label: '-', variant: 'operator', action: () => handleOperator('-') },

    { label: '1', variant: 'number', action: () => inputDigit('1') },
    { label: '2', variant: 'number', action: () => inputDigit('2') },
    { label: '3', variant: 'number', action: () => inputDigit('3') },
    { label: '+', variant: 'operator', action: () => handleOperator('+') },

    { label: '⌫', variant: 'action', action: backspace },
    { label: '0', variant: 'number', action: () => inputDigit('0') },
    { label: '.', variant: 'number', action: inputDecimal },
    { label: '=', variant: 'equals', action: calculate },
  ];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '360px',
        background: 'linear-gradient(160deg, #3d0000 0%, #2d0000 100%)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(183, 28, 28, 0.2)',
        border: '1px solid rgba(127, 0, 0, 0.5)',
      }}
    >
      <Display expression={expression} current={current} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
        }}
      >
        {buttons.map((btn, index) => (
          <Button
            key={index}
            label={btn.label}
            onClick={btn.action}
            variant={btn.variant}
            span={btn.span}
          />
        ))}
      </div>

      <History refreshTrigger={refreshTrigger} />
    </div>
  );
}
