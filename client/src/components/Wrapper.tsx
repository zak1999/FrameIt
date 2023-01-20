import { ReactNode } from 'react';
import Footer from './Footer';

type WrapperProps = {
  children: ReactNode;
};

export default function Wrapper({ children }: WrapperProps): JSX.Element {
  return (
    <div className="App">
      <div className="homeWrapper">
        <div className="bodyWrapper">
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
}
