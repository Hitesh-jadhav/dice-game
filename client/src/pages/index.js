// import { useState, useEffect } from 'react';
// import DiceLine from '../components/DiceLine';
// import BetInput from '../components/BetInput';
// import Balance from '../components/Balance';
// import RollButton from '../components/RollButton';
// import { verifyRoll } from '../utils/verify';
// import { ethers } from 'ethers';
// import styles from '../styles/globals.css';

// export default function Home() {
//   const [balance, setBalance] = useState(1000);
//   const [betAmount, setBetAmount] = useState(100);
//   const [result, setResult] = useState(null);
//   const [serverSeed, setServerSeed] = useState('');
//   const [nonce, setNonce] = useState('');
//   const [hash, setHash] = useState('');

//   // Load balance from localStorage on component mount
//   useEffect(() => {
//     const savedBalance = localStorage.getItem('balance');
//     if (savedBalance) setBalance(parseInt(savedBalance));
//   }, []);

//   // Save balance to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('balance', balance);
//   }, [balance]);

//   const handleRoll = async () => {
//     if (!betAmount || betAmount > balance) return;

//     const response = await fetch('/api/roll-dice', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ betAmount, currentBalance: balance }),
//     });

//     const data = await response.json();
//     setBalance(data.newBalance);
//     setResult(data.roll);
//     setServerSeed(data.serverSeed);
//     setNonce(data.nonce);
//     setHash(data.hash);
//   };

  // Reset balance to $1000
  // const resetBalance = () => {
  //   const confirmReset = window.confirm('Are you sure you want to reset your balance to $1000?');
  //   if (confirmReset) {
  //     setBalance(1000);
  //     localStorage.setItem('balance', 1000);
  //   }
  // };

//   return (
//     <div className="container">
//       <h1>Provably Fair Dice Game</h1>
//       <Balance balance={balance} />
//       <BetInput betAmount={betAmount} setBetAmount={setBetAmount} />
//       <DiceLine result={result} />
//       <RollButton handleRoll={handleRoll} />

//       {/* Add Reset Balance Button */}
//       <button onClick={resetBalance} className="reset-button">
//         Reset Balance
//       </button>

//       {result && (
//         <div className="verification">
//           <button onClick={() => verifyRoll(serverSeed, nonce, hash, result)}>
//             Verify Roll
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }




import { useState, useEffect } from "react";
import { ethers } from "ethers";
import DiceLine from "../components/DiceLine";
import BetInput from "../components/BetInput";
import Balance from "../components/Balance";
import RollButton from "../components/RollButton";
import { verifyRoll } from "../utils/verify";
import styles from "../styles/globals.css";

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
  
    const response = await fetch("http://localhost:3001/api/roll-dice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ betAmount, currentBalance: wallet.balance }),
    });
  
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
    <div className="container">
      <h1>Provably Fair Dice Game</h1>
      <Balance balance={wallet.balance} address={wallet.address} />
      <BetInput betAmount={betAmount} setBetAmount={setBetAmount} />
      <DiceLine result={result} />
      <RollButton handleRoll={handleRoll} />

      {/* Add Reset Balance Button */}
      <button onClick={resetBalance} className="reset-button">
        Reset Balance
      </button>

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