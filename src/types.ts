import type { Node, Edge } from 'reactflow';

export interface RecipeItem {
  id?: string; // Optional for new items
  name: string;
  amount: number; // Amount per operation
}

export interface MachineNodeData {
  label: string;
  inputs: RecipeItem[];
  outputs: RecipeItem[];
  power: number; // Power in kW
  speed: number; // Operations per second
}

export interface ResourceNodeData {
  type: 'input' | 'output';
  resource: string;
}

export type CustomNode = Node<MachineNodeData | ResourceNodeData>;

export interface Summary {
  power: number;
  balance: Map<string, number>;
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