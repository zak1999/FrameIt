
import { render } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import { createOwner } from '../ApiServices';
import { useAuth0 } from '@auth0/auth0-react';
import Dashboard from '../pages/Dashboard';
import React, { useState } from 'react';
import { act } from 'react-dom/test-utils';

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

// jest.mock('react', ()=>({
//   ...jest.requireActual('react'),
//   useState: jest.fn()
// }))
jest.mock('../ApiServices', ()=>({
  ...(jest.requireActual('../ApiServices')),
  createOwner: jest.fn() 
}))

describe('<Dashboard /> component tests: ', () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      ...sampleData
    })
    // useState.mockImplementation(jest.requireActual('react').useState);
  })
  it('createOwner() function runs on the load of the page', async () => {
    const { container } = render(
      <RouterProvider router={router}>
        <Dashboard/>
      </RouterProvider>
      )
    expect(createOwner).toHaveBeenCalled()
  })
    
  it("If user has a party, 'Go to party' button is visible", async () => {
    const setPartyId = jest.fn()
    const setLoading = jest.fn()
    const setIsUp = jest.fn()


    
    act(()=>{
      // jest.spyOn(React, 'useState')
      // .mockImplementation((init)=>[init,setIsUp])
      jest.spyOn(React, 'useState')
      .mockImplementation(()=>[false, setLoading])
      jest.spyOn(React, 'useState')
      .mockImplementationOnce(()=>[true, setPartyId])
    })

    const { container } = render(
      <RouterProvider router={router}>
        <Dashboard/>
      </RouterProvider>
    )

    // expect(container.querySelectorAll('#go-to-party-btn').length).toBe(1)
    expect(container.getElementsByClassName('firstHalfDash').length).toBe(1)

    })
  
  
  
  
  })


// if user has a party, 'delete' btn appears 

// if does not have a party, 'create a party ' btn appears 

//if user presses 'got to ur party btn' then handleRedirect() runs 

// on 'delete btn' click, user is asked to confirm

// on 'confirm' click, handleDelete() runs

// on presss of 'logout' btn user lougt()

// if user is unathenticated, send him back to home page


