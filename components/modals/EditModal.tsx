import React, { useState, useEffect } from 'react';
import { CustomNode, MachineNodeData, ResourceNodeData, RecipeItem } from '../../src/types';

interface EditModalProps {
  node: CustomNode;
  onClose: () => void;
  onSave: (data: MachineNodeData | ResourceNodeData) => void;
  suggestions: string[];
  onAddMachine?: () => void; // JAVÍTVA: Új, opcionális prop a funkció fogadására
}

const EditModal: React.FC<EditModalProps> = ({ node, onClose, onSave, suggestions, onAddMachine }) => {
  const [data, setData] = useState(node.data);

  useEffect(() => { setData(node.data); }, [node]);

  const handleSave = () => { onSave(data); onClose(); };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  const handleRecipeChange = (list: 'inputs' | 'outputs', index: number, field: 'name' | 'amount', value: string | number) => {
    const machineData = data as MachineNodeData; const newList = [...machineData[list]];
    const updatedValue = field === 'amount' ? parseFloat(value as string) || 0 : value;
    newList[index] = { ...newList[index], [field]: updatedValue }; setData(prev => ({ ...prev, [list]: newList }));
  };
  const addRecipeItem = (list: 'inputs' | 'outputs') => {
    const machineData = data as MachineNodeData; const newItem: RecipeItem = { id: `item_${Date.now()}_${Math.random()}`, name: 'New Item', amount: 1 };
    setData(prev => ({ ...prev, [list]: [...machineData[list], newItem] }));
  };
  const removeRecipeItem = (list: 'inputs' | 'outputs', index: number) => {
    const machineData = data as MachineNodeData; const newList = machineData[list].filter((_, i) => i !== index);
    setData(prev => ({ ...prev, [list]: newList }));
  };

  const renderMachineEditor = () => {
    const machineData = data as MachineNodeData;
    return (
        <div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="label">Machine Name</label>
                <input id="label" name="label" type="text" value={machineData.label || ''} onChange={handleInputChange} list="name-suggestions" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="power">Power (kW)</label>
                    <input id="power" name="power" type="number" value={machineData.power || 0} onChange={handleNumberInputChange} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="speed">Speed (ops/sec)</label>
                    <input id="speed" name="speed" type="number" step="0.1" value={machineData.speed || 0} onChange={handleNumberInputChange} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
            </div>
            <div className="mb-4">
                <h4 className="text-lg font-bold text-teal-400 mb-2">Inputs</h4>
                {machineData.inputs?.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 mb-2 items-center">
                        <input type="text" value={item.name} onChange={(e) => handleRecipeChange('inputs', index, 'name', e.target.value)} list="name-suggestions" className="col-span-7 p-2 bg-gray-900 border border-gray-600 rounded-md text-sm" />
                        <input type="number" value={item.amount} onChange={(e) => handleRecipeChange('inputs', index, 'amount', e.target.value)} className="col-span-3 p-2 bg-gray-900 border border-gray-600 rounded-md text-sm" />
                        <button onClick={() => removeRecipeItem('inputs', index)} className="col-span-2 bg-red-600 hover:bg-red-700 rounded-md p-2 text-sm">X</button>
                    </div>
                ))}
                <button onClick={() => addRecipeItem('inputs')} className="w-full bg-blue-600 hover:bg-blue-700 rounded-md p-2 text-sm mt-2">Add Input</button>
            </div>
            <div>
                <h4 className="text-lg font-bold text-teal-400 mb-2">Outputs</h4>
                {machineData.outputs?.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 mb-2 items-center">
                        <input type="text" value={item.name} onChange={(e) => handleRecipeChange('outputs', index, 'name', e.target.value)} list="name-suggestions" className="col-span-7 p-2 bg-gray-900 border border-gray-600 rounded-md text-sm" />
                        <input type="number" value={item.amount} onChange={(e) => handleRecipeChange('outputs', index, 'amount', e.target.value)} className="col-span-3 p-2 bg-gray-900 border border-gray-600 rounded-md text-sm" />
                        <button onClick={() => removeRecipeItem('outputs', index)} className="col-span-2 bg-red-600 hover:bg-red-700 rounded-md p-2 text-sm">X</button>
                    </div>
                ))}
                <button onClick={() => addRecipeItem('outputs')} className="w-full bg-blue-600 hover:bg-blue-700 rounded-md p-2 text-sm mt-2">Add Output</button>
            </div>
        </div>
    );
  };

  const renderResourceEditor = () => {
    const resourceData = data as ResourceNodeData;
    const isInputNode = resourceData.type === 'input';
    return (
        <div>
            <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="resource">Resource Name</label>
            <input id="resource" name="resource" type="text" value={resourceData.resource || ''} onChange={handleInputChange} list="name-suggestions" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
            {isInputNode && (
              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center space-x-2 text-gray-300">
                  <input type="checkbox" name="isStocked" checked={resourceData.isStocked || false} onChange={handleInputChange} className="form-checkbox h-5 w-5 text-teal-500 bg-gray-900 border-gray-600 rounded focus:ring-teal-500"/>
                  <span>Is Stocked</span>
                </label>
                <input id="color" name="color" type="color" value={resourceData.color || '#facc15'} onChange={handleInputChange} className="w-8 h-8 p-0 border-none rounded-md bg-transparent cursor-pointer"/>
              </div>
            )}
            <button
              onClick={() => {
                onAddMachine?.(); // JAVÍTVA: A prop-ként kapott funkciót hívjuk meg
                onClose();
              }}
              disabled={isInputNode && !!resourceData.isStocked}
              className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-md p-2 text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Machine to other side
            </button>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <datalist id="name-suggestions">
          {suggestions.map((name: string) => ( <option key={name} value={name} /> ))}
        </datalist>
        <div className="flex justify-between items-center border-b border-gray-600 pb-3 mb-4">
            <h3 className="text-2xl font-bold text-teal-300"> Edit Node: <span className="text-white ml-2">{node.type === 'machine' ? (data as MachineNodeData)?.label : (data as ResourceNodeData)?.resource}</span> </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
        </div>
        {data && ( <div className="overflow-y-auto pr-2"> {node.type === 'machine' ? renderMachineEditor() : renderResourceEditor()} </div> )}
        <div className="flex justify-end pt-4 border-t border-gray-600 mt-4">
            <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 rounded-md px-4 py-2 mr-2">Cancel</button>
            <button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700 rounded-md px-4 py-2">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;