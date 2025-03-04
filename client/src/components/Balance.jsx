export default function Balance({ balance, address }) {
  return (
    <div className="balance">
      <p>Wallet Address: {address}</p>
      <p>Balance: ${balance}</p>
    </div>
  );
}