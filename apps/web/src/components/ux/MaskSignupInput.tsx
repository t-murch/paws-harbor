import { EyeIcon, EyeOffIcon } from "lucide-react";
import { HTMLInputTypeAttribute, HTMLProps, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { mergeClassNames } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PasswordInputKeys } from "./MaskInput";

type SignupFields = { email: string; password: string; confirm: string };
type SignupInputProps = {
  dataTestid?: string;
  field: ControllerRenderProps<SignupFields, PasswordInputKeys>;
} & HTMLProps<HTMLInputTypeAttribute>;

export function MaskInputSignup({
  field,
  className,
  dataTestid,
}: SignupInputProps) {
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
