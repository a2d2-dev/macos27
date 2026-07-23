import { Calculator } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { AppDefinition } from '../types';
import { useWindowStore } from '../../store/windowStore';

type Operator = '+' | '-' | '*' | '/';

type LastOperation = {
  operator: Operator;
  operand: number;
};

type CalculatorState = {
  display: string;
  storedValue: number | null;
  pendingOperator: Operator | null;
  lastOperation: LastOperation | null;
  waitingForOperand: boolean;
  error: boolean;
};

const initialState: CalculatorState = {
  display: '0',
  storedValue: null,
  pendingOperator: null,
  lastOperation: null,
  waitingForOperand: false,
  error: false,
};

const keys = [
  ['AC', '+/-', '%', '/'],
  ['7', '8', '9', '*'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

function calculate(left: number, right: number, operator: Operator) {
  if (operator === '+') {
    return left + right;
  }

  if (operator === '-') {
    return left - right;
  }

  if (operator === '*') {
    return left * right;
  }

  if (right === 0) {
    return null;
  }

  return left / right;
}

function formatResult(value: number) {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  return Number.parseFloat(value.toPrecision(12)).toString();
}

function operatorLabel(operator: Operator | null) {
  if (operator === '*') {
    return 'x';
  }

  if (operator === '/') {
    return '÷';
  }

  return operator ?? '';
}

function CalculatorApp() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const activeAppId = useWindowStore((windowState) => windowState.activeAppId);

  const pressDigit = (digit: string) => {
    setState((current) => {
      if (current.error || current.waitingForOperand) {
        return { ...current, display: digit, waitingForOperand: false, error: false };
      }

      if (current.display === '0') {
        return { ...current, display: digit };
      }

      if (current.display.replace('-', '').length >= 12) {
        return current;
      }

      return { ...current, display: `${current.display}${digit}` };
    });
  };

  const pressDecimal = () => {
    setState((current) => {
      if (current.error || current.waitingForOperand) {
        return { ...current, display: '0.', waitingForOperand: false, error: false };
      }

      if (current.display.includes('.')) {
        return current;
      }

      return { ...current, display: `${current.display}.` };
    });
  };

  const clear = () => setState(initialState);

  const toggleSign = () => {
    setState((current) => {
      if (current.error || current.display === '0') {
        return current;
      }

      return { ...current, display: current.display.startsWith('-') ? current.display.slice(1) : `-${current.display}` };
    });
  };

  const percent = () => {
    setState((current) => {
      if (current.error) {
        return current;
      }

      if (current.pendingOperator && current.storedValue !== null) {
        return { ...current, display: formatResult((current.storedValue * Number(current.display)) / 100), waitingForOperand: false };
      }

      return { ...current, display: formatResult(Number(current.display) / 100) };
    });
  };

  const pressOperator = (operator: Operator) => {
    setState((current) => {
      if (current.error) {
        return { ...initialState, pendingOperator: operator, storedValue: 0, waitingForOperand: true };
      }

      const inputValue = Number(current.display);

      if (current.pendingOperator && current.storedValue !== null && !current.waitingForOperand) {
        const result = calculate(current.storedValue, inputValue, current.pendingOperator);

        if (result === null) {
          return { ...initialState, display: 'Cannot divide by zero', error: true };
        }

        return {
          display: formatResult(result),
          storedValue: result,
          pendingOperator: operator,
          lastOperation: null,
          waitingForOperand: true,
          error: false,
        };
      }

      return {
        ...current,
        storedValue: inputValue,
        pendingOperator: operator,
        lastOperation: null,
        waitingForOperand: true,
      };
    });
  };

  const equals = () => {
    setState((current) => {
      if (current.error) {
        return current;
      }

      if (current.pendingOperator && current.storedValue !== null) {
        const operand = Number(current.display);
        const result = calculate(current.storedValue, operand, current.pendingOperator);

        if (result === null) {
          return { ...initialState, display: 'Cannot divide by zero', error: true };
        }

        return {
          display: formatResult(result),
          storedValue: null,
          pendingOperator: null,
          lastOperation: { operator: current.pendingOperator, operand },
          waitingForOperand: true,
          error: false,
        };
      }

      if (!current.lastOperation) {
        return current;
      }

      const result = calculate(Number(current.display), current.lastOperation.operand, current.lastOperation.operator);

      if (result === null) {
        return { ...initialState, display: 'Cannot divide by zero', error: true };
      }

      return {
        display: formatResult(result),
        storedValue: null,
        pendingOperator: null,
        lastOperation: current.lastOperation,
        waitingForOperand: true,
        error: false,
      };
    });
  };

  const backspace = () => {
    setState((current) => {
      if (current.error || current.waitingForOperand || current.display.length <= 1) {
        return { ...current, display: '0', error: false };
      }

      if (current.display.length === 2 && current.display.startsWith('-')) {
        return { ...current, display: '0' };
      }

      return { ...current, display: current.display.slice(0, -1) };
    });
  };

  const pressKey = (value: string) => {
    if (/^\d$/.test(value)) {
      pressDigit(value);
      return;
    }

    if (value === '.') {
      pressDecimal();
      return;
    }

    if (value === 'AC') {
      clear();
      return;
    }

    if (value === '+/-') {
      toggleSign();
      return;
    }

    if (value === '%') {
      percent();
      return;
    }

    if (value === '=') {
      equals();
      return;
    }

    pressOperator(value as Operator);
  };

  useEffect(() => {
    if (activeAppId !== 'calculator') {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
        return;
      }

      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        pressDigit(event.key);
        return;
      }

      if (event.key === '.') {
        event.preventDefault();
        pressDecimal();
        return;
      }

      if (['+', '-', '*', '/'].includes(event.key)) {
        event.preventDefault();
        pressOperator(event.key as Operator);
        return;
      }

      if (event.key === '=' || event.key === 'Enter') {
        event.preventDefault();
        equals();
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        clear();
        return;
      }

      if (event.key === 'Backspace') {
        event.preventDefault();
        backspace();
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [activeAppId]);

  return (
    <div className="flex h-full flex-col bg-white/10 p-4 text-[var(--text-primary)]">
      <div className="mb-3 min-h-[92px] rounded-[16px] border border-white/30 bg-white/18 px-4 py-3 text-right shadow-inner backdrop-blur-xl dark:bg-black/20">
        <div className="h-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
          {state.pendingOperator ? `Hold ${operatorLabel(state.pendingOperator)}` : 'Calculator'}
        </div>
        <div className={`truncate pt-2 font-semibold tabular-nums ${state.error ? 'text-2xl' : 'text-5xl'}`}>{state.display}</div>
      </div>

      <div className="grid flex-1 grid-cols-4 gap-2">
        {keys.flat().map((key) => {
          const isOperator = ['/', '*', '-', '+', '='].includes(key);
          const isUtility = ['AC', '+/-', '%'].includes(key);
          const isZero = key === '0';

          return (
            <button
              key={key}
              type="button"
              className={`min-h-11 rounded-[14px] border text-lg font-semibold shadow-sm outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white/80 ${
                isZero ? 'col-span-2' : ''
              } ${
                isOperator
                  ? 'border-orange-200/70 bg-orange-500/85 text-white'
                  : isUtility
                    ? 'border-white/35 bg-white/35'
                    : 'border-white/25 bg-white/20'
              }`}
              onClick={() => pressKey(key)}
            >
              {operatorLabel(key as Operator) || key}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const calculatorApp: AppDefinition = {
  id: 'calculator',
  title: 'Calculator',
  icon: Calculator,
  iconGradient: 'from-zinc-700 via-zinc-800 to-orange-500',
  defaultWindow: {
    width: 330,
    height: 430,
    minWidth: 300,
    minHeight: 400,
  },
  Component: CalculatorApp,
};
