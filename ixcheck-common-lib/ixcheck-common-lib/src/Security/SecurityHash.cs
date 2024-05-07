using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Runtime.CompilerServices;
using System.Security.Cryptography;

namespace IXCheckCommonLib.Security
{
    public class SecurityHash
    {
        /// <summary>
        /// =======================
        /// HASHED PASSWORD FORMATS
        /// =======================
        /// Version 3:
        /// PBKDF2 with HMAC-SHA256, 128-bit salt, 256-bit subkey, 10000 iterations.
        /// Format: { 0x01, prf (UInt32), iter count (UInt32), salt length (UInt32), salt, subkey }
        /// (All UInt32s are stored big-endian.)
        /// </summary>

        private const int _pbkdf2IterCount = 10000;
        private const int _pbkdf2SubkeyLength = 256 / 8; // 256 bits
        private const int _saltSize = 128 / 8; // 128 bits


        /// <summary>
        /// Returns a hashed representation of the specified <paramref name="_password"/>.
        /// </summary>
        /// <param name="_password">The password to generate a hash value for.</param>
        /// <returns>The hash value for <paramref name="_password" /> as a base-64-encoded string.</returns>
        /// <exception cref="T:System.ArgumentNullException"><paramref name="_password" /> is null.</exception>
        public static string HashPassword(string _password)
        {
            if (_password == null)
            {
                throw new ArgumentNullException(nameof(_password));
            }
            else
            {
                _password = _password + "";
                if (_password.Trim() == "")
                {
                    throw new ArgumentNullException(nameof(_password));
                }
            }

            return HashPasswordInternal(_password);
        }

        /// <summary>
        /// Determines whether the specified RFC 2898 hash and password are a cryptographic match.
        /// </summary>
        /// <param name="_hashedPassword">The previously-computed RFC 2898 hash value as a base-64-encoded string.</param>
        /// <param name="_password">The plaintext password to cryptographically compare with hashedPassword.</param>
        /// <returns>true if the hash value is a cryptographic match for the password; otherwise, false.</returns>
        /// <remarks>
        /// <paramref name="_hashedPassword" /> must be of the format of HashPassword (salt + Hash(salt+input).
        /// </remarks>
        /// <exception cref="T:System.ArgumentNullException">
        /// <paramref name="_hashedPassword" /> or <paramref name="_password" /> is null.
        /// </exception>
        public static bool VerifyHashedPassword(string _hashedPassword, string _password)
        {
            if (_hashedPassword == null)
            {
                throw new ArgumentNullException(nameof(_hashedPassword));
            }
            if (_password == null)
            {
                throw new ArgumentNullException(nameof(_password));
            }

            return VerifyHashedPasswordInternal(_hashedPassword, _password);
        }

        /// <summary>
        /// Random Number Generator
        /// </summary>
        private static readonly RandomNumberGenerator _rng = RandomNumberGenerator.Create();

        /// <summary>
        /// Hash Password Internal
        /// </summary>
        /// <param name="_password"></param>
        /// <returns></returns>
        private static string HashPasswordInternal(string _password)
        {
            var _bytes = HashPasswordInternal(_password, KeyDerivationPrf.HMACSHA256, _pbkdf2IterCount, _saltSize, _pbkdf2SubkeyLength);
            return Convert.ToBase64String(_bytes);
        }

        /// <summary>
        /// Hash Password Internal
        /// </summary>
        /// <param name="_password"></param>
        /// <param name="_keyDerivationPrf"></param>
        /// <param name="_iterationCount"></param>
        /// <param name="_saltSize"></param>
        /// <param name="_numBytesRequested"></param>
        /// <returns></returns>
        private static byte[] HashPasswordInternal(
            string _password,
            KeyDerivationPrf _keyDerivationPrf,
            int _iterationCount,
            int _saltSize,
            int _numBytesRequested)
        {
            // Produce a version 3 (see comment above) text hash.
            var _salt = new byte[_saltSize];
            _rng.GetBytes(_salt);
            var _subkey = KeyDerivation.Pbkdf2(_password, _salt, _keyDerivationPrf, _iterationCount, _numBytesRequested);

            var _outputBytes = new byte[13 + _salt.Length + _subkey.Length];

            // Write format marker.
            _outputBytes[0] = 0x01;

            // Write hashing algorithm version.
            WriteNetworkByteOrder(_outputBytes, 1, (uint)_keyDerivationPrf);

            // Write iteration count of the algorithm.
            WriteNetworkByteOrder(_outputBytes, 5, (uint)_iterationCount);

            // Write size of the salt.
            WriteNetworkByteOrder(_outputBytes, 9, (uint)_saltSize);

            // Write the salt.
            Buffer.BlockCopy(_salt, 0, _outputBytes, 13, _salt.Length);

            // Write the subkey.
            Buffer.BlockCopy(_subkey, 0, _outputBytes, 13 + _saltSize, _subkey.Length);
            return _outputBytes;
        }

