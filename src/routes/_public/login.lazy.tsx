import { Link, createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_public/login')({
  component: LoginForm,
})

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAppDispatch } from '@/app/hooks'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useLoginMutation } from '@/services/user/userApiSlice'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { setAuth } from '@/features/auth/authSlice'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const signinSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
})

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const [loginApi, { isLoading }] = useLoginMutation();

  async function onSubmit(data: z.infer<typeof signinSchema>) {
    const { username, password } = data;
    try {
      const res = await loginApi({ username, password }).unwrap();
      console.log('login', res);
      toast.success('Login successful');
      dispatch(setAuth(
        { accessToken: res.token.access, refreshToken: res.token.refresh }
      ));
      navigate({ to: '/' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.data?.detail || error.error || 'Error: Something went wrong!'
      );
      console.log(error);
    }
  }

  return (
    <main className="min-h-screen w-full flex justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your username below to login to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className='grid gap-2'>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input type='text' autoComplete='username' placeholder="hammadtariq838" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className='grid gap-2'>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' autoComplete='current-password' placeholder="password" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className='grid gap-4'>
              <Button disabled={isLoading} className="w-full">Sign in</Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </main>
  )
}
