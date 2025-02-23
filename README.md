iZiSwap Auto Swap Iterations

Automate your MON ↔ WMON swaps with ease!

🚀 Features

✅ Automatic MON to WMON & WMON to MON Swapping✅ Supports Multiple Wallets✅ Randomized Swap Amounts Based on User Input✅ Custom Swap Iterations✅ Delay Between Swaps for Realistic Transactions✅ Transaction Logs with Explorer Links

📜 Requirements

Node.js (v16+ recommended)

npm or yarn

MON Testnet Wallet with MON Tokens

🛠 Installation

# Clone the repository
git clone https://github.com/yourusername/iZiSwap-Auto-Swap.git
cd iZiSwap-Auto-Swap

# Install dependencies
npm install

🔑 Setup .env File

Create a .env file in the project directory and add your wallet's private key(s):

PRIVATE_KEYS=your_private_key_1\PRIVATE_KEYS=your_private_key_2
PRIVATE_KEYS=your_private_key_3

💡 Supports multiple wallets. Each private key should be on a new line.

▶️ Usage

Run the script using:

node izi.js

You will be prompted to enter:
1️⃣ Number of Swap Iterations (e.g., 5 swaps)2️⃣ Percentage of MON Balance to Swap (e.g., 10% will swap 10% of MON balance each cycle)

📝 Example Run

node izi.js

📌 User Inputs:

Enter the number of swap iterations to perform: 3
Enter percentage of MON balance to swap (e.g., 10% - 90%): 30%

📌 Output:

🚀 Starting Swap Cycle 1/3...
🔑 Using wallet: 0xYourWalletAddress
📊 Wallet Balance:
   💰 MON: 5.000 MON
   🏦 WMON: 0.000 WMON
🔄 Wrapping 1.500 MON into WMON (30% of balance)...
✅ Swap Completed! 🔗 Transaction: https://testnet.monadexplorer.com/tx/xxxxxxxxx

🔧 Troubleshooting

❌ No private keys found in .env file?✔️ Ensure you have a .env file with valid keys and correct format.

❌ Transaction failed?✔️ Check if you have sufficient MON balance.

🤝 Contributing

Pull requests are welcome! Feel free to submit issues for feature requests or bugs.

📜 License

This project is licensed under the MIT License.

💙 Developed by xcyberx 🚀
