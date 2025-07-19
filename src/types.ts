import type { Node, Edge } from 'reactflow';

export interface RecipeItem {
  id: string; 
  name: string;
  amount: number; // Amount per operation
}

export interface MachineNodeData {
  label: string;
  power: number;
  speed: number;
  inputs: RecipeItem[];
  outputs: RecipeItem[];
}

export interface ResourceNodeData {
  type: 'input' | 'output';
  resource: string;
  isStocked?: boolean;
  color?: string;
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