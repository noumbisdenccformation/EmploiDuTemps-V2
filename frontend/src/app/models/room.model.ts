export interface Room {
  id?: number;
  name: string;
  code: string;
  type: 'classroom' | 'laboratory' | 'amphitheater';
  status?: 'commune' | 'unique';
  capacity: number;
  equipment: string[];
  isActive: boolean;
}