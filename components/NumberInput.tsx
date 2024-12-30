import React from 'react'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
  placeholder?: string
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max,
  className = '',
  placeholder,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? min : parseInt(e.target.value, 10)
    
    if (isNaN(newValue)) {
      onChange(min)
      return
    }

    if (min !== undefined && newValue < min) {
      onChange(min)
      return
    }

    if (max !== undefined && newValue > max) {
      onChange(max)
      return
    }

    onChange(newValue)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text')
    const parsedValue = parseInt(pastedText, 10)

    if (isNaN(parsedValue) || (min !== undefined && parsedValue < min) || (max !== undefined && parsedValue > max)) {
      e.preventDefault()
    }
  }

  return (
    <input
      type="number"
      value={value}
      onChange={handleChange}
      onPaste={handlePaste}
      min={min}
      max={max}
      className={className}
      placeholder={placeholder}
    />
  )
}