        /// <summary>
        /// Verify Hashed Password Internal
        /// </summary>
        /// <param name="_hashedPassword"></param>
        /// <param name="_password"></param>
        /// <returns></returns>
        private static bool VerifyHashedPasswordInternal(string _hashedPassword, string _password)
        {
            var _decodedHashedPassword = Convert.FromBase64String(_hashedPassword);

            if (_decodedHashedPassword.Length == 0)
            {
                return false;
            }

            try
            {
                // Verify hashing format.
                if (_decodedHashedPassword[0] != 0x01)
                {
                    // Unknown format header.
                    return false;
                }

                // Read hashing algorithm version.
                var _keyDerivationPrf = (KeyDerivationPrf)ReadNetworkByteOrder(_decodedHashedPassword, 1);

                // Read iteration count of the algorithm.
                var _iterationCount = (int)ReadNetworkByteOrder(_decodedHashedPassword, 5);

                // Read size of the salt.
                var _saltLength = (int)ReadNetworkByteOrder(_decodedHashedPassword, 9);

                // Verify the salt size: >= 128 bits.
                if (_saltLength < 128 / 8)
                {
                    return false;
                }

                // Read the salt.
                var _salt = new byte[_saltLength];
                Buffer.BlockCopy(_decodedHashedPassword, 13, _salt, 0, _salt.Length);

                // Verify the subkey length >= 128 bits.
                var _subkeyLength = _decodedHashedPassword.Length - 13 - _salt.Length;
                if (_subkeyLength < 128 / 8)
                {
                    return false;
                }

                // Read the subkey.
                var _expectedSubkey = new byte[_subkeyLength];
                Buffer.BlockCopy(_decodedHashedPassword, 13 + _salt.Length, _expectedSubkey, 0, _expectedSubkey.Length);

                // Hash the given password and verify it against the expected subkey.
                var _actualSubkey = KeyDerivation.Pbkdf2(_password, _salt, _keyDerivationPrf, _iterationCount, _subkeyLength);
                return ByteArraysEqual(_actualSubkey, _expectedSubkey);
            }
            catch
            {
                // This should never occur except in the case of a malformed payload, where
                // we might go off the end of the array. Regardless, a malformed payload
                // implies verification failed.
                return false;
            }
        }

        /// <summary>
        /// Read Network Byte Order
        /// </summary>
        /// <param name="_buffer"></param>
        /// <param name="_offset"></param>
        /// <returns></returns>
        private static uint ReadNetworkByteOrder(byte[] _buffer, int _offset)
        {
            return ((uint)(_buffer[_offset + 0]) << 24)
                | ((uint)(_buffer[_offset + 1]) << 16)
                | ((uint)(_buffer[_offset + 2]) << 8)
                | ((uint)(_buffer[_offset + 3]));
        }

        /// <summary>
        /// Write Network Byte Order
        /// </summary>
        /// <param name="_buffer"></param>
        /// <param name="_offset"></param>
        /// <param name="_value"></param>
        private static void WriteNetworkByteOrder(byte[] _buffer, int _offset, uint _value)
        {
            _buffer[_offset + 0] = (byte)(_value >> 24);
            _buffer[_offset + 1] = (byte)(_value >> 16);
            _buffer[_offset + 2] = (byte)(_value >> 8);
            _buffer[_offset + 3] = (byte)(_value >> 0);
        }

        /// <summary>
        /// Compares two byte arrays for equality. 
        /// The method is specifically written so that the loop is not optimized.
        /// </summary>
        /// <param name="_a"></param>
        /// <param name="_b"></param>
        /// <returns></returns>
        [MethodImpl(MethodImplOptions.NoInlining | MethodImplOptions.NoOptimization)]
        private static bool ByteArraysEqual(byte[] _a, byte[] _b)
        {
            if (ReferenceEquals(_a, _b))
            {
                return true;
            }

            if (_a == null || _b == null || _a.Length != _b.Length)
            {
                return false;
            }

            var _areSame = true;
            for (var i = 0; i < _a.Length; i++)
            {
                _areSame &= (_a[i] == _b[i]);
            }
            return _areSame;
        }
    }
}
