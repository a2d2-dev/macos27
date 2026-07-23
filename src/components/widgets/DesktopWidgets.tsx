import { CloudSun, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { useSystemStore } from '../../store/systemStore';

const weather = {
  city: 'Cupertino',
  condition: 'Clear',
  temperature: 57,
  high: 79,
  low: 53,
};

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', change: '+1.24%', price: '229.81' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', change: '+0.58%', price: '514.12' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', change: '-0.42%', price: '171.38' },
];

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getCalendarDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = Array.from({ length: firstDay }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function CalendarWidget() {
  const now = useSystemStore((state) => state.now);
  const days = useMemo(() => getCalendarDays(now), [now]);
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(now);
  const today = now.getDate();

  return (
    <section className="glass-surface w-[172px] rounded-2xl px-3 pb-3 pt-3 text-[var(--text-primary)]" aria-label="Calendar widget">
      <h2 className="mb-2 text-[13px] font-semibold text-red-500">{monthLabel}</h2>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] leading-5 text-[var(--text-secondary)]">
        {weekdays.map((day, index) => (
          <span key={`${day}-${index}`} className="h-5">
            {day}
          </span>
        ))}
        {days.map((day, index) => (
          <span
            key={`${day ?? 'empty'}-${index}`}
            className={`grid h-5 place-items-center rounded-full ${
              day === today ? 'bg-red-500 font-semibold text-white shadow-sm' : 'text-[var(--text-primary)]'
            } ${day === null ? 'opacity-0' : ''}`}
          >
            {day}
          </span>
        ))}
      </div>
    </section>
  );
}

function WeatherWidget() {
  return (
    <section className="glass-surface w-[172px] rounded-2xl p-3 text-[var(--text-primary)]" aria-label="Weather widget">
      <h2 className="text-[13px] font-semibold">{weather.city}</h2>
      <div className="mt-3 flex items-center gap-3">
        <CloudSun size={34} className="text-yellow-400 drop-shadow" strokeWidth={2.2} />
        <span className="text-[34px] font-light leading-none">{weather.temperature}</span>
      </div>
      <div className="mt-3 text-[11px] leading-4 text-[var(--text-secondary)]">
        <p>{weather.condition}</p>
        <p>
          H:{weather.high}° L:{weather.low}°
        </p>
      </div>
    </section>
  );
}

function StocksWidget() {
  return (
    <section className="glass-surface w-[172px] rounded-2xl p-3 text-[var(--text-primary)]" aria-label="Stocks widget">
      <div className="mb-2 flex items-center gap-2">
        <TrendingUp size={15} className="text-emerald-500" />
        <h2 className="text-[13px] font-semibold">Stocks</h2>
      </div>
      <div className="space-y-2">
        {stocks.map((stock) => {
          const isUp = stock.change.startsWith('+');

          return (
            <div key={stock.symbol} className="grid grid-cols-[1fr_auto] gap-x-2 border-t border-white/25 pt-2 first:border-t-0 first:pt-0">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-4">{stock.symbol}</p>
                <p className="truncate text-[10px] leading-4 text-[var(--text-secondary)]">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] leading-4">{stock.price}</p>
                <p className={`text-[10px] leading-4 ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>{stock.change}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function DesktopWidgets() {
  return (
    <aside className="pointer-events-none fixed left-3 top-10 z-[6] flex flex-col gap-3" aria-label="Desktop widgets">
      <CalendarWidget />
      <WeatherWidget />
      <StocksWidget />
    </aside>
  );
}
