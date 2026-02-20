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
import { Address } from "viem";

export function useLaunchpad() {
  const { presaleAddress, contributionAmount } = useLaunchpadStore();
  const { address } = useWalletStore();
  const txStore = useTransactionStore();

  async function buy() {
    if (!presaleAddress || !contributionAmount) return;

    try {
      txStore.setStatus("pending");
      const txHash = await contribute(
        presaleAddress,
        BigInt(contributionAmount)
      );
      txStore.setHash(txHash);
      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  async function claimTokens() {
    if (!presaleAddress) return;

    try {
      txStore.setStatus("pending");
      const txHash = await claim(presaleAddress);
      txStore.setHash(txHash);
      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  async function refundContribution() {
    if (!presaleAddress) return;

    try {
      txStore.setStatus("pending");
      const txHash = await refund(presaleAddress);
      txStore.setHash(txHash);
      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

  async function finalizePresale() {
    if (!presaleAddress) return;

    try {
      txStore.setStatus("pending");
      const txHash = await finalize(presaleAddress);
      txStore.setHash(txHash);
      txStore.setStatus("success");
    } catch (err: any) {
      txStore.setError(err?.message);
      txStore.setStatus("error");
    }
  }

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
    return isWhitelisted(presaleAddress, address);
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
