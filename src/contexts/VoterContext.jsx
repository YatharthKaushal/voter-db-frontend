import React, { createContext, useContext, useState } from 'react';
import { mockVoters } from '../data/mockData';

const VoterContext = createContext();

export const useVoters = () => {
  const context = useContext(VoterContext);
  if (!context) {
    throw new Error('useVoters must be used within a VoterProvider');
  }
  return context;
};

export const VoterProvider = ({ children }) => {
  const [voters, setVoters] = useState(mockVoters);
  const [loading, setLoading] = useState(false);

  const addVoter = async (voterData) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newVoter = {
          ...voterData,
          id: Date.now()
        };
        setVoters(prev => [...prev, newVoter]);
        setLoading(false);
        resolve(newVoter);
      }, 500);
    });
  };

  const updateVoter = async (id, voterData) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setVoters(prev => prev.map(voter => 
          voter.id === id ? { ...voter, ...voterData } : voter
        ));
        setLoading(false);
        resolve(voterData);
      }, 500);
    });
  };

  const deleteVoter = async (id) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setVoters(prev => prev.filter(voter => voter.id !== id));
        setLoading(false);
        resolve();
      }, 500);
    });
  };

  const importVoters = async (newVoters) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setVoters(prev => [...prev, ...newVoters]);
        setLoading(false);
        resolve(newVoters);
      }, 1000);
    });
  };

  const value = {
    voters,
    loading,
    addVoter,
    updateVoter,
    deleteVoter,
    importVoters
  };

  return (
    <VoterContext.Provider value={value}>
      {children}
    </VoterContext.Provider>
  );
};