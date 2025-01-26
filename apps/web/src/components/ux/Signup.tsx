"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HTMLInputTypeAttribute, HTMLProps, useRef } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignupAction } from "../../app/login/actions";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { signupFormSchema } from "./formSchema";
import { MaskInputSignup } from "./MaskSignupInput";

interface SignupProps extends HTMLProps<HTMLInputTypeAttribute> {
  signupAction: SignupAction;
}

export function Signup({ signupAction }: SignupProps) {
  const [state, formAction] = useFormState(signupAction, { message: "" });
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      confirm: "",
      email: "",
      password: "",
      ...(state?.fields ?? {}),
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card className="h-[23rem]">
      <CardHeader>
        <CardTitle className="flex w-full justify-center">Sign Up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form
            ref={formRef}
            action={formAction}
            onSubmit={(evt) => {
              evt.preventDefault();
              form.handleSubmit(() => {
                return new Promise(() => {
                  formAction(new FormData(formRef.current!));
                });
              })(evt);
            }}
            className="space-y-1"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="Email"
                      placeholder="email@domain.com"
                      {...field}
                    />
                  </FormControl>
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
                    <MaskInputSignup dataTestid="Password" field={field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Displat the confirm password field only if the password */}
            {/* field has no errors. */}
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <MaskInputSignup dataTestid="Confirm" field={field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end p-1 pt-2">
              <Button type="submit" data-testid="submitBtn" className="w-20">
                Signup
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
