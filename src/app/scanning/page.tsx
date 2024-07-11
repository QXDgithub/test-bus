'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BarcodeScanner } from '@/components/BarcodeScanner';

export default function Scanning() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [scannedCode, setScannedCode] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
      } else {
        const storedData = localStorage.getItem('dashboardData');
        if (storedData) {
          setDashboardData(JSON.parse(storedData));
        } else {
          alert('Dashboard data not found. Please go back and fill in the details.');
          router.push('/dashboard');
        }
      }
    }
    checkUser();
  }, [supabase, router]);

  useEffect(() => {
    // Autofocus the input field
    inputRef.current?.focus();
  }, []);

  const handleScan = (result: string) => {
    setScannedCode(result);
    setManualInput(result);
    handleSubmit(result);
  };

  const handleManualInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setManualInput(value);
    if (value.length === 8) {
      handleSubmit(value);
    }
  };

  const handleSubmit = async (inputValue: string) => {
    if (inputValue.length !== 8) {
      return;
    }

    try {
      const { data: existingData, error: existingError } = await supabase
        .from('bus-exist')
        .select('*')
        .eq('adm_no', inputValue)
        .single();

      if (existingError) throw existingError;

      if (!existingData) {
        alert('Admission number not found in the system.');
        setManualInput('');
        inputRef.current?.focus();
        return;
      }

      if (existingData.route !== dashboardData.routeNumber || existingData.bus_no !== dashboardData.busNumber) {
        alert('Route or bus number does not match the existing data.');
        setManualInput('');
        inputRef.current?.focus();
        return;
      }

      const { error: insertError } = await supabase
        .from('bus-new')
        .insert({
          adm_no: existingData.adm_no,
          name: existingData.name,
          class_sec: existingData.class_sec,
          shift: existingData.shift,
          route: existingData.route,
          bus_no: existingData.bus_no,
          pickup_drop: dashboardData.tripType
        });

      if (insertError) throw insertError;

      alert('Data successfully recorded.');
      setManualInput('');
      setScannedCode('');
      inputRef.current?.focus();

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the data.');
      setManualInput('');
      inputRef.current?.focus();
    }
  };

  const handleChangeBus = () => {
    router.push('/dashboard');
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '1rem',
      color: '#333',
    },
    scannerContainer: {
      marginBottom: '1rem',
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      fontSize: '1rem',
      marginBottom: '1rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '0.75rem',
      fontSize: '1rem',
      backgroundColor: '#1877f2',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '1rem',
    },
    scannedCode: {
      marginTop: '1rem',
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Scanning Page</h1>
      <div style={styles.scannerContainer}>
        <BarcodeScanner onScan={handleScan} />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={manualInput}
        onChange={handleManualInput}
        placeholder="Enter 8-digit admission number"
        style={styles.input}
      />
      <button onClick={handleChangeBus} style={styles.button}>
        CHANGE BUS
      </button>
      {scannedCode && (
        <p style={styles.scannedCode}>Scanned Code: {scannedCode}</p>
      )}
    </div>
  );
}
