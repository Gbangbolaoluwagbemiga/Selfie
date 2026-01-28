import { ethers } from "hardhat";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using deployer:", deployer.address);

  // Contract Address on Base Mainnet
  const CONTRACT_ADDRESS = "0xC95E2F721B0982D62697c49B298D6e72B7FCcc11";
  const ImpactFlow = await ethers.getContractFactory("ImpactFlow");
  const contract = ImpactFlow.attach(CONTRACT_ADDRESS) as any;

  // 1. Generate 12 NEW Random Wallets
  const wallets = [];
  for (let i = 0; i < 12; i++) {
    wallets.push(ethers.Wallet.createRandom().connect(ethers.provider));
  }
  console.log("Generated 12 new random wallets.");

  // 2. Fund them
  // $0.01 ~ 0.000004 ETH
  const FUND_AMOUNT = ethers.parseEther("0.000004");
  
  // Get initial nonce
  let nonce = await deployer.getNonce();

  for (const wallet of wallets) {
    console.log(`Funding ${wallet.address} (nonce: ${nonce})...`);
    try {
      const tx = await deployer.sendTransaction({
        to: wallet.address,
        value: FUND_AMOUNT,
        nonce: nonce++
      });
      await tx.wait(); 
      // Add small delay to let RPC sync
      await sleep(500);
    } catch (e) {
      console.error(`Failed to fund ${wallet.address}:`, e);
    }
  }

  // 3. Interactions
  console.log("Starting interactions...");
  
  for (const wallet of wallets) {
    const balance = await ethers.provider.getBalance(wallet.address);
    if (balance < ethers.parseEther("0.000002")) {
      console.log(`Skipping ${wallet.address} (insufficient funds: ${balance})`);
      continue;
    }

    const signer = wallet.connect(ethers.provider);
    const contractWithSigner = contract.connect(signer);

    try {
      // Interaction 1: Create a mini campaign
      console.log(`[${wallet.address}] Interaction 1: createCampaign`);
      const tx1 = await contractWithSigner.createCampaign(
        wallet.address,
        "T", 
        "D", 
        "General",
        100, 
        Math.floor(Date.now() / 1000) + 3600, 
        "",
        { 
            gasLimit: 300000,
            nonce: 0 
        }
      );
      await tx1.wait();
      await sleep(500);

      // Interaction 2: Donate to Campaign #0
      console.log(`[${wallet.address}] Interaction 2: donateToCampaign`);
      const tx2 = await contractWithSigner.donateToCampaign(0, {
        value: 1n, // 1 wei
        gasLimit: 150000,
        nonce: 1
      });
      await tx2.wait();
      await sleep(500);
      
    } catch (error: any) {
      console.error(`Failed interactions for ${wallet.address}:`, error.message || error);
    }
  }

  // 4. Sweep funds back to deployer
  console.log("Sweeping funds back to deployer...");
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || ethers.parseUnits("0.1", "gwei"); 

  for (const wallet of wallets) {
    try {
        const balance = await ethers.provider.getBalance(wallet.address);
        // Estimate standard transfer gas (21000)
        const gasCost = 21000n * gasPrice;
        
        if (balance > gasCost) {
            const amountToSend = balance - gasCost;
            console.log(`Sweeping ${ethers.formatEther(amountToSend)} ETH from ${wallet.address}...`);
            
            const signer = wallet.connect(ethers.provider);
            const tx = await signer.sendTransaction({
                to: deployer.address,
                value: amountToSend,
                gasLimit: 21000,
                gasPrice: gasPrice
            });
            await tx.wait();
            console.log("Sweep confirmed.");
        } else {
            console.log(`Skipping sweep for ${wallet.address} (Balance ${ethers.formatEther(balance)} < Cost ${ethers.formatEther(gasCost)})`);
        }
    } catch (e) {
        console.error(`Failed to sweep ${wallet.address}:`, e);
    }
  }

  console.log("All operations completed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
