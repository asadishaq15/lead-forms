// convert-key.js
import bs58 from 'bs58';

// Paste your array here
const keyArray = [93,145,72,75,190,63,128,205,91,45,254,206,211,50,141,1,22,121,207,232,89,189,196,8,110,129,91,192,85,127,15,94,28,220,79,126,201,6,26,165,226,246,53,247,240,51,221,234,57,185,159,191,49,59,239,81,48,140,179,42,120,203,45,125]
;

const buffer = Buffer.from(keyArray);
const base58Key = bs58.encode(buffer);

console.log('✅ SOLANA_PRIVATE_KEY (Base58):');
console.log(base58Key);
