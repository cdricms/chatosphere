import { primitiveRoot, squareAndMultiply } from "./primes";

function genPublicKey(g: number, n: number, privateKey: number): number {
  return squareAndMultiply(g, privateKey, n);
}

const g = 8591654641;
const n = primitiveRoot(g);
console.log("n", n);

const a = 5786822623;
const b = 4782286631;

const apk = genPublicKey(g, n, a);
const bpk = genPublicKey(g, n, b);

console.log(apk);
console.log(bpk);

console.log(apk ** b, bpk ** a);
