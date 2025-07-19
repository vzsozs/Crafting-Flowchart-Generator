import React from 'react';
import { Summary, SummaryItem } from '../src/types';

interface SidebarProps {
  addMachineNode: () => void;
  onSave: () => void;
  onLoad: () => void;
  summary: Summary;
  summaryItems: SummaryItem[];
  calculationTarget: string;
  setCalculationTarget: (target: string) => void;
  calculationAmount: number;
  setCalculationAmount: (amount: number) => void;
  handleCalculate: () => void;
  calculationResult: { name: string, amount: number }[] | null;
  producibleItems: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  addMachineNode, onSave, onLoad, summary, summaryItems,
  calculationTarget, setCalculationTarget, calculationAmount, setCalculationAmount, handleCalculate, calculationResult, producibleItems
}) => {
  return (
    <aside className="w-72 bg-gray-900 p-4 flex flex-col shadow-lg">
      <h1 className="text-2xl font-bold text-teal-300 mb-6">Crafting Flowchart</h1>
      <button onClick={addMachineNode} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors mb-4">
        Add Machine
      </button>
      
      <div className="mb-4 border-y border-gray-700 py-4">
        <h2 className="text-lg font-semibold text-gray-300 mb-2">Requirement Calculator</h2>
        <div className="space-y-2 text-sm">

          {/* JAVÍTVA: A két input mezőt egy flex konténerbe tettük */}
          <div className="flex items-end space-x-2">
            
            {/* Target Item (szélesebb rész) */}
            <div className="flex-grow">
              <label htmlFor="target-item" className="block mb-1 text-gray-400">Target Item</label>
              <select 
                id="target-item"
                value={calculationTarget}
                onChange={(e) => setCalculationTarget(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md"
              >
                <option value="" disabled>Select...</option>
                {producibleItems.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Amount (keskenyebb rész) */}
            <div className="w-20">
              <label htmlFor="target-amount" className="block mb-1 text-gray-400">Amount</label>
              <input 
                id="target-amount"
                type="number" 
                value={calculationAmount}
                min="1"
                onChange={(e) => setCalculationAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md"
              />
            </div>
          </div>
          
          <button 
            onClick={handleCalculate} 
            disabled={!calculationTarget}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate
          </button>
          {calculationResult && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <h3 className="font-bold text-gray-300">Required Raw Materials:</h3>
              {calculationResult.length > 0 ? (
                <ul className="list-disc list-inside text-gray-400">
                  {calculationResult.map(item => <li key={item.name}>{item.amount.toFixed(2)} {item.name}</li>)}
                </ul>
              ) : <p className="text-xs text-gray-500">Target is a raw material or calculation is not possible.</p>}
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pr-2">
        <h2 className="text-lg font-semibold text-gray-300 mb-2 sticky top-0 bg-gray-900 py-1">Production Summary</h2>
        {summaryItems.length > 0 ? (
          <div className="text-xs text-gray-300">
            <div className="grid grid-cols-12 gap-2 font-bold uppercase text-gray-500 pb-2 border-b border-gray-700 sticky top-8 bg-gray-900">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Input</div>
              <div className="col-span-2 text-center">Output</div>
              <div className="col-span-2 text-center">Net</div>
            </div>
            <div className="mt-2 space-y-2">
              {summaryItems.map(item => {
                const net = item.totalOutput - item.totalInput;
                const netColor = net > 0 ? 'text-green-400' : net < 0 ? 'text-red-400' : 'text-gray-400';
                return (
                  <div key={item.name} className="grid grid-cols-12 gap-2 items-center py-1 border-b border-dotted border-gray-700">
                    <div className="col-span-6 font-medium truncate" title={item.name}>{item.name}</div>
                    <div className="col-span-2 text-center text-red-400">{item.totalInput.toFixed(1)}</div>
                    <div className="col-span-2 text-center text-green-400">{item.totalOutput.toFixed(1)}</div>
                    <div className={`col-span-2 text-center font-bold ${netColor}`}>{net > 0 ? '+' : ''}{net.toFixed(1)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No production data yet.</p>
        )}
      </div>

      <div className="mt-4 border-t border-gray-700 pt-4">
        <h2 className="text-lg font-semibold text-gray-300 mb-2">Flowchart Actions</h2>
        <div className="space-y-2">
          <button onClick={onSave} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md transition-colors">Save</button>
          <button onClick={onLoad} className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors">Load</button>
        </div>
      </div>
      
      <div className="mt-4 border-t border-gray-700 pt-4 text-xs text-gray-400">
        <h3 className="font-bold mb-1">Overall Summary</h3>
        <p>Power: {summary.power.toFixed(2)} kW</p>
        <p>Nodes: {summary.nodeCount || 0}</p>
        <p>Edges: {summary.edgeCount || 0}</p>
      </div>
    </aside>
  );
};

export default Sidebar;