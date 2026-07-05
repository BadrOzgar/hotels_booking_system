"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * Standard right-side slide-over for every admin "Add X" / "Edit X" form.
 * The caller owns the open/close state (and renders its own trigger button)
 * — this just wraps the shared Sheet primitive with consistent sizing.
 */
export function CrudDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  widthClassName = "sm:max-w-lg",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  widthClassName?: string;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={cn("w-full overflow-y-auto", widthClassName)}>
        <SheetHeader className="border-b border-[#F0F1F4] px-6 py-5">
          <SheetTitle className="text-[19px] font-bold tracking-[-.02em]">{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-[13.5px] font-medium text-[#6B7280]">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
        <div className="px-6 pb-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
