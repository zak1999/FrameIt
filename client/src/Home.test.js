import { render, screen, waitFor, container } from '@testing-library/react';
import Home from './pages/Home';
import App from './App'
import { useAuth0 } from '@auth0/auth0-react';
import { createMemoryHistory } from '@remix-run/router';
import { BrowserRouter, Router } from 'react-router-dom';


// value returned for useAuth0 when logged-in
const mockUseAuth0LoggedIn = {
  isAuthenticated: true,
  isLoading: false,
  user: {email: 'bich@gmail.com'},
  logout: jest.fn(),
  loginWithRedirect: jest.fn()
};

// value returned for useAuth0 when logged-out
const mockUseAuth0LoggedOut = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  logout: jest.fn(),
  loginWithRedirect: jest.fn()
};
const user = {
  email: "johndoe@me.com",
  email_verified: true,
  sub: "google-oauth2|12345678901234",
};
jest.mock("@auth0/auth0-react")

describe('With successful login ', () => { 
  beforeEach(()=>{
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user,
      logout: jest.fn(),
      loginWithRedirect: jest.fn(),
      getAccessTokenWithPopup: jest.fn(),
      getAccessTokenSilently: jest.fn(),
      getIdTokenClaims: jest.fn(),
      loginWithPopup: jest.fn(),
      isLoading: false,
    });
  })

  test('on successful authentication, user is shown <dashboard/>', async () => {
    const { container } = render(
      <BrowserRouter> <Home/></BrowserRouter>);
    expect(container.getElementsByClassName('dashboardWrapper').length).toBe(1)
    // getByText('dashboardWrapper')
  });
  afterEach(() => jest.clearAllMocks())
})


//on successful authentication,user is redirected to /dashboard


//if authenticated, it should create user room with the correct user
// test('Should call the')
