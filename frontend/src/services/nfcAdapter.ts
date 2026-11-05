/**
 * Modular Web NFC Adapter for YatraTap
 * 
 * Safety & Architecture Notice:
 * Standard Web NFC (NDEFReader) reads NDEF records and hardware UID/serial numbers.
 * Contactless NCMC transit cards implement dual-interface ISO/IEC 14443 Type A/B
 * with qSPARC EMV applets protected by hardware SAM / HSM cryptography.
 * Web NFC does NOT possess access to payment keys or protected balance sectors.
 */

export interface ScannedCardPayload {
  serialNumber: string;
  cardType: string;
  isSimulated: boolean;
  recordsCount: number;
  detectedAt: string;
  notes: string;
}

export class NfcAdapter {
  private abortController: AbortController | null = null;
  private isScanning = false;

  /**
   * Check if Web NFC NDEFReader is implemented in the current browser runtime.
   */
  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'NDEFReader' in window;
  }

  /**
   * Check if running in a secure HTTPS / localhost context.
   */
  public static isSecureContext(): boolean {
    return typeof window !== 'undefined' && Boolean(window.isSecureContext);
  }

  public getStatus(): boolean {
    return this.isScanning;
  }

  /**
   * Start native Web NFC scanning on supported devices (e.g. Android Chrome).
   */
  public async startScan(
    onReading: (card: ScannedCardPayload) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    if (!NfcAdapter.isSupported()) {
      throw new Error('Web NFC (NDEFReader) is not supported on this browser or platform.');
    }

    if (!NfcAdapter.isSecureContext()) {
      throw new Error('Web NFC requires a secure origin (HTTPS or localhost).');
    }

    try {
      this.abortController = new AbortController();
      const WinNDEF = (window as unknown as { NDEFReader: new () => { scan: (opt: { signal: AbortSignal }) => Promise<void>; onreading: (e: any) => void; onreadingerror: () => void } }).NDEFReader;
      const ndef = new WinNDEF();

      this.isScanning = true;

      await ndef.scan({ signal: this.abortController.signal });

      ndef.onreading = (event: any) => {
        const rawSerial = event.serialNumber || 'NCMC-DETECTED-' + Math.random().toString(36).substring(2, 7).toUpperCase();
        
        // Sanitize & format simulated identifier
        const payload: ScannedCardPayload = {
          serialNumber: `NCMC-BY-${rawSerial.replace(/:/g, '').slice(-4).toUpperCase() || '8021'}`,
          cardType: 'Bharat Yatra NCMC Contactless Card',
          isSimulated: false,
          recordsCount: event.message?.records?.length || 0,
          detectedAt: new Date().toISOString(),
          notes: 'Hardware tag tapped. NCMC protected balance is simulated via backend session.',
        };

        onReading(payload);
      };

      ndef.onreadingerror = () => {
        onError(new Error('Tag detected but read failed or communication was interrupted. Please hold card steady.'));
      };
    } catch (err: any) {
      this.isScanning = false;
      if (err.name === 'AbortError') {
        // Normal cancellation
        return;
      }
      if (err.name === 'NotAllowedError') {
        throw new Error('NFC permission was denied by user or blocked by browser permissions.');
      }
      if (err.name === 'NotSupportedError') {
        throw new Error('No compatible NFC hardware antenna detected on this device.');
      }
      throw err;
    }
  }

  /**
   * Cancel active NFC scanning session.
   */
  public cancelScan(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.isScanning = false;
  }

  /**
   * Simulated NFC tap generator for iOS, Desktop, and unsupported environments
   */
  public static triggerSimulatedTap(): ScannedCardPayload {
    return {
      serialNumber: 'NCMC-BY-8021-9943',
      cardType: 'Bharat Yatra NCMC Card (Simulated Tap)',
      isSimulated: true,
      recordsCount: 1,
      detectedAt: new Date().toISOString(),
      notes: 'Virtual NFC Tap simulation generated for testing without physical reader.',
    };
  }
}

export const nfcAdapter = new NfcAdapter();
