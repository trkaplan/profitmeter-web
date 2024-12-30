import React, { useState } from 'react'
import { Clock, DollarSign, Users, Building2, RotateCcw, Globe, Plus } from 'lucide-react'
import { NumberInput } from '../components/NumberInput'
import { ExpenseRow } from '../components/ExpenseRow'
import { countries, type Country } from '../data/holidays'
import { initialExpenses, type ExpenseCategory, type Expense } from '../data/expenses'

type Schedule = {
  start_time: string
  end_time: string
  session_duration: number
  break_duration: number
}

type Pricing = {
  standard: number
  discounted: number
  standard_distribution: number
  discounted_distribution: number
}

type Capacity = {
  max_capacity: number
  weekday_percentage: number
  weekend_percentage: number
}

type FormData = {
  operating_schedule: {
    weekday: Schedule
  }
  pricing: {
    weekday: Pricing
    weekend: Pricing
  }
  capacity: Capacity
  expenses: ExpenseCategory[]
}

const CalculatorForm = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((c) => c.code === 'FR') || countries[0]
  )
  const [formData, setFormData] = useState<FormData>({
    operating_schedule: {
      weekday: {
        start_time: '10:00',
        end_time: '22:00',
        session_duration: 120,
        break_duration: 30,
      },
    },
    pricing: {
      weekday: {
        standard: 12,
        discounted: 8,
        standard_distribution: 70,
        discounted_distribution: 30,
      },
      weekend: {
        standard: 15,
        discounted: 10,
        standard_distribution: 70,
        discounted_distribution: 30,
      },
    },
    capacity: {
      max_capacity: 200,
      weekday_percentage: 70,
      weekend_percentage: 85,
    },
    expenses: initialExpenses,
  })

  const defaultOperatingSchedule = {
    start_time: '10:00',
    end_time: '22:00',
    session_duration: 120,
    break_duration: 30,
  }

  const isScheduleModified = () => {
    const currentSchedule = formData.operating_schedule.weekday
    return (
      currentSchedule.start_time !== defaultOperatingSchedule.start_time ||
      currentSchedule.end_time !== defaultOperatingSchedule.end_time ||
      currentSchedule.session_duration !== defaultOperatingSchedule.session_duration ||
      currentSchedule.break_duration !== defaultOperatingSchedule.break_duration
    )
  }

  const handleReset = () => {
    setFormData((prev) => ({
      ...prev,
      operating_schedule: {
        weekday: defaultOperatingSchedule,
      },
    }))
  }

  const handleChange = <
    T extends keyof FormData,
    U extends keyof FormData[T],
    V extends keyof FormData[T][U],
  >(
    section: T,
    subsection: U,
    field: V,
    value: FormData[T][U][V]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value,
        },
      },
    }))
  }

  const handleCapacityChange = (field: keyof FormData['capacity'], value: number) => {
    setFormData((prev) => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        [field]: value,
      },
    }))
  }

  const handleExpenseUpdate = (
    categoryId: string,
    expenseId: string,
    field: 'name' | 'amount' | 'description',
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              expenses: category.expenses.map((expense) =>
                expense.id === expenseId
                  ? {
                      ...expense,
                      [field]: value,
                    }
                  : expense
              ),
              totalAmount:
                field === 'amount'
                  ? category.expenses
                      .map((e) => (e.id === expenseId ? (value as number) : e.amount))
                      .reduce((a, b) => a + b, 0)
                  : category.totalAmount,
            }
          : category
      ),
    }))
  }

  const handleAddExpense = (categoryId: string) => {
    const newExpense: Expense = {
      id: `${categoryId}-${Date.now()}`,
      name: '',
      amount: 0,
      description: '',
    }

    setFormData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              expenses: [...category.expenses, newExpense],
            }
          : category
      ),
    }))
  }

  const handleDeleteExpense = (categoryId: string, expenseId: string) => {
    setFormData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              expenses: category.expenses.filter((expense) => expense.id !== expenseId),
              totalAmount: category.expenses
                .filter((expense) => expense.id !== expenseId)
                .reduce((a, b) => a + b.amount, 0),
            }
          : category
      ),
    }))
  }

  const calculateWeekdaySessions = () => {
    const startTime = new Date(`2024-01-01T${formData.operating_schedule.weekday.start_time}:00`)
    const endTime = new Date(`2024-01-01T${formData.operating_schedule.weekday.end_time}:00`)
    const totalMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60) // Convert to minutes
    const sessionLength =
      formData.operating_schedule.weekday.session_duration +
      formData.operating_schedule.weekday.break_duration
    return Math.floor(totalMinutes / sessionLength)
  }

  const calculateMonthlyRevenue = () => {
    const weekdaySessions = calculateWeekdaySessions()
    const weekendSessions = weekdaySessions // Assuming same schedule for weekends

    // Calculate average working days per month (excluding holidays)
    const workingDaysPerMonth = selectedCountry.workingDays / 12
    const weekdaysPerMonth = Math.round(workingDaysPerMonth) // Weekdays excluding holidays
    const weekendsPerMonth = Math.round(30.44 - workingDaysPerMonth) // Average days in month minus working days

    // Calculate weekday revenue
    const weekdayCapacity = Math.floor(
      (formData.capacity.max_capacity * formData.capacity.weekday_percentage) / 100
    )
    const weekdayStandardRevenue =
      weekdaySessions * weekdaysPerMonth * weekdayCapacity * formData.pricing.weekday.standard * (formData.pricing.weekday.standard_distribution / 100) // 70% standard tickets
    const weekdayDiscountedRevenue =
      weekdaySessions *
      weekdaysPerMonth *
      weekdayCapacity *
      formData.pricing.weekday.discounted *
      (formData.pricing.weekday.discounted_distribution / 100) // 30% discounted tickets

    // Calculate weekend revenue
    const weekendCapacity = Math.floor(
      (formData.capacity.max_capacity * formData.capacity.weekend_percentage) / 100
    )
    const weekendStandardRevenue =
      weekendSessions * weekendsPerMonth * weekendCapacity * formData.pricing.weekend.standard * (formData.pricing.weekend.standard_distribution / 100) // 70% standard tickets
    const weekendDiscountedRevenue =
      weekendSessions *
      weekendsPerMonth *
      weekendCapacity *
      formData.pricing.weekend.discounted *
      (formData.pricing.weekend.discounted_distribution / 100) // 30% discounted tickets

    const monthlyRevenue =
      weekdayStandardRevenue +
      weekdayDiscountedRevenue +
      weekendStandardRevenue +
      weekendDiscountedRevenue
    return Math.round(monthlyRevenue)
  }

  const calculateMonthlyExpenses = () => {
    // Fixed monthly expenses (example values)
    const rentAndUtilities = 50000
    const staffing = 15000
    const maintenance = 5833 // 70k per year
    const totalExpenses = formData.expenses.reduce((a, b) => a + b.totalAmount, 0)
    return rentAndUtilities + staffing + maintenance + totalExpenses
  }

  const calculateResults = () => {
    const monthlyRevenue = calculateMonthlyRevenue()
    const monthlyExpenses = calculateMonthlyExpenses()
    const monthlyProfit = monthlyRevenue - monthlyExpenses

    return {
      monthly: {
        revenue: monthlyRevenue,
        expenses: monthlyExpenses,
        profit: monthlyProfit,
      },
      yearly: {
        revenue: monthlyRevenue * 12,
        expenses: monthlyExpenses * 12,
        profit: monthlyProfit * 12,
      },
    }
  }

  const formatCurrency = (amount: number) => {
    return `£${amount.toLocaleString()}`
  }

  const weekdaySessions = calculateWeekdaySessions()
  const results = calculateResults()

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Ice Skating Rink Calculator</h1>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 space-y-6">
          {/* Operating Schedule */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-6 h-6" />
                <h2 className="text-xl font-semibold">Yearly Session Parameters</h2>
              </div>
            </div>

            <div className="flex space-x-8">
              {/* Weekday Schedule */}
              <div>
                <div className="flex space-x-8">
                  {/* Operating Hours */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium">
                      <b>Operating Hours</b>
                    </label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="block text-sm">Opening Time</label>
                        <input
                          type="time"
                          value={formData.operating_schedule.weekday.start_time}
                          onChange={(e) =>
                            handleChange(
                              'operating_schedule',
                              'weekday',
                              'start_time',
                              e.target.value
                            )
                          }
                          className="mt-1 w-24 rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm">Closing Time</label>
                        <input
                          type="time"
                          value={formData.operating_schedule.weekday.end_time}
                          onChange={(e) =>
                            handleChange(
                              'operating_schedule',
                              'weekday',
                              'end_time',
                              e.target.value
                            )
                          }
                          className="mt-1 w-24 rounded-md border border-gray-300 p-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium">
                      <b>Session Details</b>
                    </label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="block text-sm">Duration (min)</label>
                        <NumberInput
                          value={formData.operating_schedule.weekday.session_duration}
                          onChange={(value) =>
                            handleChange('operating_schedule', 'weekday', 'session_duration', value)
                          }
                          className="mt-1 w-20 rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm">Break (min)</label>
                        <NumberInput
                          value={formData.operating_schedule.weekday.break_duration}
                          onChange={(value) =>
                            handleChange('operating_schedule', 'weekday', 'break_duration', value)
                          }
                          className="mt-1 w-20 rounded-md border border-gray-300 p-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Approximately <b>{weekdaySessions}</b> sessions per day
                  </div>
                  {isScheduleModified() && (
                    <div>
                      <button
                        onClick={handleReset}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset to Initials</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <label className="block text-sm font-medium">Country</label>
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const country = countries.find((c) => c.code === e.target.value)
                      if (country) setSelectedCountry(country)
                    }}
                    className="rounded-md border border-gray-300 p-2 text-sm"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.holidays} holidays)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="text-sm text-gray-600">
                    <b>{selectedCountry.workingDays}</b> working days per year
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="text-sm text-gray-600">
                    <b>
                      {weekdaySessions} * {selectedCountry.workingDays} ={' '}
                      {weekdaySessions * selectedCountry.workingDays}
                    </b>{' '}
                    sessions per year
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Pricing</h2>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="font-medium">Type</div>
                  <div className="font-medium">Weekday (£)</div>
                  <div className="font-medium">Weekend (£)</div>
                  <div className="font-medium">Distribution (%)</div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex items-center">Standard</div>
                    <NumberInput
                      value={formData.pricing.weekday.standard}
                      onChange={(value) => handleChange('pricing', 'weekday', 'standard', value)}
                      className="rounded-md border border-gray-300 p-2"
                    />
                    <NumberInput
                      value={formData.pricing.weekend.standard}
                      onChange={(value) => handleChange('pricing', 'weekend', 'standard', value)}
                      className="rounded-md border border-gray-300 p-2"
                    />
                    <NumberInput
                      value={formData.pricing.weekday.standard_distribution}
                      onChange={(value) => handleChange('pricing', 'weekday', 'standard_distribution', value)}
                      className="rounded-md border border-gray-300 p-2"
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex items-center">Discounted</div>
                    <NumberInput
                      value={formData.pricing.weekday.discounted}
                      onChange={(value) => handleChange('pricing', 'weekday', 'discounted', value)}
                      className="rounded-md border border-gray-300 p-2"
                    />
                    <NumberInput
                      value={formData.pricing.weekend.discounted}
                      onChange={(value) => handleChange('pricing', 'weekend', 'discounted', value)}
                      className="rounded-md border border-gray-300 p-2"
                    />
                    <NumberInput
                      value={formData.pricing.weekday.discounted_distribution}
                      onChange={(value) => handleChange('pricing', 'weekday', 'discounted_distribution', value)}
                      className="rounded-md border border-gray-300 p-2"
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Capacity</h2>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium">Maximum Capacity</label>
                <NumberInput
                  value={formData.capacity.max_capacity}
                  onChange={(value) => handleCapacityChange('max_capacity', value)}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Weekday Capacity %</label>
                <NumberInput
                  value={formData.capacity.weekday_percentage}
                  onChange={(value) => handleCapacityChange('weekday_percentage', value)}
                  max={100}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Weekend Capacity %</label>
                <NumberInput
                  value={formData.capacity.weekend_percentage}
                  onChange={(value) => handleCapacityChange('weekend_percentage', value)}
                  max={100}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Building2 className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Expenses</h2>
            </div>

            <div className="space-y-8">
              {formData.expenses.map((category) => (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      {category.name} (£{category.totalAmount.toLocaleString()})
                    </h3>
                    <button
                      onClick={() => handleAddExpense(category.id)}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Add Expense</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {category.expenses.map((expense) => (
                      <ExpenseRow
                        key={expense.id}
                        name={expense.name}
                        amount={expense.amount}
                        description={expense.description}
                        onUpdate={(field, value) =>
                          handleExpenseUpdate(category.id, expense.id, field, value)
                        }
                        onDelete={() => handleDeleteExpense(category.id, expense.id)}
                        showDelete={category.expenses.length > 1}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Results</h2>
            </div>

            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setActiveTab('monthly')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  activeTab === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setActiveTab('yearly')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  activeTab === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                Yearly
              </button>
            </div>

            <div className="space-y-4">
              {activeTab === 'monthly' ? (
                <>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Revenue</span>
                    <span className="font-semibold">{formatCurrency(results.monthly.revenue)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Expenses</span>
                    <span className="font-semibold">
                      {formatCurrency(results.monthly.expenses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Profit</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(results.monthly.profit)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Revenue</span>
                    <span className="font-semibold">{formatCurrency(results.yearly.revenue)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Expenses</span>
                    <span className="font-semibold">{formatCurrency(results.yearly.expenses)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Profit</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(results.yearly.profit)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalculatorForm
