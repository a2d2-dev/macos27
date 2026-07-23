type AppPlaceholderProps = {
  title: string;
  body: string;
};

export function AppPlaceholder({ title, body }: AppPlaceholderProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-[rgba(255,255,255,0.14)] p-8 text-center text-[var(--text-primary)]">
      <div className="text-xl font-semibold">{title}</div>
      <p className="max-w-sm text-sm leading-6 text-[var(--text-secondary)]">{body}</p>
    </div>
  );
}
