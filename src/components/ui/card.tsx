
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm", // bg-card will now be primary, text-card-foreground will be primary-foreground
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement, // Corrected from HTMLParagraphElement to HTMLDivElement as per original, though h tags are common.
  React.HTMLAttributes<HTMLDivElement> // Corrected from HTMLHeadingElement to HTMLDivElement for consistency.
>(({ className, ...props }, ref) => (
  <div // Using div as per original, though h1-h6 would be more semantic for a title.
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight", // Inherits color from Card
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement, // Corrected from HTMLParagraphElement
  React.HTMLAttributes<HTMLDivElement> // Corrected from HTMLParagraphElement
>(({ className, ...props }, ref) => (
  <div // Using div as per original
    ref={ref}
    className={cn("text-sm opacity-75", className)} // Inherits color, applies opacity
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

