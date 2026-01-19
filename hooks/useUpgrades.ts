import { useState, useEffect, useMemo } from 'react';
import {
  getAllUpgrades,
  getUpgradesByStation,
  getUpgradeById,
  getStations,
} from '../lib/dataService';
import type { WorkshopUpgrade, WorkshopStation } from '../lib/types';

// Hook for getting all upgrades
export function useAllUpgrades() {
  const upgrades = useMemo(() => getAllUpgrades(), []);
  return upgrades;
}

// Hook for getting upgrades grouped by station
export function useUpgradesByStation() {
  const upgrades = useAllUpgrades();

  const grouped = useMemo(() => {
    const stations = getStations();
    const result: Record<string, WorkshopUpgrade[]> = {};

    stations.forEach(station => {
      result[station] = upgrades.filter(u => u.station === station);
    });

    return result;
  }, [upgrades]);

  return grouped;
}

// Hook for getting upgrades for a specific station
export function useStationUpgrades(station: string | null) {
  const [upgrades, setUpgrades] = useState<WorkshopUpgrade[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!station) {
      setUpgrades([]);
      return;
    }

    setIsLoading(true);
    const stationUpgrades = getUpgradesByStation(station);
    setUpgrades(stationUpgrades.sort((a, b) => a.level - b.level));
    setIsLoading(false);
  }, [station]);

  return { upgrades, isLoading };
}

// Hook for getting a single upgrade
export function useUpgradeDetails(upgradeId: string | null) {
  const [upgrade, setUpgrade] = useState<WorkshopUpgrade | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!upgradeId) {
      setUpgrade(null);
      return;
    }

    setIsLoading(true);
    const foundUpgrade = getUpgradeById(upgradeId);
    setUpgrade(foundUpgrade || null);
    setIsLoading(false);
  }, [upgradeId]);

  return { upgrade, isLoading };
}

// Hook for getting station names with display labels
export function useStationsList() {
  const stationLabels: Record<string, string> = {
    gunsmith: 'Gunsmith',
    gear_bench: 'Gear Bench',
    medical_lab: 'Medical Lab',
    scrappy: 'Scrappy',
    explosives_station: 'Explosives Station',
    refiner: 'Refiner',
    utility_station: 'Utility Station',
  };

  const stations = useMemo(() => {
    const stationIds = getStations();
    return stationIds.map(id => ({
      id,
      label: stationLabels[id] || id,
    }));
  }, []);

  return stations;
}
