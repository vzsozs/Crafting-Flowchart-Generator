import { MachineNodeData } from './types';

export const ICONS = {
  PLUS: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>,
  SAVE: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" /></svg>,
  LOAD: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a5.5 5.5 0 00-5.5 5.5V13a3 3 0 003 3h5a3 3 0 003-3V7.5A5.5 5.5 0 0010 2zm3 11a1 1 0 11-2 0v-2.586l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L13 10.414V13z" /></svg>,
  CHEVRON_UP: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>,
  CHEVRON_DOWN: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
};

export const MACHINE_DEFINITIONS: Record<string, Omit<MachineNodeData, 'id'>> = {
  'Crusher': {
    label: 'Crusher',
    power: 5,
    speed: 1,
    inputs: [{ id: 'in_clump', name: 'Clumps', amount: 1 }],
    outputs: [{ id: 'out_dirty_dust', name: 'Dirty Dust', amount: 1 }],
  },
  'Purification Chamber': {
    label: 'Purification Chamber',
    power: 10,
    speed: 1,
    inputs: [
      { id: 'in_clump', name: 'Clumps', amount: 1 },
      { id: 'in_oxygen', name: 'Oxygen', amount: 10 },
    ],
    outputs: [{ id: 'out_shard', name: 'Shards', amount: 1 }],
  },
  'Enrichment Chamber': {
    label: 'Enrichment Chamber',
    power: 8,
    speed: 1,
    inputs: [{ id: 'in_dirty_dust', name: 'Dirty Dust', amount: 1 }],
    outputs: [{ id: 'out_dust', name: 'Dust', amount: 1 }],
  },
  'Energized Smelter': {
    label: 'Energized Smelter',
    power: 20,
    speed: 2,
    inputs: [{ id: 'in_dust', name: 'Dust', amount: 1 }],
    outputs: [{ id: 'out_ingot', name: 'Ingots', amount: 1 }],
  },
  'Electrolytic Separator': {
    label: 'Electrolytic Separator',
    power: 40,
    speed: 1,
    inputs: [
        { id: 'in_water', name: 'Water', amount: 1 },
    ],
    outputs: [
      { id: 'out_hydrogen', name: 'Hydrogen', amount: 2 },
      { id: 'out_oxygen', name: 'Oxygen', amount: 1 },
    ],
  },
  'Chemical Infuser': {
      label: 'Chemical Infuser',
      power: 25,
      speed: 1,
      inputs: [
        {id: 'in_gas_1', name: 'Gas Input 1', amount: 1},
        {id: 'in_gas_2', name: 'Gas Input 2', amount: 1},
      ],
      outputs: [
        {id: 'out_gas', name: 'Gas Output', amount: 1}
      ]
  }
};