import React, { useState, useEffect } from 'react';
import {
  Radio,
  StopCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NfcRadarAnimation } from '../components/NfcRadarAnimation';
import type { ScanStatus } from '../components/NfcRadarAnimation';
import { nfcAdapter, NfcAdapter } from '../services/nfcAdapter';
import type { ScannedCardPayload } from '../services/nfcAdapter';
import { DeviceBadge } from '../components/DeviceBadge';
import { PhysicalCardGuide } from '../components/PhysicalCardGuide';

export const ScannerPage: React.FC = () => {
  const {
    deviceReport,
    showNotification,
    setIsTopUpModalOpen,
    setIsAddCardModalOpen,
    setScannedTagData,
  } = useApp();
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [lastScannedCard, setLastScannedCard] = useState<ScannedCardPayload | null>(null);
  const [isScanningActive, setIsScanningActive] = useState<boolean>(false);
  const [showPlacementGuide, setShowPlacementGuide] = useState<boolean>(true);

  useEffect(() => {
    if (deviceReport.nfcState === 'unsupported_ios') {
      setScanStatus('unsupported');
      setStatusMessage('iOS Safari Web NFC is restricted by WebKit. Use Virtual Tap below.');
    } else if (deviceReport.nfcState === 'insecure_context') {
      setScanStatus('unsupported');
      setStatusMessage('HTTPS required to access Web NFC API.');
    } else if (deviceReport.nfcState === 'unsupported_desktop') {
      setScanStatus('idle');
      setStatusMessage('Desktop virtual reader ready. Use simulation button below.');
    } else {
      setScanStatus('idle');
      setStatusMessage('Tap Start Scan and hold your NCMC card against device.');
    }

    return () => {
      nfcAdapter.cancelScan();
    };
  }, [deviceReport]);

  const handleStartScan = async () => {
    if (!deviceReport.hasNdefReader) {
      setScanStatus('unsupported');
      setStatusMessage('Web NFC (NDEFReader) is not supported on this browser.');
      showNotification('error', 'Device does not support Web NFC API. Use virtual simulation mode.');
      return;
    }

    try {
      setScanStatus('scanning');
      setIsScanningActive(true);
      setStatusMessage('Searching for contactless card (13.56 MHz)... Hold card steady on back of phone.');

      await nfcAdapter.startScan(
        (cardPayload) => {
          setScanStatus('detected');
          setIsScanningActive(false);
          setLastScannedCard(cardPayload);
          setScannedTagData(cardPayload);
          setStatusMessage(`Contactless Card Detected: ${cardPayload.serialNumber}`);
          showNotification('success', `Card ${cardPayload.serialNumber} detected!`);
        },
        (error) => {
          setScanStatus('failed');
          setIsScanningActive(false);
          setStatusMessage(error.message);
          showNotification('error', error.message);
        }
      );
    } catch (err: any) {
      setScanStatus('failed');
      setIsScanningActive(false);
      setStatusMessage(err.message || 'Failed to start Web NFC scanning.');
      showNotification('error', err.message || 'NFC scanning initiation failed.');
    }
  };

  const handleCancelScan = () => {
    nfcAdapter.cancelScan();
    setIsScanningActive(false);
    setScanStatus('cancelled');
    setStatusMessage('Scanning session cancelled by user.');
    showNotification('info', 'NFC scan stopped.');
  };

  const handleSimulateTap = () => {
    const mockCard = NfcAdapter.triggerSimulatedTap();
    setScanStatus('detected');
    setIsScanningActive(false);
    setLastScannedCard(mockCard);
    setScannedTagData(mockCard);
    setStatusMessage(`Virtual NCMC Card Tapped: ${mockCard.serialNumber}`);
    showNotification('success', `Simulated tap successful for ${mockCard.serialNumber}!`);
  };

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <DeviceBadge report={deviceReport} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
          NCMC Contactless Card Scanner
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
          Capability-aware NFC reader utilizing W3C Web NFC (NDEFReader) on Android Chrome and high-fidelity virtual emulation across iOS Safari and Desktop.
        </p>
      </div>

      {/* Radar Animation Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md relative overflow-hidden">
        <NfcRadarAnimation
          status={scanStatus}
          statusMessage={statusMessage}
          onSimulateTap={handleSimulateTap}
        />

        {/* Scan Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {deviceReport.hasNdefReader && !isScanningActive && (
            <button
              onClick={handleStartScan}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <Radio className="w-4 h-4 fill-zinc-950" />
              <span>Start Web NFC Scan</span>
            </button>
          )}

          {isScanningActive && (
            <button
              onClick={handleCancelScan}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm shadow-md shadow-rose-500/20 active:scale-95 cursor-pointer"
            >
              <StopCircle className="w-4 h-4" />
              <span>Stop Polling</span>
            </button>
          )}

          <button
            onClick={handleSimulateTap}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 font-semibold text-sm active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Instant Virtual Tap</span>
          </button>
        </div>
      </div>

      {/* Scanned Card Result Box (when card is detected) */}
      {lastScannedCard && (
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-500/50 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Contactless Card Detected</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
              {lastScannedCard.isSimulated ? 'VIRTUAL SIMULATION' : 'HARDWARE NFC SCAN'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-500 dark:text-zinc-400 block mb-1">Simulated Card Identifier:</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-white">{lastScannedCard.serialNumber}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-500 dark:text-zinc-400 block mb-1">Card Profile:</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{lastScannedCard.cardType}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Top-Up This Card</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAddCardModalOpen(true)}
              className="py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Save As New Card</span>
            </button>
          </div>
        </div>
      )}

      {/* Embedded Physical Card Placement Guide with Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowPlacementGuide(!showPlacementGuide)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-emerald-500 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>Card Tap Placement Guide ({showPlacementGuide ? 'Hide' : 'Show'})</span>
          </button>
        </div>

        {showPlacementGuide && <PhysicalCardGuide inline />}
      </div>
    </div>
  );
};
