/**
 * Capability-based NFC and Browser Detector for YatraTap
 */

export interface DeviceCapabilityReport {
  isSecureContext: boolean;
  hasNdefReader: boolean;
  isIos: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  browserName: string;
  osName: string;
  nfcState: 'supported' | 'unsupported_ios' | 'unsupported_desktop' | 'insecure_context' | 'unsupported_browser';
  summaryTitle: string;
  summaryDescription: string;
  badgeText: string;
  badgeColor: 'emerald' | 'amber' | 'blue' | 'rose';
}

export function detectDeviceCapabilities(): DeviceCapabilityReport {
  if (typeof window === 'undefined') {
    return {
      isSecureContext: false,
      hasNdefReader: false,
      isIos: false,
      isAndroid: false,
      isDesktop: true,
      browserName: 'Server',
      osName: 'Unknown',
      nfcState: 'unsupported_desktop',
      summaryTitle: 'Server Environment',
      summaryDescription: 'Running in non-browser context.',
      badgeText: 'Offline',
      badgeColor: 'amber',
    };
  }

  const userAgent = navigator.userAgent || '';
  const isSecure = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const hasNdef = 'NDEFReader' in window;

  // OS Detection
  const isIos = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(userAgent);
  const isDesktop = !isIos && !isAndroid;

  // Browser Detection
  let browserName = 'Browser';
  if (/CriOS/i.test(userAgent)) {
    browserName = 'Chrome for iOS';
  } else if (/FxiOS/i.test(userAgent)) {
    browserName = 'Firefox for iOS';
  } else if (/EdgA|EdgiOS|Edge/i.test(userAgent)) {
    browserName = 'Microsoft Edge';
  } else if (/Chrome/i.test(userAgent)) {
    browserName = 'Chrome';
  } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
    browserName = 'Safari';
  } else if (/Firefox/i.test(userAgent)) {
    browserName = 'Firefox';
  }

  let osName = 'Desktop';
  if (isIos) osName = 'Apple iOS';
  else if (isAndroid) osName = 'Android';
  else if (/Windows/i.test(userAgent)) osName = 'Windows';
  else if (/Mac/i.test(userAgent)) osName = 'macOS';
  else if (/Linux/i.test(userAgent)) osName = 'Linux';

  // Determine state
  if (!isSecure) {
    return {
      isSecureContext: false,
      hasNdefReader: hasNdef,
      isIos,
      isAndroid,
      isDesktop,
      browserName,
      osName,
      nfcState: 'insecure_context',
      summaryTitle: 'Insecure Context (Requires HTTPS)',
      summaryDescription: 'Web NFC strictly requires an encrypted HTTPS connection or localhost development origin.',
      badgeText: 'HTTPS Required',
      badgeColor: 'rose',
    };
  }

  if (isIos) {
    return {
      isSecureContext: isSecure,
      hasNdefReader: false,
      isIos: true,
      isAndroid: false,
      isDesktop: false,
      browserName,
      osName: 'Apple iOS',
      nfcState: 'unsupported_ios',
      summaryTitle: 'iOS Safari – Web NFC Restricted',
      summaryDescription: 'Apple WebKit does not expose standard Web NFC to web browsers. Full simulation mode is activated for card testing.',
      badgeText: 'Simulated Mode (iOS)',
      badgeColor: 'amber',
    };
  }

  if (hasNdef && isAndroid) {
    return {
      isSecureContext: isSecure,
      hasNdefReader: true,
      isIos: false,
      isAndroid: true,
      isDesktop: false,
      browserName,
      osName: 'Android',
      nfcState: 'supported',
      summaryTitle: 'Web NFC Ready (Android)',
      summaryDescription: 'NDEFReader API is active. You can tap compatible NFC tags. Note: Protected NCMC transit balances are simulated.',
      badgeText: 'Web NFC Active',
      badgeColor: 'emerald',
    };
  }

  if (isDesktop) {
    return {
      isSecureContext: isSecure,
      hasNdefReader: hasNdef,
      isIos: false,
      isAndroid: false,
      isDesktop: true,
      browserName,
      osName,
      nfcState: 'unsupported_desktop',
      summaryTitle: `${osName} – Virtual NFC Engine`,
      summaryDescription: 'Desktop browsers do not have integrated consumer NFC polling. Interactive simulated scanner is active.',
      badgeText: 'Virtual Mode',
      badgeColor: 'blue',
    };
  }

  return {
    isSecureContext: isSecure,
    hasNdefReader: hasNdef,
    isIos,
    isAndroid,
    isDesktop,
    browserName,
    osName,
    nfcState: 'unsupported_browser',
    summaryTitle: `${browserName} – Web NFC Unavailable`,
    summaryDescription: 'This browser does not implement the W3C Web NFC specification. Simulated reader is active.',
    badgeText: 'Simulated',
    badgeColor: 'amber',
  };
}

