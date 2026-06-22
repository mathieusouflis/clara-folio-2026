'use client'

import { TextInput, useField } from '@payloadcms/ui'
import React, { useState } from 'react'

function SlugField({ path }: { path: string }) {
  const { value, setValue, showError } = useField<string>({ path })
  const [locked, setLocked] = useState(true)

  return (
    <TextInput
      label="Slug"
      path={path}
      value={value ?? ''}
      readOnly={locked}
      showError={showError}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      AfterInput={
        <button
          type="button"
          onClick={() => setLocked((l) => !l)}
          style={{
            background: 'none',
            border: 'none',
            padding: '0 0 0 8px',
            cursor: 'pointer',
            color: 'var(--theme-text)',
            textDecoration: 'underline',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            opacity: 0.7,
          }}
        >
          {locked ? 'Edit' : 'Lock'}
        </button>
      }
    />
  )
}

export default SlugField
export { SlugField }
