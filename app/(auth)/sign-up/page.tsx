'use client'

import React from 'react'
import { useState } from 'react'
import AuthForm from '@/components/AuthForm'
import { Setup } from '@/lib/actions'

const SignUp = () => {
  
  return (
    <section className='flex-center size-full max-sm:px-6'>
      <AuthForm
        type="sign-up"
      />  
  </section>
  )
}

export default SignUp