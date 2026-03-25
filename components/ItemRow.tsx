import React from "react";
import { Trash2 } from "lucide-react";

import { IInvoiceItem } from "@/models/Invoice";

interface ItemRowProps {
  index: number;
  item: IInvoiceItem;
  updateItem: (id: string, field: keyof IInvoiceItem, value: any) => void;
  removeItem: (id: string) => void;
}

export default function ItemRow({ index, item, updateItem, removeItem }: ItemRowProps) {
  return (
    <div className="grid grid-cols-12 gap-2 mb-2 items-center text-sm border-b pb-2 sm:border-0 sm:pb-0">
      <div className="col-span-1 text-center font-medium text-gray-900">{index + 1}</div>
      <div className="col-span-3">
        <input
          type="text"
          placeholder="Item Name"
          value={item.name}
          onChange={(e) => updateItem(item.id, "name", e.target.value)}
          className="w-full border rounded px-2 py-1 text-gray-900 bg-white placeholder-gray-400"
          required
        />
      </div>
      <div className="col-span-2">
        <input
          type="text"
          placeholder="HSN"
          value={item.hsn}
          onChange={(e) => updateItem(item.id, "hsn", e.target.value)}
          className="w-full border rounded px-2 py-1 text-gray-900 bg-white placeholder-gray-400"
        />
      </div>
      <div className="col-span-1">
        <input
          type="number"
          min="1"
          placeholder="Qty"
          value={item.qty}
          onChange={(e) => updateItem(item.id, "qty", Number(e.target.value))}
          className="w-full border rounded px-1 py-1 text-gray-900 bg-white placeholder-gray-400"
          required
        />
      </div>
      <div className="col-span-1">
        <select
          value={item.unit}
          onChange={(e) => updateItem(item.id, "unit", e.target.value)}
          className="w-full border rounded px-1 py-1 text-gray-900 bg-white"
        >
          <option value="PCS">PCS</option>
          <option value="SET">SET</option>
          <option value="NOS">NOS</option>
          <option value="BOX">BOX</option>
          <option value="PKT">PKT</option>
        </select>
      </div>
      <div className="col-span-2">
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Price"
          value={item.price}
          onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
          className="w-full border rounded px-2 py-1 text-gray-900 bg-white placeholder-gray-400"
          required
        />
      </div>
      <div className="col-span-1 text-right font-medium text-gray-700">
        ₹{item.total.toFixed(2)}
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
