import React from 'react'

type shareButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  canShare: boolean;
  copied: boolean;
}

export default function ShareButton({canShare, copied, ...props} : shareButtonProps) : JSX.Element {
  
  return (
  <button 
    {...props}
    className="mainButton" id='share-btn'>
    {canShare ? (
      <span>SHARE</span>
    ) : !copied ? (
      <span>COPY 🔖</span>
    ) : (
      <span>COPIED ✅</span>
    )}
  </button>
  )
}
