export default function BetInput({ betAmount, setBetAmount }) {
    return (
      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        min="1"
        max="1000"
      />
    );
  }