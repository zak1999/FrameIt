import { ReactNode } from 'react';

type SloganWrapperProps = {
  children: ReactNode;
  className: string;
};

export default function SloganWrapper({
  children,
  className,
}: SloganWrapperProps): JSX.Element {
  return (
    <div className={className}>
      <h1 className="removeDefaultStyling"> Frame It </h1>
      <h2 className="removeDefaultStyling"> Share It </h2>
      {children}
    </div>
  );
}
