import { mergeClassNames } from "../../lib/utils";
import { Card } from "../ui/card";

export function MySection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={mergeClassNames("h-full w-full", className)}>
      {children}
    </Card>
  );
}
