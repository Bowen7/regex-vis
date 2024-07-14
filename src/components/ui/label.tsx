import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/utils'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
// import React, { useId } from 'react'
// import * as LabelPrimitive from '@radix-ui/react-label'
// import { type VariantProps, cva } from 'class-variance-authority'

// import { cn } from '@/utils'

// const labelVariants = cva(
//   'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
// )

// const Label = React.forwardRef<
//   React.ElementRef<typeof LabelPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
//   VariantProps<typeof labelVariants> & { label: string }
// >(({ className, children, label, ...props }, ref) => {
//   const id = useId()
//   return (
//     <>
//       {() => children}
//       <LabelPrimitive.Root
//         ref={ref}
//         className={cn(labelVariants(), className)}
//         htmlFor={id}
//         {...props}
//       >
//         {label}
//       </LabelPrimitive.Root>
//     </>
//   )
// })
// Label.displayName = LabelPrimitive.Root.displayName

// export { Label }
