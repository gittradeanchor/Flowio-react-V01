import { JobItem } from './types';

export const JOB_DATA: Record<string, JobItem> = {
    'power-point': { sku: 'ELEC-002', name: 'Power point add', qty: 1, rate: 150 },
    'led-downlight': { sku: 'ELEC-003', name: 'LED downlight supply+fit', qty: 3, rate: 85 },
    'ceiling-fan': { sku: 'ELEC-005', name: 'Install Ceiling Fan', qty: 1, rate: 250 },
    'labour': { sku: 'GEN-002', name: 'Labour', qty: 3, rate: 95 }
};

export const INITIAL_QUOTES_PER_WEEK = 20;
export const INITIAL_MINUTES_SAVED = 12;
export const INITIAL_HOURLY_RATE = 120;
