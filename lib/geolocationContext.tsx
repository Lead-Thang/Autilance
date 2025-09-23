"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type GeolocationProviderType = 'browser' | 'ipgeolocation' | 'ip2location' | 'smarty' | 'google' | 'mapbox';

interface GeolocationContextType {
  selectedProvider: GeolocationProviderType;
  setSelectedProvider: (provider: GeolocationProviderType) => void;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(undefined);

export function GeolocationProvider({ children }: { children: ReactNode }) {
  const [selectedProvider, setSelectedProvider] = useState<GeolocationProviderType>('browser');

  return (
    <GeolocationContext.Provider value={{ selectedProvider, setSelectedProvider }}>
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocation() {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error('useGeolocation must be used within a GeolocationProvider');
  }
  return context;
}