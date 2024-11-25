import { Buffer } from 'buffer';

export const ChromeIdentity = {
  async getDeviceIdentity() {
    const components = [
      await navigator.storage.estimate(),
      await this.getClientInfo(),
      await this.getHardwareInfo(),
     // screen.width * window.devicePixelRatio,
     // screen.height * window.devicePixelRatio,
      navigator.hardwareConcurrency,
      navigator.deviceMemory
    ];
    
    const hash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(JSON.stringify(components))
    );
    return Buffer.from(hash).toString('hex');
  },

  async getClientInfo() {
    return {
      platform: navigator.platform,
      mobile: navigator.userAgentData?.mobile ?? false,
      brands: navigator.userAgentData?.brands ?? [],
      connection: navigator.connection?.type ?? 'unknown'
    };
  },

  async getHardwareInfo() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    return {
      gpu: gl ? {
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER)
      } : null
    };
  },

  async verifyIdentity(storedId) {
    const currentId = await this.getDeviceIdentity();
    return storedId === currentId;
  },

  async generateKey(password, deviceId) {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password + deviceId),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode(deviceId),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  },

  async encrypt(data, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(JSON.stringify(data))
    );

    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted))
    };
  },

  async decrypt(encryptedData, key) {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
      key,
      new Uint8Array(encryptedData.data)
    );

    return JSON.parse(new TextDecoder().decode(decrypted));
  }
};

// Usage example:
const deviceId = await ChromeIdentity.getDeviceIdentity();
const key = await ChromeIdentity.generateKey('password', deviceId);
const encrypted = await ChromeIdentity.encrypt({ userId: 'user123' }, key);