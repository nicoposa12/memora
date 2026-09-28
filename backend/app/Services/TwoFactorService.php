<?php

namespace App\Services;

class TwoFactorService
{
    private const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

    /**
     * Generate a random 16-character Base32 secret key.
     */
    public function generateSecretKey(): string
    {
        $secret = '';
        for ($i = 0; $i < 16; $i++) {
            $secret .= self::BASE32_CHARS[random_int(0, 31)];
        }
        return $secret;
    }

    /**
     * Generate an array of 8 random recovery codes.
     */
    public function generateRecoveryCodes(int $count = 8): array
    {
        $codes = [];
        for ($i = 0; $i < $count; $i++) {
            $codes[] = strtoupper(bin2hex(random_bytes(5))); // e.g. 10 char hex
        }
        return $codes;
    }

    /**
     * Verify a 6-digit TOTP code against a secret with +/- 1 interval clock skew tolerance.
     */
    public function verifyCode(string $secret, string $code): bool
    {
        $currentInterval = (int) floor(time() / 30);

        for ($skew = -1; $skew <= 1; $skew++) {
            if ($this->calculateCode($secret, $currentInterval + $skew) === $code) {
                return true;
            }
        }

        return false;
    }

    /**
     * Compute the 6-digit OTP code for a given 30-second interval.
     */
    public function calculateCode(string $secret, int $interval): string
    {
        $binarySecret = $this->base32Decode($secret);
        $timeBytes = pack('N*', 0) . pack('N*', $interval);
        $hash = hash_hmac('sha1', $timeBytes, $binarySecret, true);

        $offset = ord($hash[strlen($hash) - 1]) & 0x0F;
        $truncatedHash = (
            ((ord($hash[$offset]) & 0x7F) << 24) |
            ((ord($hash[$offset + 1]) & 0xFF) << 16) |
            ((ord($hash[$offset + 2]) & 0xFF) << 8) |
            (ord($hash[$offset + 3]) & 0xFF)
        );

        $otp = $truncatedHash % 1000000;
        return str_pad((string) $otp, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Generate an otpauth:// URL for QR code generation in authenticator apps.
     */
    public function getQrCodeUri(string $companyName, string $userEmail, string $secret): string
    {
        $encodedCompany = rawurlencode($companyName);
        $encodedEmail = rawurlencode($userEmail);
        return "otpauth://totp/{$encodedCompany}:{$encodedEmail}?secret={$secret}&issuer={$encodedCompany}&algorithm=SHA1&digits=6&period=30";
    }

    /**
     * Helper to decode Base32 string to binary.
     */
    private function base32Decode(string $b32): string
    {
        $b32 = strtoupper($b32);
        $buffer = 0;
        $bitsLeft = 0;
        $output = '';

        for ($i = 0, $len = strlen($b32); $i < $len; $i++) {
            $char = $b32[$i];
            $val = strpos(self::BASE32_CHARS, $char);
            if ($val === false) {
                continue;
            }

            $buffer = ($buffer << 5) | $val;
            $bitsLeft += 5;

            if ($bitsLeft >= 8) {
                $bitsLeft -= 8;
                $output .= chr(($buffer >> $bitsLeft) & 0xFF);
            }
        }

        return $output;
    }
}
