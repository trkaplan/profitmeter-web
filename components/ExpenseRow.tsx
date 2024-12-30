import React from 'react'
import { NumberInput } from './NumberInput'
import { Trash2 } from 'lucide-react'

interface ExpenseRowProps {
  name: string
  amount: number
  description: string
  onDelete?: () => void
  onUpdate: (field: 'name' | 'amount' | 'description', value: string | number) => void
  showDelete?: boolean
}

export const ExpenseRow: React.FC<ExpenseRowProps> = ({
  name,
  amount,
  description,
  onDelete,
  onUpdate,
  showDelete = true,
}) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-center">
      <div className="col-span-4">
        <input
          type="text"
          value={name}
          onChange={(e) => onUpdate('name', e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 text-sm"
          placeholder="Expense name"
        />
      </div>
      <div className="col-span-2">
        <NumberInput
          value={amount}
          onChange={(value) => onUpdate('amount', value)}
          className="w-full rounded-md border border-gray-300 p-2 text-sm"
          placeholder="Amount (€)"
        />
      </div>
      <div className="col-span-5">
        <input
          type="text"
          value={description}
          onChange={(e) => onUpdate('description', e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 text-sm"
          placeholder="Description"
        />
      </div>
      {showDelete && (
        <div className="col-span-1 flex justify-center">
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Delete expense"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
