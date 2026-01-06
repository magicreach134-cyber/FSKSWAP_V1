# FskSwap Protocol

FskSwap is a decentralized exchange and launchpad protocol on BNB Chain.
It strictly implements **PancakeSwap V2 DEX architecture** and a
**PinkSale Plus–style launchpad**.

THIS REPOSITORY IS GOVERNED BY A LOCKED PROTOCOL SPECIFICATION.
ANY DEVIATION IS NOT PERMITTED WITHOUT VERSION UPGRADE.

---

## 1. CORE RULES (LOCKED)

• Solidity version: **0.8.20 ONLY**  
• Chain:
  - BNB Testnet (development)
  - BNB Mainnet (production)
• Tooling: **Remix IDE only**  
• Dependencies:
  - No deprecated libraries
  - No floating imports
  - Explicit version pinning only
• Code quality:
  - Production-grade contracts only
  - NO minimalist or example code
  - NO pseudo-code
  - NO TODOs
  - NO commented-out logic
• Compilation:
  - Must compile cleanly in Remix
  - Must deploy without modification
• Safety:
  - Avoid stack-too-deep
  - Reentrancy protected
  - Checked arithmetic
• Addresses:
  - Checksummed addresses only

---

## 2. DEX ARCHITECTURE (LOCKED)

FskSwap DEX SHALL strictly follow **PancakeSwap V2**:

• Factory  
• Pair  
• Router  
• WBNB  
• Libraries:
  - Math
  - UQ112x112
  - TransferHelper

Allowed:
• Protocol fee routing  
• Fee-on-transfer token support  

NOT allowed:
• Architectural simplification
• Experimental rewrites

---

## 3. LAUNCHPAD ARCHITECTURE (LOCKED)

FskSwap Launchpad SHALL implement **PinkSale Plus parity**.

### Mandatory Features
• Presale creation (public / whitelist)  
• Soft cap & hard cap  
• Min & max buy  
• Refund on soft-cap failure  
• Auto LP creation on success  
• LP locking  
• Vesting / claim schedule  
• Referral & affiliate rewards  
• Emergency withdraw logic  
• Admin & platform fee configuration  
• Fee-on-transfer token support  

### Contracts
• LaunchpadFactory  
• Presale  
• VestingVault  
• LiquidityLocker  
• FeeCollector  

NO FEATURE REDUCTION PERMITTED.

---

## 4. BUILD ORDER (LOCKED)

1. ERC20 base + fee-on-transfer
2. WBNB
3. DEX Factory
4. DEX Pair
5. DEX Router
6. Fee Collector
7. Farming / Staking (MasterChef)
8. Launchpad Factory
9. Presale Contract
10. Vesting / Claim Logic
11. LP Locking

Each contract:
• Built independently  
• Compiles alone  
• Deploys alone  
• Then integrated  

---

## 5. ENFORCEMENT

• Any contract violating this spec SHALL be rejected  
• Structural bugs REQUIRE full rewrite (no patching)  
• Partial contracts are NOT accepted  
• Upgrades require version bump & changelog  

---

## 6. VERSIONING

• v1.x = PancakeSwap V2 + PinkSale Plus parity  
• No breaking changes within same major version  
• Mainnet deploy requires checksum verification  

---

END OF SPECIFICATION
