"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useNewsletter } from "@/hooks/newsletter.hook";

export const NewsletterSubscribe = () => {
  const { form, mutate, isPending } = useNewsletter();

  const onSubmit = (values) => {
    mutate(values);
  };

  return (
    <div className="bg-[#fdf5f5] py-16 px-6 sm:px-12 lg:px-24 rounded-lg flex flex-col lg:flex-row items-center justify-between gap-6">
      {/* Left Text */}
      <div className="max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Stay Updated with Our Latest Offers
        </h2>
        <p className="text-gray-600">
          Join now and don't let any promotions slip through your fingers.
        </p>
      </div>
      <div>
        {/* Right Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-wrap gap-5 w-full max-w-xl"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full max-w-xl">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your name..."
                        className="flex-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your e-mail address..."
                        className="flex-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white"
                disabled={isPending}
              >
                {isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>

            <div className="flex items-start gap-2 mt-2 sm:mt-0 sm:flex-1 justify-start">
              <FormField
                control={form.control}
                name="consent_given"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        id="consent"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Label
                        htmlFor="consent"
                        className="text-xs text-gray-500 flex-1 max-w-lg cursor-pointer"
                      >
                        Yes, I give my consent to receive information and
                        personalized offers from View.{" "}
                        <span className="text-gray-700">
                          <Link href="/privacy" className="underline truncate">
                            Privacy Policy
                          </Link>
                        </span>
                      </Label>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
