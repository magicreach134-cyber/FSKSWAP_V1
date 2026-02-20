import {
  lockInfo,
  unlockTime,
  lockedAmount,
  isLockActive,
} from "@/services";

export function useMegaLocker() {
  async function getLock(lockId: bigint) {
    return lockInfo(lockId);
  }

  async function getUnlockTime(lockId: bigint) {
    return unlockTime(lockId);
  }

  async function getLockedAmount(lockId: bigint) {
    return lockedAmount(lockId);
  }

  async function checkActive(lockId: bigint) {
    return isLockActive(lockId);
  }

  return {
    getLock,
    getUnlockTime,
    getLockedAmount,
    checkActive,
  };
}
