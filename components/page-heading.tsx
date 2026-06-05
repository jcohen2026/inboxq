import type { ReactNode } from "react";

export function PageHeading({
  eyebrow,
  title,
  children,
  action
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-zinc-200 pb-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">{eyebrow}</p> : null}
        <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
        {children ? <div className="mt-2 text-sm leading-6 text-zinc-600">{children}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
