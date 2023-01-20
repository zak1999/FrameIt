import { ReactNode } from 'react';

type SloganWrapperProps = {
  children: ReactNode;
};

export default function SloganWrapper({
  children,
}: SloganWrapperProps): JSX.Element {
  return (
    <div className="slogan">
      <h1 className="removeDefaultStyling"> Frame It </h1>
      <h2 className="removeDefaultStyling"> Share It </h2>
      {children}
    </div>
  );
}
