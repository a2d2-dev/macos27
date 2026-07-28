import { CheckCircle2, CloudSun, ListChecks, TrendingUp } from 'lucide-react';
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
  { symbol: 'AAPL', name: 'Apple Inc.', change: '+1.24%', price: '229.81', trend: [16, 19, 18, 23, 25, 24, 30] },
  { symbol: 'MSFT', name: 'Microsoft Corp.', change: '+0.58%', price: '514.12', trend: [22, 23, 21, 24, 25, 28, 29] },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', change: '-0.42%', price: '171.38', trend: [31, 30, 28, 29, 26, 25, 24] },
];

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const calendarEvents = [
  { time: '10:00 AM', title: 'Design review', detail: 'Liquid Glass widgets' },
  { time: '3:30 PM', title: 'Prototype pass', detail: 'Desktop polish' },
];
const reminders = [
  { title: 'Review PR notes', time: 'Today, 11:00 AM', done: false },
  { title: 'Prep release copy', time: 'Today, 2:00 PM', done: false },
  { title: 'File dock cleanup', time: 'Today, 4:30 PM', done: true },
];
const marketTrend = [18, 22, 21, 27, 25, 31, 30, 36, 34, 39, 42, 40];

const widgetSurfaceClass =
  'border border-white/32 bg-white/[0.16] text-[var(--text-primary)] ring-1 ring-white/18 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_18px_48px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.34)] backdrop-blur-[30px] backdrop-saturate-[2.05] [.theme-dark_&]:border-white/[0.14] [.theme-dark_&]:bg-slate-950/[0.2] [.theme-dark_&]:ring-white/[0.07] [.theme-dark_&]:shadow-[0_1px_2px_rgba(0,0,0,0.22),0_20px_52px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.12)]';
const dividerClass = 'border-white/28 [.theme-dark_&]:border-white/10';
// Below 694px tall, the stacked column can no longer keep a 12px gap above the Dock.
const widgetsRailClass =
  'pointer-events-none fixed left-3 top-10 z-[6] grid grid-cols-2 gap-3 antialiased [@media(max-height:693px)]:grid-cols-4';

function buildSparklinePath(points: readonly number[], width: number, height: number) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - ((point - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

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
    <section className={`${widgetSurfaceClass} col-span-2 w-[356px] rounded-[22px] px-3.5 pb-3.5 pt-3`} aria-label="Calendar widget">
      <div className="grid grid-cols-[1fr_132px] gap-3">
        <div>
          <h2 className="mb-2 text-[13px] font-semibold tracking-[-0.01em] text-red-500">{monthLabel}</h2>
          <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] leading-5 tabular-nums text-[var(--text-secondary)]">
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
        </div>
        <div className={`border-l pl-3 ${dividerClass}`}>
          <p className="text-[11px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">Today</p>
          <div className="mt-2 space-y-2">
            {calendarEvents.map((event) => (
              <article key={`${event.time}-${event.title}`} className={`border-t pt-2 first:border-t-0 first:pt-0 ${dividerClass}`}>
                <p className="text-[10px] font-medium leading-4 tabular-nums text-red-500">{event.time}</p>
                <h3 className="truncate text-[12px] font-semibold leading-4 tracking-[-0.01em]">{event.title}</h3>
                <p className="truncate text-[10px] leading-4 text-[var(--text-secondary)]">{event.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WeatherWidget() {
  return (
    <section className={`${widgetSurfaceClass} h-[146px] w-[172px] rounded-[22px] p-3 text-[var(--text-primary)]`} aria-label="Weather widget">
      <h2 className="text-[13px] font-semibold tracking-[-0.01em]">{weather.city}</h2>
      <div className="mt-3 flex items-center gap-3">
        <CloudSun size={34} className="text-yellow-400 drop-shadow" strokeWidth={2.15} />
        <span className="text-[34px] font-light leading-none tracking-[-0.02em] tabular-nums">{weather.temperature}</span>
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

function TodayRemindersWidget() {
  return (
    <section className={`${widgetSurfaceClass} h-[146px] w-[172px] rounded-[22px] p-3 text-[var(--text-primary)]`} aria-label="Today reminders widget">
      <div className="mb-2 flex items-center gap-2">
        <ListChecks size={15} className="text-red-500" strokeWidth={2.1} />
        <h2 className="text-[13px] font-semibold tracking-[-0.01em]">Today</h2>
      </div>
      <div className="space-y-1.5">
        {reminders.map((reminder) => (
          <div key={reminder.title} className="grid grid-cols-[16px_1fr] gap-2">
            <CheckCircle2
              size={14}
              className={reminder.done ? 'mt-0.5 text-red-500' : 'mt-0.5 text-[var(--text-secondary)] opacity-55'}
              strokeWidth={2.15}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className={`truncate text-[11px] font-semibold leading-4 tracking-[-0.01em] ${reminder.done ? 'text-[var(--text-secondary)] line-through decoration-white/50' : ''}`}>
                {reminder.title}
              </p>
              <p className="truncate text-[9.5px] leading-3 tabular-nums text-[var(--text-secondary)]">{reminder.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StocksWidget() {
  const marketPath = buildSparklinePath(marketTrend, 126, 44);

  return (
    <section className={`${widgetSurfaceClass} col-span-2 w-[356px] rounded-[22px] p-3 text-[var(--text-primary)]`} aria-label="Stocks widget">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={15} className="text-emerald-500" strokeWidth={2.1} />
          <h2 className="text-[13px] font-semibold tracking-[-0.01em]">Stocks</h2>
        </div>
        <svg className="h-11 w-[126px] overflow-visible text-emerald-500" viewBox="0 0 126 44" role="img" aria-label="Market trend sparkline">
          <path d={`${marketPath} L 126 44 L 0 44 Z`} fill="currentColor" opacity="0.12" />
          <path d={marketPath} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {stocks.map((stock) => {
          const isUp = stock.change.startsWith('+');
          const trendPath = buildSparklinePath(stock.trend, 48, 18);

          return (
            <div key={stock.symbol} className={`min-w-0 border-l pl-2 first:border-l-0 first:pl-0 ${dividerClass}`}>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-4 tracking-[-0.01em]">{stock.symbol}</p>
                <p className="truncate text-[10px] leading-4 text-[var(--text-secondary)]">{stock.name}</p>
              </div>
              <svg className={`my-1 h-[18px] w-12 ${isUp ? 'text-emerald-500' : 'text-red-500'}`} viewBox="0 0 48 18" aria-hidden="true">
                <path d={trendPath} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
              </svg>
              <div>
                <p className="text-[12px] leading-4 tabular-nums">{stock.price}</p>
                <p className={`text-[10px] leading-4 tabular-nums ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>{stock.change}</p>
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
    <aside className={widgetsRailClass} aria-label="Desktop widgets">
      <CalendarWidget />
      <WeatherWidget />
      <TodayRemindersWidget />
      <StocksWidget />
    </aside>
  );
}
