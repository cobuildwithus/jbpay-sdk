"use client";

import { useEffect, useState } from "react";
import { type BaseError } from "wagmi";

export type Status =
  | "idle"
  | "connecting"
  | "pending"
  | "confirming"
  | "success"
  | "error";

interface TransactionStatusParams {
  // Payment transaction
  isPending?: boolean;
  isConfirming?: boolean;
  isSuccess?: boolean;
  hash?: `0x${string}`;
  error?: Error;

  // Approval transaction
  isApprovalPending?: boolean;
  isApprovalConfirming?: boolean;
  isApprovalSuccess?: boolean;
  approvalHash?: `0x${string}`;
  approvalError?: Error;

  // Callbacks
  onApprovalSuccess?: () => void;
}

export function useTransactionStatus(params: TransactionStatusParams) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
    isApprovalPending,
    isApprovalConfirming,
    isApprovalSuccess,
    approvalHash,
    approvalError,
    onApprovalSuccess,
  } = params;

  useEffect(() => {
    // Handle payment transaction status
    if (isPending) {
      setStatus("pending");
      return;
    }

    if (isConfirming && hash) {
      setStatus("confirming");
      return;
    }

    if (isSuccess && hash) {
      setStatus("success");
      return;
    }

    if (error) {
      setStatus("error");
      setErrorMessage((error as BaseError).shortMessage || error.message);
      return;
    }

    // Handle approval transaction status
    if (isApprovalPending) {
      setStatus("pending");
      return;
    }

    if (isApprovalConfirming && approvalHash) {
      setStatus("confirming");
      return;
    }

    if (isApprovalSuccess && approvalHash) {
      // After approval success, reset status and trigger callback
      setStatus("idle");
      onApprovalSuccess?.();
      return;
    }

    if (approvalError) {
      setStatus("error");
      setErrorMessage(
        (approvalError as BaseError).shortMessage || approvalError.message
      );
    }
  }, [
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
    isApprovalPending,
    isApprovalConfirming,
    isApprovalSuccess,
    approvalHash,
    approvalError,
    onApprovalSuccess,
  ]);

  const reset = () => {
    setStatus("idle");
    setErrorMessage("");
  };

  return {
    status,
    errorMessage,
    setStatus,
    setErrorMessage,
    reset,
  };
}
