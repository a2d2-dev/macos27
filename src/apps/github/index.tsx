import { ExternalLink, GitFork, Github } from 'lucide-react';
import type { AppDefinition } from '../types';

const repositoryUrl = 'https://github.com/a2d2-dev/macos27-claude';
const demoUrl = 'https://macos27-claude.vercel.app/';

const contributionSteps = [
  'Fork the repository',
  'Clone your fork',
  'Run npm install',
  'Run npm run dev',
  'Open a pull request',
];

function GitHubApp() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-auto bg-[#f5f5f7]/94 text-[#1d1d1f] antialiased [font-optical-sizing:auto] [.theme-dark_&]:bg-slate-950/75 [.theme-dark_&]:text-slate-100">
      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-5 px-6 py-6">
        <section className="overflow-hidden rounded-[22px] bg-white shadow-[0_1px_3px_rgba(0,0,0,.05),0_14px_40px_rgba(0,0,0,.05)] ring-1 ring-black/[0.07] [.theme-dark_&]:bg-slate-900 [.theme-dark_&]:ring-white/10">
          <div className="flex items-start gap-4 px-5 py-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-gradient-to-br from-zinc-800 via-neutral-900 to-black text-white shadow-[0_1px_2px_rgba(0,0,0,.08),0_8px_24px_rgba(0,0,0,.12)] ring-1 ring-white/15">
              <Github size={26} strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-[#86868b] [.theme-dark_&]:text-slate-500">Open Source</p>
              <h1 className="mt-1 text-[30px] font-bold leading-tight tracking-[-0.03em] text-[#1d1d1f] [.theme-dark_&]:text-slate-100">
                macOS 27
              </h1>
              <p className="mt-2 max-w-[520px] text-[14px] leading-6 text-[#424245] [.theme-dark_&]:text-slate-300">
                A React, TypeScript, Tailwind, and Vite web simulator inspired by the macOS desktop.
              </p>
            </div>
          </div>

          <div className="border-t border-black/[0.07] px-5 py-4 [.theme-dark_&]:border-white/10">
            <p className="text-[15px] leading-7 text-[#424245] [.theme-dark_&]:text-slate-300">
              This is an open-source project, contributions welcome
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0071e3] px-5 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,.08),0_8px_24px_rgba(0,113,227,.18)] outline-none transition hover:bg-[#0066cc] focus-visible:ring-2 focus-visible:ring-[#0071e3]/55 active:scale-[0.98]"
              >
                View on GitHub
                <ExternalLink size={15} strokeWidth={2} />
              </a>
              <a
                href={demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[14px] font-semibold text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,.05)] ring-1 ring-black/[0.08] outline-none transition hover:bg-[#fbfbfd] focus-visible:ring-2 focus-visible:ring-[#0071e3]/55 active:scale-[0.98] [.theme-dark_&]:bg-white/10 [.theme-dark_&]:text-slate-100 [.theme-dark_&]:ring-white/10 [.theme-dark_&]:hover:bg-white/15"
              >
                Open Live Demo
                <ExternalLink size={15} strokeWidth={2} />
              </a>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[22px] bg-white shadow-[0_1px_3px_rgba(0,0,0,.05),0_14px_40px_rgba(0,0,0,.05)] ring-1 ring-black/[0.07] [.theme-dark_&]:bg-slate-900 [.theme-dark_&]:ring-white/10">
          <div className="flex items-center gap-3 px-5 py-4">
            <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#f5f5f7] text-[#424245] ring-1 ring-black/[0.06] [.theme-dark_&]:bg-white/10 [.theme-dark_&]:text-slate-100 [.theme-dark_&]:ring-white/10">
              <GitFork size={18} strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[#1d1d1f] [.theme-dark_&]:text-slate-100">How to contribute</h2>
              <p className="mt-0.5 text-[13px] leading-5 text-[#6e6e73] [.theme-dark_&]:text-slate-400">
                Pick a good first issue, fork the repo, and open a pull request. See CONTRIBUTING.md for details.
              </p>
            </div>
          </div>
          <ol className="border-t border-black/[0.07] [.theme-dark_&]:border-white/10">
            {contributionSteps.map((step, index) => (
              <li
                key={step}
                className="flex min-h-[48px] items-center gap-3 border-b border-black/[0.07] px-5 py-3 last:border-b-0 [.theme-dark_&]:border-white/10"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-black/[0.055] text-[12px] font-semibold tabular-nums text-[#6e6e73] [.theme-dark_&]:bg-white/10 [.theme-dark_&]:text-slate-300">
                  {index + 1}
                </span>
                <span className="text-[14px] text-[#424245] [.theme-dark_&]:text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}

export const githubApp: AppDefinition = {
  id: 'github',
  title: 'GitHub',
  icon: Github,
  iconGradient: 'from-zinc-800 via-neutral-900 to-black',
  defaultWindow: {
    width: 720,
    height: 520,
    minWidth: 520,
    minHeight: 420,
  },
  Component: GitHubApp,
};
