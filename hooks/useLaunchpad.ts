"use client";

import {
  contribute,
  claim,
  refund,
  finalize,
  presaleInfo,
  userInfo,
  isWhitelisted,
} from "@/services";

import {
  useLaunchpadStore,
  useWalletStore,
  useTransactionStore,
} from "@/store";

import { parseUnits, BaseError } from "viem";
import { publicClient } from "@/lib/publicClient";

export function useLaunchpad() {
  const { presaleAddress, contributionAmount } =
    useLaunchpadStore();

  const { address } = useWalletStore();
  const txStore = useTransactionStore();

  // --------------------------------
  // BUY
  // --------------------------------
  async function buy() {
    if (!presaleAddress || !contributionAmount || !address)
      return;

    try {
      txStore.open();
      txStore.setTitle("Contribute to Presale");
      txStore.setDescription(
        "Confirm contribution in your wallet"
      );
      txStore.setStatus("prompting");

      // Optional whitelist check
      const whitelisted =
        await isWhitelisted(
          presaleAddress,
          address
        );

      if (!whitelisted) {
        throw new Error(
          "You are not whitelisted for this sale"
        );
      }

      const value = parseUnits(
        contributionAmount,
        18
      );

      const hash = await contribute(
        presaleAddress,
        value
      );

      txStore.setHash(hash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({
        hash,
      });

      txStore.setStatus("success");
    } catch (err) {
      let message =
        "Contribution failed";

      if (err instanceof BaseError) {
        message =
          err.shortMessage || message;
      }

      txStore.setError(message);
      txStore.setStatus("error");
    }
  }

  // --------------------------------
  // CLAIM
  // --------------------------------
  async function claimTokens() {
    if (!presaleAddress || !address) return;

    try {
      txStore.open();
      txStore.setTitle("Claim Tokens");
      txStore.setStatus("prompting");

      const hash = await claim(
        presaleAddress
      );

      txStore.setHash(hash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({
        hash,
      });

      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(
        err?.message || "Claim failed"
      );
      txStore.setStatus("error");
    }
  }

  // --------------------------------
  // REFUND
  // --------------------------------
  async function refundContribution() {
    if (!presaleAddress || !address) return;

    try {
      txStore.open();
      txStore.setTitle("Refund Contribution");
      txStore.setStatus("prompting");

      const hash = await refund(
        presaleAddress
      );

      txStore.setHash(hash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({
        hash,
      });

      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(
        err?.message || "Refund failed"
      );
      txStore.setStatus("error");
    }
  }

  // --------------------------------
  // FINALIZE
  // --------------------------------
  async function finalizePresale() {
    if (!presaleAddress || !address) return;

    try {
      txStore.open();
      txStore.setTitle("Finalize Presale");
      txStore.setStatus("prompting");

      const hash = await finalize(
        presaleAddress
      );

      txStore.setHash(hash);
      txStore.setStatus("pending");

      await publicClient.waitForTransactionReceipt({
        hash,
      });

      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(
        err?.message || "Finalize failed"
      );
      txStore.setStatus("error");
    }
  }

  // --------------------------------
  // READ
  // --------------------------------
  async function getInfo() {
    if (!presaleAddress) return;
    return presaleInfo(presaleAddress);
  }

  async function getUserInfo() {
    if (!presaleAddress || !address) return;
    return userInfo(presaleAddress, address);
  }

  async function checkWhitelistStatus() {
    if (!presaleAddress || !address) return;
    return isWhitelisted(
      presaleAddress,
      address
    );
  }

  return {
    buy,
    claimTokens,
    refundContribution,
    finalizePresale,
    getInfo,
    getUserInfo,
    checkWhitelistStatus,
  };
}
