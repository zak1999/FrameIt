import { render, screen, waitFor, container, rerender,cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAuth0 } from '@auth0/auth0-react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import Home from '../pages/Home';


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

describe('Unauthenticated user', ()=>{
  beforeEach(() => {
    useAuth0.mockReturnValue({//default
      isAuthenticated: false,
      ...sampleData
    })
  })
  it('If user is unauthenticated from auth0, user remains on <Home />.', async () => {
    const { container } = render(
      <RouterProvider router={router}>
        <Home/>
      </RouterProvider>
      );
    expect(container.getElementsByClassName('logButton').length).toBe(1)
  });
  it('When user clicks log in button, auth0 useloginWithPopup function is invoked.', async () => {
  const { container } = render(
    <RouterProvider router={router}>
      <Home/>
    </RouterProvider>
    );
    const { loginWithPopup } = useAuth0();
    const logInBtn = container.getElementsByClassName('logButton')[0]
    userEvent.click(logInBtn);
    expect(loginWithPopup).toHaveBeenCalled()
  });
})