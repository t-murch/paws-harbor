import { EyeIcon, EyeOffIcon } from "lucide-react";
import { HTMLInputTypeAttribute, HTMLProps, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { mergeClassNames } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type LoginFields = { email: string; password: string };
const passwordInputKeys = ["email", "password", "confirm"] as const;
export type PasswordInputKeys = (typeof passwordInputKeys)[number];

// interface LoginInputProps extends HTMLProps<HTMLInputTypeAttribute> {
//   "data-testid": string;
//   field: ControllerRenderProps<
//     LoginFields,
//     Exclude<PasswordInputKeys, "confirm">
//   >;
// }

type LoginInputProps = {
  dataTestid?: string;
  field: ControllerRenderProps<
    LoginFields,
    Exclude<PasswordInputKeys, "confirm">
  >;
} & HTMLProps<HTMLInputTypeAttribute>;

export function MaskInputLogin({
  field,
  className,
  dataTestid,
}: LoginInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={mergeClassNames("hide-password-toggle pr-10", className)}
        data-testid={dataTestid ?? "Password"}
        placeholder="********"
        // ref={ref}
        {...field}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  );
}
