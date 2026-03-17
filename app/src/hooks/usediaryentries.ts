import { useState, useEffect, useCallback } from 'react';
import type { DiaryEntry } from '@/types';

const STORAGE_KEY = 'lavanda-dreams-entries';

export function useDiaryEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load entries from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const entriesWithDates = parsed.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt),
        }));
        setEntries(entriesWithDates);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      } catch (error) {
        console.error('Error saving entries:', error);
      }
    }
  }, [entries, isLoaded]);

  const addEntry = useCallback((entryData: Omit<DiaryEntry, 'id' | 'createdAt'>) => {
    const newEntry: DiaryEntry = {
      ...entryData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const updateEntry = useCallback((id: string, updates: Partial<DiaryEntry>) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  }, []);

  const getEntryById = useCallback(
    (id: string) => entries.find(entry => entry.id === id),
    [entries]
  );

  const getStats = useCallback(() => {
    return {
      totalEntries: entries.length,
      totalImages: entries.filter(e => e.image).length,
      totalAudios: entries.filter(e => e.audio).length,
    };
  }, [entries]);

  return {
    entries,
    isLoaded,
    addEntry,
    deleteEntry,
    updateEntry,
    getEntryById,
    getStats,
  };
}
