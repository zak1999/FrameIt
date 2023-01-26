import { MagnifyingGlass } from 'react-loader-spinner';
import { ReactNode } from 'react';

export default function Loading(): JSX.Element {
  return (
    <div className="loaderWrap">
      <MagnifyingGlass
        visible={true}
        height="90"
        width="90"
        ariaLabel="MagnifyingGlass-loading"
        wrapperClass="MagnifyingGlass-wrapper"
        glassColor="#ecbef7"
        color="#8139d1"
      />
    </div>
  );
}
