import { render, screen, waitFor, container, rerender,cleanup } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import Home from '../pages/Home';

//this object represents 
const sampleData = {
  user:{
    email: "wag1@google.com",
    email_verified: true,
    sub: "google-oauth2|12345678901234",
  },
  logout: jest.fn(),
  loginWithRedirect: jest.fn(),
  getAccessTokenWithPopup: jest.fn(),
  getAccessTokenSilently: jest.fn(),
  getIdTokenClaims: jest.fn(),
  loginWithPopup: jest.fn(),
  isLoading: false,
}

jest.mock("@auth0/auth0-react")
  describe('Authenticated user', () => {
    beforeEach(() => {
      useAuth0.mockReturnValue({
        isAuthenticated: true,
        ...sampleData})
      })
    test('On successful authentication from auth0, <Dashboard /> is rendered', async () => {
      const { container } = render(
        <RouterProvider router={router}>
          <Home/>
        </RouterProvider>);
        expect(container.getElementsByClassName('dashboardWrapper').length).toBe(1)
    }); 
    afterEach(()=>useAuth0.mockClear()) 
  })

