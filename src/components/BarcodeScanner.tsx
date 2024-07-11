'use client';

import React, { useState, useEffect, useRef } from 'react';
import Quagga from '@ericblade/quagga2';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
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
        } as Quagga2.QuaggaJSConfiguration,
        (err: any) => {
          if (err) {
            console.error('Error initializing Quagga:', err);
            return;
          }
          Quagga.start();
          setIsScanning(true);
        }
      );

      Quagga.onDetected((result: Quagga2.QuaggaJSResultObject) => {
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

  const styles = {
    scannerContainer: {
      position: 'relative' as 'relative',
      width: '100%',
      maxWidth: '640px',
      margin: '0 auto',
    },
    video: {
      width: '100%',
      height: 'auto',
    },
    canvas: {
      position: 'absolute' as 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
    },
    button: {
      display: 'block',
      margin: '10px auto',
      padding: '10px 20px',
      fontSize: '16px',
      color: 'white',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  return (
    <div>
      <div ref={scannerRef} style={styles.scannerContainer}>
        <video style={styles.video} />
        <canvas className="drawingBuffer" style={styles.canvas} />
      </div>
      {!isScanning && (
        <button onClick={startScanner} style={styles.button}>
          Start Scanner
        </button>
      )}
      {isScanning && (
        <button onClick={stopScanner} style={styles.button}>
          Stop Scanner
        </button>
      )}
    </div>
  );
}
