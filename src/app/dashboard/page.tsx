'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [schoolType, setSchoolType] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [tripType, setTripType] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [busNumber, setBusNumber] = useState('');

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        router.push('/signin');
      }
    }
    getUser();
  }, [supabase, router]);

  const handleContinue = () => {
    if (schoolType && timeOfDay && tripType && routeNumber && busNumber) {
      // Store the selected values in localStorage
      localStorage.setItem('dashboardData', JSON.stringify({
        schoolType,
        timeOfDay,
        tripType,
        routeNumber,
        busNumber
      }));
      router.push('/scanning');
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
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
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    label: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    select: {
      padding: '0.5rem',
      fontSize: '1rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    input: {
      padding: '0.5rem',
      fontSize: '1rem',
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
    },
    signOutButton: {
      marginTop: '1rem',
      padding: '0.5rem',
      fontSize: '0.9rem',
      backgroundColor: '#d32f2f',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      <form style={styles.form}>
        <label style={styles.label}>
          School Type:
          <select 
            style={styles.select}
            value={schoolType} 
            onChange={(e) => setSchoolType(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="NURSERY">NURSERY</option>
            <option value="TTS">TTS</option>
          </select>
        </label>

        <label style={styles.label}>
          Time of Day:
          <select 
            style={styles.select}
            value={timeOfDay} 
            onChange={(e) => setTimeOfDay(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="FORENOON">FORENOON</option>
            <option value="AFTERNOON">AFTERNOON</option>
          </select>
        </label>

        <label style={styles.label}>
          Trip Type:
          <select 
            style={styles.select}
            value={tripType} 
            onChange={(e) => setTripType(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="PICKUP">PICKUP</option>
            <option value="DROP">DROP</option>
          </select>
        </label>

        <label style={styles.label}>
          Route Number:
          <input 
            style={styles.input}
            type="text" 
            value={routeNumber} 
            onChange={(e) => setRouteNumber(e.target.value)}
          />
        </label>

        <label style={styles.label}>
          Bus Number:
          <input 
            style={styles.input}
            type="text" 
            value={busNumber} 
            onChange={(e) => setBusNumber(e.target.value)}
          />
        </label>

        <button type="button" style={styles.button} onClick={handleContinue}>
          Continue
        </button>
      </form>

      <button style={styles.signOutButton} onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}