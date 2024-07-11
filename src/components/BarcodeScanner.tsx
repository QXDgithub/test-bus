'use client';

import { useEffect, useState } from 'react';
import { BarcodeFormat, DecodeHintType, BrowserMultiFormatReader } from '@zxing/library';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const hints = new Map();
    const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    const reader = new BrowserMultiFormatReader(hints);

    reader.listVideoInputDevices().then((videoInputDevices) => {
      setVideoInputDevices(videoInputDevices);
      if (videoInputDevices.length > 0) {
        setSelectedDeviceId(videoInputDevices[0].deviceId);
      }
    }).catch((err) => {
      console.error(err);
    });

    return () => {
      reader.reset();
    };
  }, []);

  useEffect(() => {
    if (selectedDeviceId) {
      const hints = new Map();
      const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128];
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
      const reader = new BrowserMultiFormatReader(hints);

      reader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
        if (result) {
          onScan(result.getText());
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
          console.error(err);
        }
      });

      return () => {
        reader.reset();
      };
    }
  }, [selectedDeviceId, onScan]);

  return (
    <div>
      <select onChange={(e) => setSelectedDeviceId(e.target.value)}>
        {videoInputDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
      <video id="video" width="300" height="200" style={{ border: '1px solid gray' }}></video>
    </div>
  );
}