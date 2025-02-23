require("dotenv").config();
const { ethers } = require("ethers");
const readline = require("readline");

// Configuration
const RPC_URL = "https://testnet-rpc.monad.xyz/";
const EXPLORER_URL = "https://testnet.monadexplorer.com/tx/";
const WMON_CONTRACT = "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701";
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Load private keys from .env
const PRIVATE_KEYS = process.env.PRIVATE_KEYS ? process.env.PRIVATE_KEYS.split("\n") : [];
if (PRIVATE_KEYS.length === 0) {
    console.error("❌ No private keys found in .env file.");
    process.exit(1);
}

// User input interface
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Utility: Pause execution for a given time
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to get wallet balance
async function getBalance(wallet) {
    const monBalance = await provider.getBalance(wallet.address);
    const wmonContract = new ethers.Contract(WMON_CONTRACT, ["function balanceOf(address) view returns (uint256)"], provider);
    const wmonBalance = await wmonContract.balanceOf(wallet.address);
    return { MON: ethers.formatEther(monBalance), WMON: ethers.formatEther(wmonBalance) };
}

// Function to wrap MON -> WMON
async function wrapMON(wallet, amount) {
    const contract = new ethers.Contract(WMON_CONTRACT, ["function deposit() public payable"], wallet);
    const tx = await contract.deposit({ value: ethers.parseEther(amount.toFixed(6)) });
    await tx.wait();
    return tx.hash;
}

// Function to unwrap WMON -> MON
async function unwrapWMON(wallet, amount) {
    const contract = new ethers.Contract(WMON_CONTRACT, ["function withdraw(uint256 amount) public"], wallet);
    const tx = await contract.withdraw(ethers.parseEther(amount.toFixed(6)));
    await tx.wait();
    return tx.hash;
}

// Main function
async function main() {
    console.log("\n==================================================");
    console.log("🎉  iZiSwap Auto Swap Iterations by xcyberx 🎉");
    console.log("⚡ Automates MON <-> WMON transactions");
    console.log("==================================================\n");

    for (const key of PRIVATE_KEYS) {
        const wallet = new ethers.Wallet(key.trim(), provider);
        let balance = await getBalance(wallet);
        console.log(`🔑 Wallet: ${wallet.address}`);
        console.log("📊 Current Balance:");
        console.log(`   💰 MON:  ${balance.MON} MON`);
        console.log(`   🏦 WMON: ${balance.WMON} WMON\n`);
    }

    rl.question("Enter the number of swap iterations to perform: ", async (inputIterations) => {
        const iterations = parseInt(inputIterations);
        if (isNaN(iterations) || iterations <= 0) {
            console.error("❌ Invalid number of iterations.");
            process.exit(1);
        }

        rl.question("Enter percentage of MON balance to swap (e.g., 10%): ", async (percentageInput) => {
            const swapPercent = parseFloat(percentageInput);

            if (isNaN(swapPercent) || swapPercent < 1 || swapPercent > 100) {
                console.error("❌ Invalid percentage. Enter a number between 1 and 100.");
                process.exit(1);
            }

            rl.close();

            for (let i = 0; i < iterations; i++) {
                console.log(`\n🚀 Starting Swap Cycle ${i + 1}/${iterations}...\n`);

                for (const key of PRIVATE_KEYS) {
                    const wallet = new ethers.Wallet(key.trim(), provider);
                    console.log(`🔑 Using wallet: ${wallet.address}\n`);

                    // Check balance before swap
                    let balance = await getBalance(wallet);
                    console.log("📊 Wallet Balance:");
                    console.log(`   💰 MON:  ${balance.MON} MON`);
                    console.log(`   🏦 WMON: ${balance.WMON} WMON\n`);

                    // Calculate swap amount based on percentage
                    let swapAmount = (swapPercent / 100) * parseFloat(balance.MON);
                    swapAmount = Math.max(0.001, Math.min(swapAmount, parseFloat(balance.MON))); // Prevent too small or full balance swap

                    // Wrapping MON -> WMON
                    console.log(`🔄 Wrapping ${swapAmount.toFixed(6)} MON into WMON (${swapPercent.toFixed(2)}% of balance)...`);
                    const wrapTx = await wrapMON(wallet, swapAmount);
                    console.log("✅ Wrap successful!");
                    console.log(`🔗 Transaction: ${EXPLORER_URL}${wrapTx}\n`);

                    // Check balance after wrap
                    balance = await getBalance(wallet);
                    console.log("📊 Wallet Balance:");
                    console.log(`   💰 MON:  ${balance.MON} MON`);
                    console.log(`   🏦 WMON: ${balance.WMON} WMON\n`);

                    // Wait before next operation
                    let waitTime = (Math.random() * 1.5 + 0.5) * 60000; // 0.5 - 2 minutes
                    console.log(`⏳ Waiting ${(waitTime / 60000).toFixed(2)} minute(s) before next operation...`);
                    await sleep(waitTime);

                    // Unwrapping WMON -> MON
                    console.log(`🔄 Unwrapping ${swapAmount.toFixed(6)} WMON back to MON...`);
                    const unwrapTx = await unwrapWMON(wallet, swapAmount);
                    console.log("✅ Unwrap successful!");
                    console.log(`🔗 Transaction: ${EXPLORER_URL}${unwrapTx}\n`);

                    // Check balance after unwrap
                    balance = await getBalance(wallet);
                    console.log("📊 Wallet Balance:");
                    console.log(`   💰 MON:  ${balance.MON} MON`);
                    console.log(`   🏦 WMON: ${balance.WMON} WMON\n`);
                }
            }

            console.log("✅ All cycles completed.\n");
            process.exit(0);
        });
    });
}

main();
