import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { formSchema } from '@/lib/utils'

const formSchemaValidator = formSchema('sign-up')

interface CustomInput {
  control: Control<z.infer<typeof formSchemaValidator>>,
  name: FieldPath<z.infer<typeof formSchemaValidator>>,
  label: string,
  placeholder: string
}


const FormInput = ({ control, name, label, placeholder }: CustomInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">
            {label}
          </FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input 
                placeholder={placeholder}
                className="input-class"
                type={name === 'password' ? 'password' : 'text'}
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2 max-h-max" />
          </div>
        </div>
      )}
    />
  )
}

export default FormInput