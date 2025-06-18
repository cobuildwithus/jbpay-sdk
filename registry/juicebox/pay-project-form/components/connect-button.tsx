"use client";

import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "@/components/ui/button";
import { ComponentProps } from "react";

export function ConnectButton(props: ComponentProps<typeof Button>) {
  const { connect } = useConnect();

  return (
    <Button onClick={() => connect({ connector: injected() })} {...props}>
      Connect Wallet
    </Button>
  );
}
