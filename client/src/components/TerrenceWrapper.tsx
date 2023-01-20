// An important JSX Element which has uses that impact the app significantly
import { ReactNode } from 'react';

type TerrenceWrapperProps = {
  children: ReactNode;
};

export default function TerrenceWrapper({
  children,
}: TerrenceWrapperProps): JSX.Element {
  return <div className="terrence">{children}</div>;
}
