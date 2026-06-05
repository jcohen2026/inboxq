"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CheckSquare,
  FolderKanban,
  Home,
  Inbox,
  Settings,
  Sparkles,
  Users
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/people", label: "People", icon: Users },
  { href: "/chief-of-staff", label: "Chief of Staff", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-zinc-100 px-5 py-5">
              <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">InboxQ</p>
              <h1 className="mt-1 text-xl font-semibold text-ink">Command Alpha</h1>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-ink",
                      active && "bg-zinc-100 text-ink"
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-zinc-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-sm font-semibold text-white">J</div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">Jordan</p>
                  <p className="truncate text-xs text-zinc-500">Demo mode</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">InboxQ</p>
                <p className="text-base font-semibold text-ink">Command Alpha</p>
              </div>
              <Link href="/chief-of-staff" className="rounded-md border border-zinc-200 p-2 text-zinc-700">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Chief of Staff</span>
              </Link>
            </div>
            <nav className="flex gap-1 overflow-x-auto px-3 pb-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-600",
                      active && "bg-zinc-100 text-ink"
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </header>
          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
