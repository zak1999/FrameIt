import { render, screen, waitFor, container, rerender,cleanup } from '@testing-library/react';
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

//this makes useAuth0 ==jest.fn()
jest.mock("@auth0/auth0-react",() => {
  return { useAuth0: jest.fn((bool)=> (bool ? {
    isAuthenticated:true,
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
  :
  {
    isAuthenticated:false,
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
  }) ) }
})

// describe('<Home /> Component tests', () => {
  // beforeEach(() => {
  //   useAuth0.mockReturnValue({//default
  //     isAuthenticated: true,
  //     ...sampleData
  //   }).mockReturnValueOnce({
  //     isAuthenticated: true,
  //   }).mockReturnValueOnce({
  //     isAuthenticated: false,
  //     ...sampleData
  //   })
  // });
  describe('Authenticated user', () => {
    beforeEach(() => {
      useAuth0.mockReturnValue({//default
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

  // describe('Unauthenticated user', ()=>{
  //   beforeEach(() => {
  //     useAuth0.mockReturnValue({//default
  //       isAuthenticated: false,
  //       ...sampleData})
  //     })
  //     console.log(useAuth0)
  //   test('If user is unauthenticated from auth0, user remains on <Home />', async () => {
  //     const { container } = render(
  //       <RouterProvider router={router}>
  //         <Home/>
  //       </RouterProvider>);
  //     console.log("hew",container.getElementsByClassName('dashboardWrapper').length)
  //     expect(container.getElementsByClassName('logButton').length).toBe(1)
  //   });
  // })


// if unauthenticated, user should remain on the home page
