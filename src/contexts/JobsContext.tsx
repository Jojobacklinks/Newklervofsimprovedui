import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { mockJobs, Job } from '../data/jobsData';

interface JobsContextType {
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

const sanitizeJobs = (jobs: Job[]): Job[] => {
  return jobs.filter((job) => !job.id.startsWith('#L'));
};

// Helper to get initial jobs safely
const getInitialJobs = (): Job[] => {
  if (typeof window === 'undefined') return sanitizeJobs(mockJobs);
  try {
    // Clear localStorage to ensure we always use the latest mockJobs
    // This prevents old cached job data from persisting
    localStorage.removeItem('customJobs');
    
    const storedJobs = localStorage.getItem('customJobs');
    const customJobs = storedJobs ? JSON.parse(storedJobs) : [];
    return sanitizeJobs([...mockJobs, ...customJobs]);
  } catch (error) {
    console.error('Error loading jobs from localStorage:', error);
    return sanitizeJobs(mockJobs);
  }
};

export function JobsProvider({ children }: { children: ReactNode }) {
  // Initialize with mockJobs and any jobs from localStorage
  const [jobs, setJobs] = useState<Job[]>(getInitialJobs);

  // Create a Set of mock job IDs for efficient lookup
  const mockJobIds = useMemo(() => new Set(mockJobs.map(job => job.id)), []);

  // Persist custom jobs to localStorage whenever they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Use a longer debounce to reduce iframe communication issues
    const timeoutId = setTimeout(() => {
      try {
        const customJobs = sanitizeJobs(jobs.filter(job => !mockJobIds.has(job.id)));
        localStorage.setItem('customJobs', JSON.stringify(customJobs));
      } catch (error) {
        console.error('Error saving jobs to localStorage:', error);
      }
    }, 300); // Increased from 100ms to 300ms

    return () => clearTimeout(timeoutId);
  }, [jobs, mockJobIds]);

  useEffect(() => {
    setJobs((prevJobs) => sanitizeJobs(prevJobs));
  }, []);

  const addJob = useCallback((job: Job) => {
    setJobs(prev => [...prev, job]);
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job => 
      job.id === id ? { ...job, ...updates } : job
    ));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    jobs,
    addJob,
    updateJob,
    deleteJob
  }), [jobs, addJob, updateJob, deleteJob]);

  return (
    <JobsContext.Provider value={contextValue}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}
