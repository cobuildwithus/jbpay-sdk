"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTransition } from "react";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [, startTransition] = useTransition();

  return (
    <Button
      className="size-7"
      onClick={() => {
        startTransition(() => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
        });
      }}
      size="icon"
      variant="ghost"
    >
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
