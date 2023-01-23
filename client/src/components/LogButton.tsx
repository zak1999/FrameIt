import React, { ReactNode } from 'react'

type LogButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
}


// className

export default function LogButton({children, ...props} : LogButtonProps) : JSX.Element {
  return (
    <button
      {...props}
      className={ `${props.className || ''} logButton` } 
      >
      {children}
    </button>
  )
}
