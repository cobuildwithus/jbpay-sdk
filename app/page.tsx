import { CopyButton } from "@/components/copy-button";
import { getRegistryUrl } from "@/lib/utils";
import { PayProjectForm } from "@/registry/juicebox/pay-project-form/pay-project-form";
import { PropsWithChildren } from "react";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 gap-8 flex flex-col">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">JB Pay SDK</h1>
        <p className="text-muted-foreground">Custom UI components for Juicebox projects.</p>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        <ComponentPreview name="pay-project-form" usage="PayProjectForm">
          <PayProjectForm />
        </ComponentPreview>
      </main>
    </div>
  );
}

function ComponentPreview(props: PropsWithChildren<{ name: string; usage: string }>) {
  const { name, usage, children } = props;

  return (
    <div className="flex flex-col gap-4 border-2 border-dashed border-border rounded-lg p-4 min-h-[450px] relative">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground sm:pl-3">&lt;{usage} /&gt;</h2>
        <CopyButton content={`pnpm dlx shadcn@latest add ${getRegistryUrl()}/${name}.json`} />
      </div>
      <div className="flex items-center justify-center min-h-[500px] relative">{children}</div>
    </div>
  );
}
