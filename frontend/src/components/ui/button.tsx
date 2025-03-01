import { cn } from "@/lib/utils";

export function Button({ className, children, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <button
      className={cn(
        "px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-500 transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
