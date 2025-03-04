export default function RollButton({ handleRoll }) {
    return (
      <button onClick={handleRoll} className="roll-button">
        Roll Dice
      </button>
    );
  }