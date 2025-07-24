import { Button } from "@/components/ui/button";
import { getRegistryUrl } from "@/lib/utils";
import Link from "next/link";
import { ComponentPreviews } from "./component-previews";

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
        <ComponentPreviews registryUrl={getRegistryUrl()} />
      </main>
    </div>
  );
}
