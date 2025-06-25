import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function QuickstartPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 mt-12">
      <h1 className="text-4xl font-bold mb-8">Quickstart Guide</h1>

      <p className="text-lg text-muted-foreground mb-8">
        Get up and running with the JuicePay SDK in just a few minutes. This
        guide will walk you through creating a new Next.js app and integrating
        the payment form.
      </p>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Create a new Next.js app</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Start by creating a new Next.js application:</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="language-bash">{`npx create-next-app@latest my-jb-app
cd my-jb-app
pnpm install
pnpm dev`}</code>
            </pre>
            <p className="mt-4 text-sm text-muted-foreground">
              When prompted, we recommend:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>TypeScript: Yes</li>
              <li>ESLint: Yes</li>
              <li>Tailwind CSS: Yes</li>
              <li>App Router: Yes</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Step 2: Install the Pay Project Form component
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Use the shadcn CLI to add the payment form component from our
              registry:
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="language-bash">{`pnpm dlx shadcn@latest add https://jbpay-sdk.vercel.app/r/pay-project-form.json`}</code>
            </pre>
            <p className="mt-4 text-sm text-muted-foreground">
              This will install the component and all its dependencies,
              including wagmi, viem, and @tanstack/react-query.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Set up Wagmi Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Create a Wagmi configuration file at{" "}
              <code className="bg-muted px-2 py-1 rounded">
                lib/wagmi.config.ts
              </code>
              :
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`import { arbitrum, base, mainnet, optimism } from "viem/chains";
import { createConfig, fallback, http, injected, Transport } from "wagmi";

const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;

const jbChains = [mainnet, base, optimism, arbitrum] as const;

export const transports: Record<number, Transport> = {
  [mainnet.id]: fallback([
    ...(INFURA_ID ? [http(\`https://mainnet.infura.io/v3/\${INFURA_ID}\`)] : []),
    http(),
  ]),
  [optimism.id]: fallback([
    ...(INFURA_ID ? [http(\`https://optimism-mainnet.infura.io/v3/\${INFURA_ID}\`)] : []),
    http(),
  ]),
  [base.id]: fallback([
    ...(INFURA_ID ? [http(\`https://base-mainnet.infura.io/v3/\${INFURA_ID}\`)] : []),
    http(),
  ]),
  [arbitrum.id]: fallback([
    ...(INFURA_ID ? [http(\`https://arbitrum-mainnet.infura.io/v3/\${INFURA_ID}\`)] : []),
    http(),
  ]),
};

export const wagmiConfig = createConfig({
  chains: jbChains,
  connectors: [injected()],
  transports,
});`}</code>
            </pre>

            <p className="mt-6 mb-4">
              Create a Wagmi Provider component at{" "}
              <code className="bg-muted px-2 py-1 rounded">
                components/wagmi-provider.tsx
              </code>
              :
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`"use client";

import { wagmiConfig } from "@/lib/wagmi.config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { WagmiProvider as WagmiProviderBase } from "wagmi";

const queryClient = new QueryClient();

export const WagmiProvider = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProviderBase config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProviderBase>
  );
};`}</code>
            </pre>

            <p className="mt-6 mb-4">
              Wrap your app with the Wagmi Provider in{" "}
              <code className="bg-muted px-2 py-1 rounded">app/layout.tsx</code>
              :
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`import { WagmiProvider } from "@/components/wagmi-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </body>
    </html>
  );
}`}</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 4: Configure environment variables</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Create a{" "}
              <code className="bg-muted px-2 py-1 rounded">.env.local</code>{" "}
              file in your project root:
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="language-bash">{`# Optional: Hardcode a project ID to hide the project ID input
NEXT_PUBLIC_PROJECT_ID=1

# Optional: Set default chain ID (1 = mainnet, 8453 = base, 10 = optimism, 42161 = arbitrum)
NEXT_PUBLIC_DEFAULT_CHAIN_ID=1

# Optional: Infura ID for better RPC performance
NEXT_PUBLIC_INFURA_ID=your_infura_project_id`}</code>
            </pre>
            <p className="mt-4 text-sm text-muted-foreground">
              Note: The first two variables are specific to the Pay Project Form
              component. The Infura ID is optional but recommended for
              production apps.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 5: Add the Pay Project Form to your page</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Now you can use the component in any page. Update{" "}
              <code className="bg-muted px-2 py-1 rounded">app/page.tsx</code>:
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`import { PayProjectForm } from "@/components/pay-project-form";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <PayProjectForm />
    </main>
  );
}`}</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 6: Theme Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The Pay Project Form automatically adapts to your shadcn theme and
              supports dark mode out of the box.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Dark Mode Support</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Add the next-themes package for dark mode:
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code className="language-bash">{`pnpm add next-themes`}</code>
                </pre>
                <p className="text-sm text-muted-foreground mt-2">
                  Then wrap your app with the ThemeProvider. The component will
                  automatically adapt to the current theme.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Custom Themes</h4>
                <p className="text-sm text-muted-foreground">
                  The component uses standard shadcn CSS variables, so it will
                  automatically match any custom theme you&apos;ve configured.
                  Visit the{" "}
                  <Link
                    href="https://ui.shadcn.com/themes"
                    className="underline"
                    target="_blank"
                  >
                    shadcn themes
                  </Link>{" "}
                  page to customize your colors.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-400">
              🎉 That&apos;s it!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 dark:text-green-400">
              You now have a fully functional Juicebox payment form in your
              Next.js app. The form includes:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-green-700 dark:text-green-400">
              <li>Multi-chain support (Mainnet, Base, Optimism, Arbitrum)</li>
              <li>Wallet connection with multiple providers</li>
              <li>Real-time token price calculations</li>
              <li>Transaction confirmation modal</li>
              <li>Full theme and dark mode support</li>
            </ul>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground">
            Check out the{" "}
            <Link href="/" className="underline">
              component documentation
            </Link>{" "}
            for more details, or visit the{" "}
            <Link
              href="https://github.com/cobuildwithus/jbpay-sdk"
              className="underline"
              target="_blank"
            >
              GitHub repository
            </Link>{" "}
            to report issues or contribute.
          </p>
        </div>
      </div>
    </div>
  );
}
