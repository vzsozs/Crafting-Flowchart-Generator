// components/Sidebar.tsx

import React from 'react';
import { Summary, SummaryItem } from '../src/types';

interface SidebarProps {
  addMachineNode: () => void;
  onSave: () => void;
  onLoad: () => void;
  summary: Summary;
  summaryItems: SummaryItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ addMachineNode, onSave, onLoad, summary, summaryItems }) => {
  return (
    <aside className="w-72 bg-gray-900 p-4 flex flex-col shadow-lg">
      <h1 className="text-2xl font-bold text-teal-300 mb-6">Crafting Flowchart</h1>

      <button
        onClick={addMachineNode}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors mb-6"
      >
        Add Machine
      </button>

      {/* JAVÍTVA: A táblázat új stílusokkal */}
      <div className="flex-grow overflow-y-auto pr-2">
        <h2 className="text-lg font-semibold text-gray-300 mb-2 sticky top-0 bg-gray-900 py-1">Production Summary</h2>
        {summaryItems.length > 0 ? (
          <div className="text-xs text-gray-300">
            {/* Fejléc */}
            <div className="grid grid-cols-12 gap-2 font-bold uppercase text-gray-500 pb-2 border-b border-gray-700 sticky top-8 bg-gray-900">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Input</div>
              <div className="col-span-2 text-center">Output</div>
              <div className="col-span-2 text-center">Net</div>
            </div>
            {/* Adatsorok */}
            <div className="mt-2 space-y-2">
              {summaryItems.map(item => {
                const net = item.totalOutput - item.totalInput;
                const netColor = net > 0 ? 'text-green-400' : net < 0 ? 'text-red-400' : 'text-gray-400';
                
                return (
                  <div key={item.name} className="grid grid-cols-12 gap-2 items-center py-1 border-b border-dotted border-gray-700">
                    <div className="col-span-6 font-medium truncate" title={item.name}>
                      {item.name}
                    </div>
                    <div className="col-span-2 text-center text-red-400">
                      {item.totalInput.toFixed(1)}
                    </div>
                    <div className="col-span-2 text-center text-green-400">
                      {item.totalOutput.toFixed(1)}
                    </div>
                    <div className={`col-span-2 text-center font-bold ${netColor}`}>
                      {net > 0 ? '+' : ''}{net.toFixed(1)}
                    </div>
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