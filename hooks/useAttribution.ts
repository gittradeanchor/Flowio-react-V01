import { useState, useEffect } from 'react';

export const ATTR_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'msclkid',
  'wbraid',
  'gbraid',
  'ad_id',
  'adset_id',
  'campaign_id',
];

const LEAD_ID_KEY = 'flowio_lead_id_v1';

export const getOrCreateLeadId = () => {
    if (typeof window === 'undefined') return '';
    
    let id = window.localStorage.getItem(LEAD_ID_KEY);
    if (!id) {
        id = (crypto?.randomUUID && crypto.randomUUID()) || `lead_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        window.localStorage.setItem(LEAD_ID_KEY, id);
    }
    return id;
};

export const getStoredAttribution = () => {
    const out: Record<string, string> = {};
    if (typeof window === 'undefined') return out;
    
    // Standard Keys
    ATTR_KEYS.forEach((key) => {
        const v = window.localStorage.getItem(key);
        if (v) out[key] = v;
    });

    // Extra Metadata
    const extras = ['landing_url', 'referrer', 'user_agent'];
    extras.forEach(key => {
        const v = window.localStorage.getItem(key);
        if (v) out[key] = v;
    });

    return out;
};

export const useAttribution = () => {
  const [attrib, setAttrib] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 0. Ensure Lead ID exists immediately on session start
    getOrCreateLeadId();

    const params = new URLSearchParams(window.location.search);
    const next: Record<string, string> = {};

    // 1. Standard UTMs/Click IDs
    ATTR_KEYS.forEach((key) => {
      const fromUrl = params.get(key);
      const fromStorage = window.localStorage.getItem(key);
      const value = fromUrl || fromStorage || '';
      if (value) {
        next[key] = value;
        window.localStorage.setItem(key, value); 
      }
    });

    // 2. Extra Metadata (Capture on first load)
    if (!window.localStorage.getItem('landing_url')) {
        window.localStorage.setItem('landing_url', window.location.href.split('#')[0]);
    }
    if (!window.localStorage.getItem('referrer') && document.referrer) {
        window.localStorage.setItem('referrer', document.referrer);
    }
    if (!window.localStorage.getItem('user_agent')) {
        window.localStorage.setItem('user_agent', navigator.userAgent);
    }

    setAttrib(next);
  }, []);

  return attrib;
};
