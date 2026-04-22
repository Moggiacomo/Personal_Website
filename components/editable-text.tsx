import * as React from "react";

interface EditableTextProps {
  contentKey: string;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

export function EditableText({
  as: Component = "p",
  className,
  children,
}: EditableTextProps) {
  return (
    <Component className={className}>
      {children}
    </Component>
  );
}
