import type { Node, Edge } from 'reactflow';

export interface RecipeItem {
  id: string; 
  name: string;
  amount: number; // Amount per operation
}

export interface MachineNodeData {
  label: string;
  inputs: RecipeItem[];
  outputs: RecipeItem[];
  power: number; // Power in kW
  speed: number; // Operations per second
  onEdit?: () => void; 
}

export interface ResourceNodeData {
  type: 'input' | 'output';
  resource: string;
  isStocked?: boolean; // JAVÍTVA: Új, opcionális tulajdonság
  color?: string;
  onEdit?: () => void; // JAVÍTVA: Hozzáadjuk a szerkesztés funkciót
  onAddMachine?: () => void; // JAVÍTVA: Hozzáadjuk az új gép hozzáadása funkciót
}

export type CustomNode = Node<MachineNodeData | ResourceNodeData>;

export interface Summary {
  power: number;
  balance: Map<string, number>;
  nodeCount: number;
  edgeCount: number;
}

export interface SaveFile {
    nodes: Node[];
    edges: Edge[];
    viewport: {
        x: number;
        y: number;
        zoom: number;
    };
}

export interface SummaryItem {
  name: string;
  totalInput: number;
  totalOutput: number;
}