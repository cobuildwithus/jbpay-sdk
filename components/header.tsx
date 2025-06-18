import { Logo } from "@/components/juicebox-logo";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header className="flex justify-center py-4">
      <div className="w-full max-w-3xl mx-auto flex justify-between items-center gap-4 px-4">
        <Link href="/">
          <Logo className="text-foreground" />
        </Link>

        <ModeToggle />
      </div>
    </header>
  );
}
