import React from "react";
import { Trash2 } from "lucide-react";
import { IPOItem } from "@/models/PurchaseOrder";

interface PORowProps {
  index: number;
  item: IPOItem;
  updateItem: (id: string, field: keyof IPOItem, value: any) => void;
  removeItem: (id: string) => void;
}

export default function PORow({ index, item, updateItem, removeItem }: PORowProps) {
  return (
    <div className="grid grid-cols-12 gap-2 mb-2 items-center text-xs border-b pb-2 sm:border-0 sm:pb-0 bg-white p-2 rounded sm:p-0">
      <div className="col-span-1 text-center font-medium text-gray-900">{index + 1}</div>
      <div className="col-span-2">
        <input
          type="text"
          placeholder="Item Code"
          value={item.itemCode}
          onChange={(e) => updateItem(item.id, "itemCode", e.target.value)}
          className="w-full border-2 border-gray-200 rounded px-2 py-2 text-gray-900 font-bold focus:border-indigo-500 outline-none placeholder:text-gray-500"
          required
        />
      </div>
      <div className="col-span-3">
        <input
          type="text"
          placeholder="Item Name"
          value={item.itemName}
          onChange={(e) => updateItem(item.id, "itemName", e.target.value)}
          className="w-full border-2 border-gray-200 rounded px-2 py-2 text-gray-900 font-bold mb-1 focus:border-indigo-500 outline-none"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={item.itemDescription}
          onChange={(e) => updateItem(item.id, "itemDescription", e.target.value)}
          className="w-full border-2 border-gray-100 rounded px-2 py-1 text-gray-600 text-[10px] focus:border-indigo-300 outline-none"
        />
      </div>
      <div className="col-span-1">
        <input
          type="number"
          min="1"
          placeholder="Qty"
          value={item.qty}
          onChange={(e) => updateItem(item.id, "qty", Number(e.target.value) || 0)}
          className="w-full border-2 border-gray-200 rounded px-1 py-2 text-gray-900 font-bold text-center focus:border-indigo-500 outline-none"
          required
        />
      </div>
      <div className="col-span-1">
        <input
          type="text"
          placeholder="UOM"
          value={item.uom}
          onChange={(e) => updateItem(item.id, "uom", e.target.value)}
          className="w-full border-2 border-gray-200 rounded px-1 py-2 text-gray-900 font-bold text-center focus:border-indigo-500 outline-none"
          required
        />
      </div>
      <div className="col-span-1">
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Rate"
          value={item.basicRate}
          onChange={(e) => updateItem(item.id, "basicRate", Number(e.target.value) || 0)}
          className="w-full border-2 border-gray-200 rounded px-1 py-2 text-gray-900 font-black text-center focus:border-indigo-500 outline-none"
          required
        />
      </div>
      <div className="col-span-1">
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          placeholder="Dis%"
          value={item.discountPercent}
          onChange={(e) => updateItem(item.id, "discountPercent", Number(e.target.value) || 0)}
          className="w-full border-2 border-gray-200 rounded px-1 py-2 text-gray-900 font-bold text-center focus:border-indigo-500 outline-none"
        />
      </div>
      <div className="col-span-1">
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          placeholder="GST%"
          value={item.igstPercent}
          onChange={(e) => updateItem(item.id, "igstPercent", Number(e.target.value) || 0)}
          className="w-full border-2 border-gray-200 rounded px-1 py-2 text-gray-900 font-bold text-center focus:border-indigo-500 outline-none"
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
