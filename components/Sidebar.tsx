import React, { useState } from 'react';
import { MACHINE_DEFINITIONS, ICONS } from '../src/constants';
import { Summary } from '../src/types';

interface SidebarProps {
  addMachineNode: (type: string) => void;
  addResourceNode: (type: 'input' | 'output') => void;
  onSave: () => void;
  onLoad: () => void;
  summary: Summary;
}

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-b border-gray-700">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 text-left text-teal-300 hover:bg-gray-700 focus:outline-none">
        <span className="font-bold">{title}</span>
        {isOpen ? ICONS.CHEVRON_UP : ICONS.CHEVRON_DOWN}
      </button>
      {isOpen && <div className="p-3">{children}</div>}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ addMachineNode, addResourceNode, onSave, onLoad, summary }) => {
  const summaryEntries = Array.from(summary.balance.entries());
  const requiredInputs = summaryEntries.filter(([, amount]) => amount < 0);
  const netOutputs = summaryEntries.filter(([, amount]) => amount > 0);


  return (
    <div className="w-80 h-screen bg-gray-800 text-gray-200 flex flex-col shadow-2xl border-r border-gray-700">
      <div className="p-3 border-b border-gray-700">
        <h1 className="text-xl font-bold text-teal-400">Flowchart Controls</h1>
      </div>

      <div className="flex-grow overflow-y-auto">
        <CollapsibleSection title="File">
          <div className="flex space-x-2">
            <button onClick={onSave} className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 rounded-md p-2 space-x-2 transition-colors">
              {ICONS.SAVE} <span>Save</span>
            </button>
            <button onClick={onLoad} className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 rounded-md p-2 space-x-2 transition-colors">
              {ICONS.LOAD} <span>Load</span>
            </button>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Add Machines">
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(MACHINE_DEFINITIONS).map(type => (
              <button key={type} onClick={() => addMachineNode(type)} className="bg-gray-700 hover:bg-teal-800 rounded-md p-2 text-sm transition-colors text-center">
                {type}
              </button>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Add Resources">
          <div className="flex space-x-2">
            <button onClick={() => addResourceNode('input')} className="flex items-center justify-center w-full bg-yellow-600 hover:bg-yellow-700 rounded-md p-2 space-x-2 transition-colors">
              {ICONS.PLUS} <span>Input</span>
            </button>
            <button onClick={() => addResourceNode('output')} className="flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 rounded-md p-2 space-x-2 transition-colors">
              {ICONS.PLUS} <span>Output</span>
            </button>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Summary">
            <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded-md">
                    <span className="font-semibold text-yellow-400">Total Power:</span>
                    <span className="font-mono text-yellow-300">{summary.power.toFixed(2)} kW</span>
                </div>
                
                <div>
                    <h3 className="font-semibold pt-2 text-red-400">Required Inputs (/sec)</h3>
                    <div className="bg-gray-900/50 p-2 mt-1 rounded-md max-h-32 overflow-y-auto">
                        {requiredInputs.length > 0 ? requiredInputs.map(([name, amount]) => (
                            <div key={name} className="flex justify-between font-mono text-xs">
                                <span className="text-gray-300">{name}:</span>
                                <span className='text-red-400'>{Math.abs(amount).toFixed(2)}</span>
                            </div>
                        )) : <p className="text-gray-400 text-xs text-center">None</p>}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold pt-2 text-green-400">Net Outputs (/sec)</h3>
                    <div className="bg-gray-900/50 p-2 mt-1 rounded-md max-h-32 overflow-y-auto">
                        {netOutputs.length > 0 ? netOutputs.map(([name, amount]) => (
                            <div key={name} className="flex justify-between font-mono text-xs">
                            <span className="text-gray-300">{name}:</span>
                            <span className='text-green-400'>+{amount.toFixed(2)}</span>
                            </div>
                        )) : <p className="text-gray-400 text-xs text-center">None</p>}
                    </div>
                </div>
                 {summaryEntries.length === 0 && <p className="text-gray-400 text-xs text-center pt-2">No machines placed.</p>}
            </div>
        </CollapsibleSection>
      </div>

      <div className="p-2 text-xs text-center text-gray-500 border-t border-gray-700">
        v0.2.0
      </div>
    </div>
  );
};

export default Sidebar;