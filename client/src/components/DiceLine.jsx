export default function DiceLine({ result }) {
    return (
      <div className="dice-line">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} className={`dice ${result === num ? 'active' : ''}`}>
            {num}
          </div>
        ))}
      </div>
    );
  }