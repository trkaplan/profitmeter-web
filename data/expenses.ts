export type Expense = {
  id: string
  name: string
  amount: number
  description: string
}

export type ExpenseCategory = {
  id: string
  name: string
  totalAmount: number
  expenses: Expense[]
}

export const initialExpenses: ExpenseCategory[] = [
  {
    id: 'staff',
    name: 'Staff',
    totalAmount: 400000,
    expenses: [
      {
        id: 'staff-1',
        name: 'Supervisors',
        amount: 100000,
        description: 'Rink supervisors and management staff',
      },
      {
        id: 'staff-2',
        name: 'Ticket Office',
        amount: 100000,
        description: 'Ticket office and customer service staff',
      },
      {
        id: 'staff-3',
        name: 'Maintenance',
        amount: 100000,
        description: 'Maintenance and cleaning staff',
      },
      {
        id: 'staff-4',
        name: 'Security',
        amount: 100000,
        description: 'Security personnel',
      },
    ],
  },
  {
    id: 'utilities',
    name: 'Utilities',
    totalAmount: 180000,
    expenses: [
      {
        id: 'utilities-1',
        name: 'Electricity for Refrigeration',
        amount: 80000,
        description: 'Power consumption for ice rink cooling system',
      },
      {
        id: 'utilities-2',
        name: 'Lighting',
        amount: 40000,
        description: 'Facility lighting costs',
      },
      {
        id: 'utilities-3',
        name: 'Heating',
        amount: 40000,
        description: 'Building heating expenses',
      },
      {
        id: 'utilities-4',
        name: 'Water',
        amount: 20000,
        description: 'Water consumption and sewage',
      },
    ],
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    totalAmount: 120000,
    expenses: [
      {
        id: 'maintenance-1',
        name: 'Ice Resurfacing',
        amount: 40000,
        description: 'Ice maintenance and resurfacing equipment',
      },
      {
        id: 'maintenance-2',
        name: 'Equipment Repairs',
        amount: 40000,
        description: 'Regular equipment maintenance and repairs',
      },
      {
        id: 'maintenance-3',
        name: 'General Maintenance',
        amount: 40000,
        description: 'Building and facility maintenance',
      },
    ],
  },
  {
    id: 'insurance',
    name: 'Insurance and Licenses',
    totalAmount: 60000,
    expenses: [
      {
        id: 'insurance-1',
        name: 'Insurance',
        amount: 40000,
        description: 'Liability and property insurance',
      },
      {
        id: 'insurance-2',
        name: 'Licenses',
        amount: 20000,
        description: 'Operating licenses and permits',
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    totalAmount: 40000,
    expenses: [
      {
        id: 'marketing-1',
        name: 'Advertising',
        amount: 25000,
        description: 'Digital and traditional advertising',
      },
      {
        id: 'marketing-2',
        name: 'Promotions',
        amount: 15000,
        description: 'Special events and promotional activities',
      },
    ],
  },
  {
    id: 'miscellaneous',
    name: 'Miscellaneous',
    totalAmount: 50000,
    expenses: [
      {
        id: 'misc-1',
        name: 'Office Supplies',
        amount: 20000,
        description: 'General office supplies and equipment',
      },
      {
        id: 'misc-2',
        name: 'Contingency',
        amount: 30000,
        description: 'Emergency and unexpected expenses',
      },
    ],
  },
]
