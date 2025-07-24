"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ActivityLogItem,
  useActivityLog,
} from "@/registry/juicebox/activity-log/hooks/useActivityLog";
import { ChainLogo } from "@/registry/juicebox/common/components/chain-logo";
import { explorerUrl } from "@/registry/juicebox/common/lib/juicebox-chains";

interface Props {
  chainId: number;
  projectId: number;
  perPage?: number;
}

export function ActivityLog(props: Props) {
  const { chainId, projectId, perPage = 10 } = props;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useActivityLog({
    chainId,
    projectId,
    perPage,
  });

  const activities = data?.pages?.flatMap((page) => page.activities) ?? [];

  return (
    <div className="w-full">
      <div className="space-y-1 relative">
        <div className="absolute left-[15.5px] inset-y-[16px] bg-border w-px -z-10" />
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>

      {hasNextPage && (
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}

function ActivityItem(props: { activity: ActivityLogItem }) {
  const { activity } = props;
  const { profile, user, description, timestamp, amount, chainId, currency, type, txHash, memo } =
    activity;

  const isOutgoing = ["cashout", "borrow"].includes(type);

  return (
    <div className="flex items-center gap-2.5 py-2.5">
      <div className="shrink-0 size-8 rounded-full bg-secondary overflow-hidden flex items-center justify-center">
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="size-full object-cover"
            width={64}
            height={64}
          />
        )}
      </div>

      <div className="grow">
        <div className="text-sm">
          <a
            href={`https://revda.sh/account/${user}`}
            className="font-medium text-foreground truncate hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {profile.name}
          </a>{" "}
          <span className="text-muted-foreground">{description}</span>
        </div>
        {memo && <div className="text-xs text-muted-foreground mt-0.5">{memo}</div>}
        <div className="text-xs text-muted-foreground mt-0.5">
          <a
            href={explorerUrl(chainId, txHash, "tx")}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {getRelativeTime(timestamp)}
          </a>
        </div>
      </div>

      <div
        className={cn("px-2 py-1 rounded-md text-xs font-medium shrink-0", {
          "bg-muted": isOutgoing,
          "bg-green-500/10 dark:bg-green-700/40": !isOutgoing,
        })}
      >
        {amount} {currency}
      </div>

      <ChainLogo chainId={chainId} className="size-4" />
    </div>
  );
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000;

  const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return rtf.format(-years, "year");
  if (months > 0) return rtf.format(-months, "month");
  if (days > 0) return rtf.format(-days, "day");
  if (hours > 0) return rtf.format(-hours, "hour");
  if (minutes > 0) return rtf.format(-minutes, "minute");
  return rtf.format(-seconds, "second");
}
