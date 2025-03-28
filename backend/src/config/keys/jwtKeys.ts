import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const KEYS_DIR = path.join(__dirname);
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'private.key');
const PUBLIC_KEY_PATH = path.join(KEYS_DIR, 'public.key');

export function generateKeyPair(): void {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  // Write keys to files
  fs.writeFileSync(PRIVATE_KEY_PATH, privateKey);
  fs.writeFileSync(PUBLIC_KEY_PATH, publicKey);

  console.log('JWT key pair generated successfully');
}

export function getPrivateKey(): string {
  try {
    return fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
  } catch (error) {
    console.error('Error reading private key:', error);
    throw new Error('Private key not found');
  }
}

export function getPublicKey(): string {
  try {
    return fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
  } catch (error) {
    console.error('Error reading public key:', error);
    throw new Error('Public key not found');
  }
}

// Generate keys if they don't exist
if (!fs.existsSync(PRIVATE_KEY_PATH) || !fs.existsSync(PUBLIC_KEY_PATH)) {
  generateKeyPair();
} 