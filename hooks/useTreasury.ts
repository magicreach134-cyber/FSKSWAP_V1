import {
  totalRevenue,
  protocolFeeBalance,
  treasuryNativeBalance,
} from "@/services";
import { useTreasuryStore } from "@/store";
import { Address } from "viem";

export function useTreasury() {
  const treasuryStore = useTreasuryStore();

  async function fetchRevenue() {
    const revenue = await totalRevenue();
    treasuryStore.setRevenue(revenue);
  }

  async function fetchTokenFee(token: Address) {
    return protocolFeeBalance(token);
  }

  async function fetchNativeBalance() {
    return treasuryNativeBalance();
  }

  return {
    fetchRevenue,
    fetchTokenFee,
    fetchNativeBalance,
  };
}
