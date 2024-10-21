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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useResetPasswordConfirmMutation } from '@/redux/features/authApiSlice';

const passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  );

const formSchema = z.object({
    newpassword: z.string()
        .min(8, {
            message: "Password must be at least 8 characters."
        })
        .regex(passwordValidation, {
            message: `Must contain at least 1 uppercase character, 
            1 lowercase character, 1 number, and 1 
            special character.`
    }),
    repassword: z.string()
        .min(8, {
            message: "Password must be at least 8 characters."
        })
    .regex(passwordValidation, {
        message: `Must contain at least 1 uppercase character, 
        1 lowercase character, 1 number, and 1 
        special character.`
    }),
}).superRefine(({ repassword, newpassword }, ctx) => {
    if (repassword !== newpassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ['repassword']
      });
    }
  });

export function PasswordResetConfirmForm(uid: string, token: string) {
    const router = useRouter();
	const [resetPasswordConfirm,] =
		useResetPasswordConfirmMutation();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          newpassword: "",
          repassword: ""
        },
      })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const newpassword = values.newpassword
        const repassword = values.repassword
        // destructure uid since its an obj with uid and token
        const uid_str = uid['uid']
        const token_str = uid['token']

      resetPasswordConfirm({ 
        uid:uid_str, 
        token:token_str, 
        new_password:newpassword, 
        re_new_password:repassword,
      })
        .unwrap()
        .then(() => {
          console.log(uid_str, token_str)
          toast.success('Password reset successful');
          router.replace('/sign-in')
        })
        .catch((error) => {
          if (error.data['token'] == "Invalid token for given user.") {
            toast.error('Expired reset link');
          }
          else {
            toast.error(JSON.stringify(error))
          }
        });
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="newpassword"
          render={({ field }) => (
            <FormItem className='form-item'>
              <FormLabel className='form-label'>New Password</FormLabel>
              <FormControl className='form-control'>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repassword"
          render={({ field }) => (
            <FormItem className='form-item'>
              <FormLabel className='form-label'>Re-Enter New Password</FormLabel>
              <FormControl className='form-control'>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button  className='form-btn' type="submit">Submit</Button>
        <FormMessage></FormMessage>
      </form>
    </Form>
  )
}
