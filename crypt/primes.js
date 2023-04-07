function generatePrimes(limit) {
    const primes = [2];
    for (let i = 2; i < limit; i++) {
        if (!primes.some((p) => i % p === 0)) {
            primes.push(i);
        }
    }
    return primes;
}
/// This function tests if n is a prime number.
function eulerTotient(n) {
    let phi = n;
    const pN = generatePrimes(n).filter((p) => n % p === 0);
    pN.forEach((p) => {
        phi *= 1 - 1 / p;
    });
    return phi === n;
}
function primeFactorialDivision(n) {
    const primes = [];
    let i = 2;
    while (i <= n) {
        if (n % i === 0) {
            n = n / i;
            primes.push(i);
            i = 2;
        }
        else {
            i++;
        }
    }
    return primes;
}
function bin(n) {
    if (n === 0)
        return "0";
    const length = Math.floor(Math.log(n) / Math.log(2)) + 1;
    let res = new Array(length);
    let i = length;
    while (n > 0) {
        res[i] = (n % 2).toString();
        n = Math.floor(n / 2);
        i--;
    }
    return res.join("");
}
/// x^exp % mod
export function squareAndMultiply(x, exp, mod) {
    const expBin = bin(exp);
    let res = x;
    for (let i = expBin[0] === "1" ? 1 : 0; i < expBin.length; i++) {
        switch (expBin[i]) {
            case "0":
                // Square
                res = res ** 2 % mod;
                break;
            case "1":
                // Square && multiply
                res = res ** 2 % mod;
                res = (res * x) % mod;
                break;
        }
    }
    return res;
}
export function primitiveRoot(n) {
    const phi = eulerTotient(n) ? n - 1 : n;
    const phiDiv = [...new Set(primeFactorialDivision(phi))];
    for (let i = 2; i < n; i++) {
        let completed = 0;
        for (let j = 0; j < phiDiv.length; j++) {
            const sp = phi / phiDiv[j];
            const isp = squareAndMultiply(i, sp, n);
            if (isp === 1)
                break;
            completed++;
        }
        if (completed === phiDiv.length)
            return i;
    }
    return 0;
}
console.log(primitiveRoot(23));
// console.log(bin(64));
// console.log(bin(45));
// console.log(bin(63));
// console.log(squareAndMultiply(3, 45, 7));
// console.log(squareAndMultiply(23, 373, 747));
// console.log(generatePrimes(100));
