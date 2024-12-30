import React, { useState } from 'react'
import { Clock, DollarSign, Users, Building2 } from 'lucide-react'

const CalculatorForm = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState({
    operating_schedule: {
      weekday: {
        start_time: '10:00',
        end_time: '22:00',
        session_duration: 45,
        break_duration: 15,
      },
      weekend: {
        start_time: '10:00',
        end_time: '22:00',
        session_duration: 45,
        break_duration: 15,
      },
    },
    pricing: {
      weekday: {
        standard: 13,
        discounted: 11,
      },
      weekend: {
        standard: 15,
        discounted: 13,
      },
    },
    capacity: {
      max_capacity: 80,
      weekday_percentage: 85,
      weekend_percentage: 50,
    },
  })

  const [activeTab, setActiveTab] = useState('monthly')

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Ice Skating Rink Calculator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Operating Schedule */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Operating Schedule</h2>
            </div>
            <div className="space-y-4">
              {/* Weekday Schedule */}
              <div>
                <label className="block text-sm font-medium">Weekdays</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-sm">Open</label>
                    <input
                      type="time"
                      value={formData.operating_schedule.weekday.start_time}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Close</label>
                    <input
                      type="time"
                      value={formData.operating_schedule.weekday.end_time}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                </div>
              </div>

              {/* Session Duration */}
              <div>
                <label className="block text-sm font-medium">Session Details</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-sm">Duration (min)</label>
                    <input
                      type="number"
                      value={formData.operating_schedule.weekday.session_duration}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Break (min)</label>
                    <input
                      type="number"
                      value={formData.operating_schedule.weekday.break_duration}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
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
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="font-medium">Type</div>
                  <div className="font-medium">Weekday (£)</div>
                  <div className="font-medium">Weekend (£)</div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center">Standard</div>
                    <input
                      type="number"
                      value={formData.pricing.weekday.standard}
                      className="rounded-md border border-gray-300 p-2"
                    />
                    <input
                      type="number"
                      value={formData.pricing.weekend.standard}
                      className="rounded-md border border-gray-300 p-2"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center">Discounted</div>
                    <input
                      type="number"
                      value={formData.pricing.weekday.discounted}
                      className="rounded-md border border-gray-300 p-2"
                    />
                    <input
                      type="number"
                      value={formData.pricing.weekend.discounted}
                      className="rounded-md border border-gray-300 p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Capacity</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Maximum Capacity</label>
                <input
                  type="number"
                  value={formData.capacity.max_capacity}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Weekday Capacity %</label>
                  <input
                    type="number"
                    value={formData.capacity.weekday_percentage}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Weekend Capacity %</label>
                  <input
                    type="number"
                    value={formData.capacity.weekend_percentage}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
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
                    <span className="font-semibold">£271,547</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Expenses</span>
                    <span className="font-semibold">£70,833</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Profit</span>
                    <span className="font-semibold text-green-600">£200,714</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Revenue</span>
                    <span className="font-semibold">£3,258,566</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Expenses</span>
                    <span className="font-semibold">£850,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Profit</span>
                    <span className="font-semibold text-green-600">£2,408,566</span>
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
