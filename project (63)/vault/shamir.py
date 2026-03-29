import random
import functools

PRIME = 2**127 - 1  # Mersenne prime, big enough for 32-byte keys

def _eval_poly(coeffs, x):
    return functools.reduce(lambda acc, c: (acc * x + c) % PRIME, coeffs)

def split_key(key: bytes, shares: int = 5, threshold: int = 3) -> list:
    secret = int.from_bytes(key, 'big')
    coeffs = [secret] + [random.randint(1, PRIME - 1) for _ in range(threshold - 1)]
    return [(i, _eval_poly(coeffs, i)) for i in range(1, shares + 1)]

def recover_key(shares: list) -> bytes:
    def lagrange(shares, x=0):
        total = 0
        for i, (xi, yi) in enumerate(shares):
            num = den = 1
            for j, (xj, _) in enumerate(shares):
                if i != j:
                    num = num * (x - xj) % PRIME
                    den = den * (xi - xj) % PRIME
            total = (total + yi * num * pow(den, -1, PRIME)) % PRIME
        return total
    secret = lagrange(shares)
    return secret.to_bytes(32, 'big')
