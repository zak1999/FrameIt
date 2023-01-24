import React, { ReactNode } from 'react';
import Navbar from './Navbar';

type DashboardWrapperProps = {
  children: ReactNode;
}


export default function DashboardWrapper({ children }: DashboardWrapperProps): JSX.Element {
  return (
    <div className="App">
      <div className="dashboardWrapper">
      <Navbar />
      {children}
      </div>
    </div>
  )
}
