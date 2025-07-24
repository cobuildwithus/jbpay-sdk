"use client";

import { ComponentParams } from "@/components/component-params";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { getRegistryUrl } from "@/lib/utils";
import { ActivityLog } from "@/registry/juicebox/activity-log/activity-log";
import { PayProjectForm } from "@/registry/juicebox/pay-project-form/pay-project-form";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 mt-12 gap-8 flex flex-col">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">JuicePay SDK</h1>
          <p className="text-muted-foreground">Custom UI components for Juicebox projects.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/quickstart">
            <Button>Get Started →</Button>
          </Link>
          <Link
            href="https://github.com/cobuildwithus/jbpay-sdk"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">View on GitHub</Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        <ComponentPreview name="pay-project-form" usage="PayProjectForm">
          <PayProjectForm />
        </ComponentPreview>
        <ComponentPreview name="activity-log" usage="ActivityLog">
          <ComponentParams params={{ chainId: 8453, projectId: 3, perPage: 10 }}>
            {(props) => <ActivityLog {...props} />}
          </ComponentParams>
        </ComponentPreview>
      </main>
    </div>
  );
}

function ComponentPreview(props: PropsWithChildren<{ name: string; usage: string }>) {
  const { name, usage, children } = props;

  return (
    <div className="flex flex-col gap-4 border-2 border-dashed border-border rounded-lg p-4 relative">
      <div className="flex items-center justify-between sm:p-3">
        <h2 className="text-sm text-muted-foreground">&lt;{usage} /&gt;</h2>
        <CopyButton content={`pnpm dlx shadcn@latest add ${getRegistryUrl()}/${name}.json`} />
      </div>
      <div className="flex flex-col w-full grow items-center justify-center min-h-[360px] relative sm:p-3">
        {children}
      </div>
    </div>
  );
}
