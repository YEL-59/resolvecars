"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  CheckCircle,
  UserCheck,
  X,
} from "lucide-react";
import { useSignIn, useSignUp } from "@/hooks/auth.hook";

// Component that uses useSearchParams
const SignInPageContent = () => {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  // Initialize hooks for login and registration
  const {
    form: signInForm,
    mutate: signInMutate,
    isPending: isSignInPending,
  } = useSignIn();
  
  const {
    form: signUpForm,
    mutate: signUpMutate,
    isPending: isSignUpPending,
  } = useSignUp();

  // Handle tab from URL query parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "login" || tab === "register") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/herobg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl backdrop-blur-sm bg-white/95 rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Brand + Car + Features */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Image
                src="/assets/logo.png"
                alt="Resolvecars"
                width={160}
                height={48}
                className="h-10 w-auto"
              />
            </div>

            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
              <Image
                src="/assets/signin.png"
                alt="Showcase car"
                width={800}
                height={450}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 py-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  Secure & Safe
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 py-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  Verified Rentals
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 py-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                  <UserCheck className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  Personal Service
                </span>
              </div>
            </div>
          </div>

          {/* Right: Auth Card */}
          <div>
            <Card className="bg-white/95 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-bold text-foreground">
                      Log in to Resolvecars
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Access your account or create a new one
                    </CardDescription>
                  </div>
                  <Link
                    href="/"
                    aria-label="Close"
                    className="p-1 rounded hover:bg-muted"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" className="text-sm font-medium">
                      Log in
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="text-sm font-medium"
                    >
                      Register
                    </TabsTrigger>
                  </TabsList>

                  {/* Log in Tab */}
                  <TabsContent value="login" className="space-y-4">
                    <Form {...signInForm}>
                      <form
                        onSubmit={signInForm.handleSubmit((data) =>
                          signInMutate(data)
                        )}
                        className="space-y-4"
                      >
                        <FormField
                          control={signInForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Email
                              </FormLabel>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-10"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signInForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Password
                              </FormLabel>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                                <FormControl>
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="pl-10 pr-10"
                                    {...field}
                                  />
                                </FormControl>
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center justify-between text-sm">
                          <FormField
                            control={signInForm.control}
                            name="remember_me"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="text-muted-foreground font-normal cursor-pointer">
                                  Remember me
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          <Link
                            href="/auth/forgot-password"
                            className="text-primary hover:underline"
                          >
                            Forgotten your password?
                          </Link>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSignInPending}
                        >
                          {isSignInPending ? "Logging in..." : "Log in"}
                        </Button>
                      </form>
                    </Form>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Google
                      </Button>
                      <Button variant="outline" className="w-full">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Register Tab */}
                  <TabsContent value="register" className="space-y-4">
                    <Form {...signUpForm}>
                      <form
                        onSubmit={signUpForm.handleSubmit((data) =>
                          signUpMutate(data)
                        )}
                        className="space-y-4 max-h-[500px] overflow-y-auto pr-2"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <FormField
                            control={signUpForm.control}
                            name="first_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">
                                  First Name
                                </FormLabel>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                                  <FormControl>
                                    <Input
                                      type="text"
                                      placeholder="First name"
                                      className="pl-10"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={signUpForm.control}
                            name="last_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">
                                  Last Name
                                </FormLabel>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                                  <FormControl>
                                    <Input
                                      type="text"
                                      placeholder="Last name"
                                      className="pl-10"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={signUpForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Email
                              </FormLabel>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-10"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Password
                              </FormLabel>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                                <FormControl>
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    className="pl-10 pr-10"
                                    {...field}
                                  />
                                </FormControl>
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="password_confirmation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Confirm Password
                              </FormLabel>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                                <FormControl>
                                  <Input
                                    type={
                                      showConfirmPassword ? "text" : "password"
                                    }
                                    placeholder="Confirm your password"
                                    className="pl-10 pr-10"
                                    {...field}
                                  />
                                </FormControl>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="terms"
                            className="mt-1"
                            required
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm text-muted-foreground leading-5"
                          >
                            I agree to the{" "}
                            <Link
                              href="/terms"
                              className="text-primary hover:underline"
                            >
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="/privacy"
                              className="text-primary hover:underline"
                            >
                              Privacy Policy
                            </Link>
                          </label>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSignUpPending}
                        >
                          {isSignUpPending
                            ? "Creating account..."
                            : "Create Account"}
                        </Button>
                      </form>
                    </Form>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Google
                      </Button>
                      <Button variant="outline" className="w-full">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main page component with Suspense boundary
const SignInPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SignInPageContent />
    </Suspense>
  );
};

export default SignInPage;
