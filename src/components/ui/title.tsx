import { cn } from "@/lib/utils"
import React from "react"

export const Title = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("font-extrabold leading-none tracking-tight text-3xl", className)}
        {...props}
    />
))

Title.displayName = "Title";