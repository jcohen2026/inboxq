import type { ConnectedAccount } from "@/lib/types";

export function AccountBadge({
  account,
  compact = false
}: {
  account?: ConnectedAccount;
  compact?: boolean;
}) {
  if (!account) {
    return (
      <span className="inline-flex items-center rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600">
        Unknown
      </span>
    );
  }

  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-700">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: account.color }} />
      <span className="truncate">{compact ? account.displayName : account.email}</span>
    </span>
  );
}
