import { render } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import Home from '../pages/Home';
import { sampleData } from './sampleData';

jest.mock("@auth0/auth0-react")
  describe('<Home /> component tests for authenticated user', () => {
    beforeEach(() => {
      useAuth0.mockReturnValue({
        isAuthenticated: true,
        ...sampleData
      })
    })
    it('On successful authentication from auth0, <Dashboard /> is rendered', async () => {
      const { container } = render(
        <RouterProvider router={router}>
          <Home/>
        </RouterProvider>);
        expect(container.getElementsByClassName('dashboardWrapper').length).toBe(1)
    }); 
    afterEach(()=>useAuth0.mockClear()) 
  })
