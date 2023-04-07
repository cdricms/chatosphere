import { primitiveRoot, squareAndMultiply } from "./primes.js";
function genPublicKey(g, n, privateKey) {
  return squareAndMultiply(g, privateKey, n);
}
const g = 85916;
const n = primitiveRoot(g);
console.log("n", n);
const a = 57868;
const b = 47822;
const apk = genPublicKey(g, n, a);
const bpk = genPublicKey(g, n, b);
console.log(apk);
console.log(bpk);
console.log(apk ** b, bpk ** a);
