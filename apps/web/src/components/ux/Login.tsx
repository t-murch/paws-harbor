"use client";

import { LoginAction } from "@/app/login/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginFormSchema } from "@/components/ux/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { HTMLInputTypeAttribute, HTMLProps, ReactNode, useRef } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { MaskInputLogin } from "./MaskInput";
import { log } from "@repo/logger";
import { ReloadIcon } from "@radix-ui/react-icons";
import { mergeClassNames } from "@/lib/utils";

interface LoginProps extends HTMLProps<HTMLInputTypeAttribute> {
  loginAction: LoginAction;
}

export function Login({ loginAction, className }: LoginProps) {
  const [state, formAction] = useFormState(loginAction, { message: "" });
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(state?.fields ?? {}),
    },
  });
  const {
    formState: { isSubmitted, isSubmitting },
  } = form;

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card data-testid="Login" className="h-[23rem]">
      <CardHeader>
        <CardTitle className="flex w-full justify-center">
          Enter Credentials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form
            ref={formRef}
            action={formAction}
            onSubmit={(evt) => {
              evt.preventDefault();
              form.handleSubmit(() => {
                return new Promise((resolve) => {
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
                    <MaskInputLogin dataTestid="Password" field={field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end p-1 pt-20">
              <Button
                type="submit"
                data-testid="submitBtn"
                disabled={isSubmitting}
                className={mergeClassNames("flex w-20", {
                  "pr-3 justify-between": isSubmitting,
                })}
              >
                {isSubmitting && <ReloadIcon className="mr-1 animate-spin" />}
                Login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
