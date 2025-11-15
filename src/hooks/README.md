# API Hooks Documentation

This folder contains custom React hooks for API interactions using React Query and React Hook Form.

## Structure

- `auth.hook.js` - Authentication-related hooks (sign up, sign in, forgot password, etc.)

## Usage Examples

### Sign Up

```jsx
import { useSignUp } from "@/hooks/auth.hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export default function SignUpPage() {
  const { form, mutate, isPending } = useSignUp();

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
```

### Sign In

```jsx
import { useSignIn } from "@/hooks/auth.hook";

export default function SignInPage() {
  const { form, mutate, isPending } = useSignIn();

  const onSubmit = (data) => {
    mutate(data);
  };

  // ... similar form structure
}
```

## Available Hooks

- `useSignUp()` - User registration
- `useSignIn()` - User login
- `useForgotPassword()` - Request password reset code
- `useVerifyCode()` - Verify password reset code
- `useResetPassword()` - Reset password with code
- `useGetUser()` - Get current authenticated user
- `useSignOut()` - Sign out user

## API Configuration

The API base URL is configured in `src/lib/api/axios.js`:
- Base URL: `https://resolvecars.softvencefsd.xyz/api/v1`
- Public endpoints use `axiosPublic`
- Private endpoints use `axiosPrivate` (automatically adds auth token)


