"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useResetPasswordMutation } from "@/redux/features/authApiSlice"
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"



const formSchema = z.object({
  email: z.string().email({
    message: "Must be a valid email."
}).min(3, {
    message: "Email must be at least 2 characters.",
  }),
})

export function PasswordResetForm() {
    const router = useRouter()
    const [resetPassword] = useResetPasswordMutation();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
        },
      })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const email = values.email
        resetPassword(email)
        .unwrap()
        .then(() => {
            toast.success('Request sent, check your email for reset link');
            router.push('sign-in')
        })
        .catch(() => {
            toast.error('Failed to send request');
        });
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="form-item">
              <FormLabel className="form-label">Email</FormLabel>
              <FormControl className="form-control">
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription className="form-description">
                Enter the email associated with your account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="form-btn">Submit</Button>
      </form>
    </Form>
  )
}
