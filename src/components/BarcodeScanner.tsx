'use client';

import React, { useState, useEffect, useRef } from 'react';
import Quagga from 'quagga';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
}

interface QuaggaResult {
  codeResult: {
    code: string;
  };
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  const startScanner = () => {
    if (scannerRef.current) {
      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            constraints: {
              width: 640,
              height: 480,
              facingMode: 'environment', // or "user" for front camera
            },
            target: scannerRef.current,
          },
          decoder: {
            readers: ['ean_reader', 'code_128_reader'],
          },
        },
        (err: any) => {
          if (err) {
            console.error('Error initializing Quagga:', err);
            return;
          }
          Quagga.start();
          setIsScanning(true);
        }
      );

      Quagga.onDetected((result: QuaggaResult) => {
        if (result.codeResult.code) {
          onScan(result.codeResult.code);
          stopScanner();
        }
      });
    }
  };

  const stopScanner = () => {
    Quagga.stop();
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (isScanning) {
        Quagga.stop();
      }
    };
  }, [isScanning]);

  return (
    <div>
      <div ref={scannerRef} style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }} />
      {!isScanning && (
        <button onClick={startScanner} style={{ display: 'block', margin: '10px auto' }}>
          Start Scanner
        </button>
      )}
      {isScanning && (
        <button onClick={stopScanner} style={{ display: 'block', margin: '10px auto' }}>
          Stop Scanner
        </button>
      )}
    </div>
  );
}
