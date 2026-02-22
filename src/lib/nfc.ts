import { Capacitor } from '@capacitor/core';

/**
 * NFC bridge helper.
 * Works on Android via Capacitor; no-ops gracefully on web.
 */

export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform();
}

let nfcPlugin: any = null;

async function getNfc() {
  if (!nfcPlugin) {
    const mod = await import('@capgo/capacitor-nfc');
    nfcPlugin = mod.CapacitorNfc;
  }
  return nfcPlugin;
}

/**
 * Start listening for NFC tag scans.
 * Returns an object with a `remove()` method to stop listening.
 *
 * @param onTag - callback receiving the scanned tag data
 */
export async function startNfcScan(onTag: (tag: any) => void): Promise<{ remove: () => void }> {
  if (!isNativeApp()) {
    console.warn('NFC is only available in the native app');
    return { remove: () => {} };
  }

  const Nfc = await getNfc();
  const listener = await Nfc.addListener('nfcTagScanned', (event: any) => {
    onTag(event);
  });

  await Nfc.startScanSession();
  return {
    remove: async () => {
      listener.remove();
      await Nfc.stopScanSession();
    }
  };
}

/**
 * Write an NDEF text record to an NFC tag.
 *
 * @param text - the text to write (e.g., a wagon ID)
 */
export async function writeNfcTag(text: string): Promise<void> {
  if (!isNativeApp()) {
    console.warn('NFC is only available in the native app');
    return;
  }

  const Nfc = await getNfc();
  await Nfc.write({
    records: [{ type: 'text', value: text }]
  });
}
