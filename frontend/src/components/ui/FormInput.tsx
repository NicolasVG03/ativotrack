import { useState, forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  padding: '12px 14px',
  fontSize: 14,
  color: '#f7f8fa',
  fontFamily: 'Inter,sans-serif',
  outline: 'none',
  transition: 'border-color .15s',
  marginBottom: 16,
  display: 'block',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  color: 'rgba(247,248,250,0.6)',
  marginBottom: 6,
  fontFamily: 'Inter,sans-serif',
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  { label, onFocus, onBlur, ...props },
  ref
) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        ref={ref}
        {...props}
        style={{
          ...inputStyle,
          borderColor: focused ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.12)',
        }}
        onFocus={e => { setFocused(true); onFocus?.(e) }}
        onBlur={e => { setFocused(false); onBlur?.(e) }}
      />
    </div>
  )
})

export const FormInputPassword = forwardRef<HTMLInputElement, Omit<FormInputProps, 'type'>>(
  function FormInputPassword({ label, onFocus, onBlur, ...props }, ref) {
    const [show, setShow] = useState(false)
    const [focused, setFocused] = useState(false)
    return (
      <div style={{ position: 'relative' }}>
        <label style={labelStyle}>{label}</label>
        <div style={{ position: 'relative' }}>
          <input
            ref={ref}
            {...props}
            type={show ? 'text' : 'password'}
            style={{
              ...inputStyle,
              paddingRight: 44,
              borderColor: focused ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.12)',
            }}
            onFocus={e => { setFocused(true); onFocus?.(e) }}
            onBlur={e => { setFocused(false); onBlur?.(e) }}
          />
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(247,248,250,0.35)',
              padding: 4,
              marginTop: -8,
            }}
            tabIndex={-1}
          >
            {show ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    )
  }
)
