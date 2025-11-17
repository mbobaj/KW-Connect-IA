export interface ConsumptionDataPoint {
  time: string;
  date: string;
  consumption: number; // in kWh
}

export interface Device {
  deviceId: string;
  deviceName: string;
  status: 'on' | 'off' | 'standby';
  currentWattage: number;
  todayKWh: number;
  hourlyHistoryKWh: number[]; // Array of 24 numbers
  icon: string;
}