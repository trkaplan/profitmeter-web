export type Country = {
  code: string
  name: string
  holidays: number
  workingDays: number
}

export const countries: Country[] = [
  {
    code: 'FR',
    name: 'France',
    holidays: 11, // Public holidays
    workingDays: 250,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    holidays: 8, // Bank holidays
    workingDays: 251, // Average working days per year (excluding weekends and bank holidays)
  },
  {
    code: 'US',
    name: 'United States',
    holidays: 11, // Federal holidays
    workingDays: 250,
  },
  {
    code: 'TR',
    name: 'Turkey',
    holidays: 14.5, // National and religious holidays
    workingDays: 249,
  },
  {
    code: 'DE',
    name: 'Germany',
    holidays: 9, // National holidays
    workingDays: 252,
  },
]
