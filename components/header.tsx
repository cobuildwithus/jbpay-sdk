import { Logo } from "@/components/juicebox-logo";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Header() {
  return (
    <header className="flex justify-center py-4">
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center gap-4 px-4">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Logo className="text-foreground" />
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/quickstart"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Quickstart
            </Link>
            <Link
              href="https://github.com/cobuildwithus/jbpay-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              GitHub
            </Link>
          </nav>
          <ModeToggle />

          <Popover>
            <PopoverTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48">
              <nav className="flex flex-col gap-2">
                <Link
                  href="/quickstart"
                  className="text-sm font-medium px-2 py-1.5 rounded-md transition-colors hover:bg-accent"
                >
                  Quickstart
                </Link>
                <Link
                  href="https://github.com/jbx-protocol/jbpay-sdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium px-2 py-1.5 rounded-md transition-colors hover:bg-accent"
                >
                  GitHub
                </Link>
              </nav>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
