export type VehicleType = 'bicycle' | 'motorcycle' | 'lorry';

export interface Vehicle {
  id: number;
  type: VehicleType;
  x: number;
}
