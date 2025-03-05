import { useState, useEffect } from "react";
import { ethers } from "ethers";
import DiceLine from "../components/DiceLine";
import BetInput from "../components/BetInput";
import Balance from "../components/Balance";
import RollButton from "../components/RollButton";
import { verifyRoll } from "../utils/verify";

// Wallet functions
const createWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    balance: 1000, // Initial balance
  };
};

const getWallet = () => {
  if (typeof window === "undefined") {
    return null; // Return null during SSR
  }

  let wallet = localStorage.getItem("wallet");
  if (!wallet) {
    wallet = createWallet();
    localStorage.setItem("wallet", JSON.stringify(wallet));
  } else {
    wallet = JSON.parse(wallet);
  }
  return wallet;
};

const updateWalletBalance = (newBalance) => {
  if (typeof window !== "undefined") {
    const wallet = getWallet();
    wallet.balance = newBalance;
    localStorage.setItem("wallet", JSON.stringify(wallet));
  }
};

export default function Home() {
  const [wallet, setWallet] = useState(null); // Initialize with null
  const [betAmount, setBetAmount] = useState(100);
  const [result, setResult] = useState(null);
  const [serverSeed, setServerSeed] = useState("");
  const [nonce, setNonce] = useState("");
  const [hash, setHash] = useState("");

  // Load wallet after component mounts
  useEffect(() => {
    setWallet(getWallet());
  }, []);

  const handleRoll = async () => {
    if (!wallet || !betAmount || betAmount > wallet.balance) return;

    const response = await fetch(
      "https://dice-game-be.onrender.com/api/roll-dice",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ betAmount, currentBalance: wallet.balance }),
      }
    );

    const data = await response.json();
    updateWalletBalance(data.newBalance);
    setWallet(getWallet()); // Update wallet state
    setResult(data.roll);
    setServerSeed(data.serverSeed);
    setNonce(data.nonce);
    setHash(data.hash);
  };

  // Reset balance to initial value
  const resetBalance = () => {
    const wallet = getWallet();
    wallet.balance = 1000; // Reset to initial balance
    localStorage.setItem("wallet", JSON.stringify(wallet));
    setWallet(wallet); // Update wallet state
  };

  // Render a loading state until the wallet is loaded
  if (!wallet) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading wallet...</p>
      </div>
    );
  }

  return (
    // <div className="container">
    //   <h1>Provably Fair Dice Game</h1>
    //   <Balance balance={wallet.balance} address={wallet.address} />
    //   <BetInput betAmount={betAmount} setBetAmount={setBetAmount} />
    //   <DiceLine result={result} />
    //   <RollButton handleRoll={handleRoll} />

    //   {/* Add Reset Balance Button */}
    //   <button onClick={resetBalance} className="reset-button">
    //     Reset Balance
    //   </button>

    //   {result && (
    //     <div className="verification">
    //       <button onClick={() => verifyRoll(serverSeed, nonce, hash, result)}>
    //         Verify Roll
    //       </button>
    //     </div>
    //   )}
    // </div>
    <div className="container">
      <h1>Provably Fair Dice Game</h1>
      <Balance balance={wallet.balance} address={wallet.address} />
      <BetInput betAmount={betAmount} setBetAmount={setBetAmount} />
      <DiceLine result={result} />
      <div className="button-container">
        <RollButton handleRoll={handleRoll} />
        <button onClick={resetBalance} className="reset-button">
          Reset Balance
        </button>
      </div>

      {result && (
        <div className="verification">
          <button onClick={() => verifyRoll(serverSeed, nonce, hash, result)}>
            Verify Roll
          </button>
        </div>
      )}
    </div>
  );
}
