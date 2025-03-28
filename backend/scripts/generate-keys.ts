import { generateKeyPair } from '../src/config/keys/jwtKeys';

console.log('Generating JWT key pair...');
generateKeyPair();
console.log('JWT key pair generation complete!'); 