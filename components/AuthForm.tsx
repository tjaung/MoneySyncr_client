"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import { Form } from "@/components/ui/form"
import React from 'react'
import { useState, ChangeEvent } from "react"
import LogoLink from './Common/LogoLink'
import FormInput from "./FormInput"
import { formSchema } from "@/lib/utils"
import { Loader2 } from 'lucide-react';
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRegisterMutation } from "@/redux/features/authApiSlice"
import { useAppDispatch } from '@/redux/hooks';
import { useLoginMutation } from '@/redux/features/authApiSlice';
import { setAuth } from '@/redux/features/authSlice';
import { toast } from "react-toastify"

const AuthForm = ({type}:{type: string}) => {
    const [register] = useRegisterMutation()
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const [login] = useLoginMutation();

    const formSchemaValidator = formSchema(type);
    // From shadcn docs:
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchemaValidator>>({
        resolver: zodResolver(formSchemaValidator),
        defaultValues: type === 'sign-up'
        ? {
            first_name: "",
            last_name: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            password: "",
            phone: "",
          }
        : {
            email: "",
            password: "",
          },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchemaValidator>) {
        setIsLoading(true);
        console.log(type)
        try {
          // Sign-up functionality
          if (type === "sign-up") {
            console.log('is Sign-up')
            
            // Construct the user data
            const userData = {
              first_name: values.first_name,
              last_name: values.last_name,
              address: values.address,
              city: values.city,
              state: values.state,
              postalCode: values.zipCode,
              email: values.email,
              phone: values.phone,
              password: values.password,
              re_password: values.repassword
            };
            console.log(userData)

            // register user
            register(userData)
              .unwrap()
              .then(() => {
                console.log('Goes to Then')
                toast.success('A verification email was sent to your email address')
                console.log('toast success, move to reroute')
                router.push('sign-in')
              })
              .catch((error) => {
                console.error(error)
                toast.error(JSON.stringify(error.data))
              })
          } else if(type==='sign-in'){

          // else sign-in
          // Log the form values to the console for both sign-in and sign-up
          console.log("Form values:", values);
          const signInData = {email: values.email,
            password: values.password
          }
          console.log(signInData)
          // sign in user
          login(signInData)
            .unwrap()
            .then(() => {
                dispatch(setAuth());
                toast.success('Logged in');
                router.push('/');
            })
            .catch(() => {
                toast.error('Failed to log in');
            });
          }
        } catch (error) {
          console.error("Error during form submission:", error);
        } finally {
          setIsLoading(false);
        }
      }

  return (
    <section className='auth-form py-4'>
        <header className='flex flex-col gap-2 md:gap-5'>
            <LogoLink />
            <div className='flex flex-col gap-1 md:gap-3'>
                <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                    {user
                        ? 'Link Account'
                        : type === 'sign-in'
                            ? 'Sign In'
                            : 'Sign Up'
                    }
                    <p className='text-16 font-normal text-gray-600'>
                        {user
                            ? 'Link your account to get started'
                            : 'Please enter your information to get started'
                        }
                    </p>
                </h1>
            </div>
        </header>
        {/* {user ? ( */}
            <div className='flex flex-col gap-4'>
                {/* <PlaidLink
                  user={user}
                  variant='primary'
                  /> */}
            </div>
        {/* ) : ( */}
        <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {type === 'sign-up' && (
                <>
                <div className="flex gap-4">
                    <FormInput
                        control={form.control}
                        name="first_name"
                        label={"*First Name"}
                        placeholder="John"
                    />
                    <FormInput
                        control={form.control}
                        name="last_name"
                        label={"*Last Name"}
                        placeholder="Hancock"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-4">
                    <FormInput
                        control={form.control}
                        name="address"
                        label={"Address"}
                        placeholder="1 Main St"
                    />
                    <FormInput
                        control={form.control}
                        name="city"
                        label={"City"}
                        placeholder="New York"
                    />
                    <div className="md:col-span-2 flex gap-4">
                    <FormInput
                        control={form.control}
                        name="state"
                        label={"State/Region"}
                        placeholder="MA"
                    />
                    <FormInput
                        control={form.control}
                        name="zipCode"
                        label={"Zip Code"}
                        placeholder="01010"
                    />
                    </div>
                </div>
                <div className="flex gap-4">
                <FormInput
                    control={form.control}
                    name="phone"
                    label={"Phone Number"}
                    placeholder="1112223333"
                    />
                </div>
                </>
            )}
                <div className="flex flex-col gap-3">
                <FormInput
                    control={form.control}
                    name="email"
                    label={"*Email"}
                    placeholder="jaungt@gmail.com"
                    />
                    <FormInput
                        control={form.control}
                        name="password"
                        label={"*Password"}
                        placeholder="Password!111"
                        />
                      <FormInput
                        control={form.control}
                        name="repassword"
                        label={"*Confirm Password"}
                        placeholder="Password@111"
                        />
                </div>
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === 'sign-in' 
                    ? 'Sign In' : 'Sign Up'}
                </Button>
            </form>
        </Form>

        <footer className="flex flex-col justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === 'sign-in'
              ? "Don't have an account?"
              : "Already have an account?"}
            </p>
            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link">
              {type === 'sign-in' ? 'Sign up' : 'Sign in'}
            </Link>
              {type === 'sign-in' && (
                <p className="text-14 font-normal text-gray-600">
                <Link href='/password-reset' className="form-link">
                Forgot Password
              </Link>
              </p>
              )}
          </footer>
        </>
                
        
    </section>

  )
}

export default AuthForm