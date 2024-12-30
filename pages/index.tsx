import React, { useState } from 'react'
import { Clock, DollarSign, Users, Building2, RotateCcw } from 'lucide-react'

type Schedule = {
  start_time: string
  end_time: string
  session_duration: number
  break_duration: number
}

type Pricing = {
  standard: number
  discounted: number
}

type FormData = {
  operating_schedule: {
    weekday: Schedule
    weekend: Schedule
  }
  pricing: {
    weekday: Pricing
    weekend: Pricing
  }
  capacity: {
    max_capacity: number
    weekday_percentage: number
    weekend_percentage: number
  }
}

const CalculatorForm = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState<FormData>({
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

  const defaultOperatingSchedule = {
    start_time: '10:00',
    end_time: '22:00',
    session_duration: 45,
    break_duration: 15,
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

  const calculateSessionsPerDay = (
    startTime: string,
    endTime: string,
    sessionDuration: number,
    breakDuration: number
  ) => {
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)

    const totalMinutes = (endHour - startHour) * 60 + (endMinute - startMinute)
    const sessionTotalDuration = sessionDuration + breakDuration

    return Math.floor(totalMinutes / sessionTotalDuration)
  }

  const weekdaySessions = calculateSessionsPerDay(
    formData.operating_schedule.weekday.start_time,
    formData.operating_schedule.weekday.end_time,
    formData.operating_schedule.weekday.session_duration,
    formData.operating_schedule.weekday.break_duration
  )

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
                <div className="flex space-x-8">
                  {/* Operating Hours */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Operating Hours</label>
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
                    <label className="block text-sm font-medium">Session Details</label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="block text-sm">Duration (min)</label>
                        <input
                          type="number"
                          value={formData.operating_schedule.weekday.session_duration}
                          onChange={(e) =>
                            handleChange(
                              'operating_schedule',
                              'weekday',
                              'session_duration',
                              parseInt(e.target.value)
                            )
                          }
                          className="mt-1 w-20 rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm">Break (min)</label>
                        <input
                          type="number"
                          value={formData.operating_schedule.weekday.break_duration}
                          onChange={(e) =>
                            handleChange(
                              'operating_schedule',
                              'weekday',
                              'break_duration',
                              parseInt(e.target.value)
                            )
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
                    <button
                      onClick={handleReset}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset to Initials</span>
                    </button>
                  )}
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
                      onChange={(e) =>
                        handleChange('pricing', 'weekday', 'standard', parseInt(e.target.value))
                      }
                      className="rounded-md border border-gray-300 p-2"
                    />
                    <input
                      type="number"
                      value={formData.pricing.weekend.standard}
                      onChange={(e) =>
                        handleChange('pricing', 'weekend', 'standard', parseInt(e.target.value))
                      }
                      className="rounded-md border border-gray-300 p-2"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center">Discounted</div>
                    <input
                      type="number"
                      value={formData.pricing.weekday.discounted}
                      onChange={(e) =>
                        handleChange('pricing', 'weekday', 'discounted', parseInt(e.target.value))
                      }
                      className="rounded-md border border-gray-300 p-2"
                    />
                    <input
                      type="number"
                      value={formData.pricing.weekend.discounted}
                      onChange={(e) =>
                        handleChange('pricing', 'weekend', 'discounted', parseInt(e.target.value))
                      }
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
                  onChange={(e) => handleCapacityChange('max_capacity', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Weekday Capacity %</label>
                  <input
                    type="number"
                    value={formData.capacity.weekday_percentage}
                    onChange={(e) =>
                      handleCapacityChange('weekday_percentage', parseInt(e.target.value))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Weekend Capacity %</label>
                  <input
                    type="number"
                    value={formData.capacity.weekend_percentage}
                    onChange={(e) =>
                      handleCapacityChange('weekend_percentage', parseInt(e.target.value))
                    }
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
