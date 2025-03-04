import crypto from 'crypto';

export function verifyRoll(serverSeed, nonce, hash, roll) {
  const computedHash = crypto.createHash('sha256').update(serverSeed + nonce).digest('hex');
  
  if (computedHash !== hash) {
    alert('Hash mismatch! Roll not verified.');
    return false;
  }

  const hashPrefix = computedHash.substring(0, 8);
  const randomValue = parseInt(hashPrefix, 16) / 0xffffffff;
  const computedRoll = Math.floor(randomValue * 6) + 1;

  if (computedRoll !== roll) {
    alert('Roll mismatch! Verification failed.');
    return false;
  }

  alert('Verification successful! The roll was fair.');
  return true;
}