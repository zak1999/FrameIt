import { render } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import { createOwner } from '../ApiServices';
import { useAuth0 } from '@auth0/auth0-react';
import Dashboard from '../pages/Dashboard';
import React from 'react';
import DashButtons from '../components/DashButtons';
import userEvent from '@testing-library/user-event';
import LogButton from '../components/LogButton';
import { sampleData } from './sampleData';

const handleRedirect = jest.fn(); 
const setAskConfirm = jest.fn();
const handleDelete = jest.fn();
const confirm = jest.fn();
const askConfirm = true;
const logout = jest.fn();

jest.mock("@auth0/auth0-react")
jest.mock('../ApiServices', ()=>({
  ...(jest.requireActual('../ApiServices')),
  createOwner: jest.fn() 
}))
describe('<Dashboard /> page component tests: ', () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      ...sampleData
    })
  })

  it('createOwner() function runs on the load of the page', async () => {
    render(
      <RouterProvider router={router}>
        <Dashboard/>
      </RouterProvider>
      )
    expect(createOwner).toHaveBeenCalled()
  })

  it("Clicking 'GO TO UR PARTY' button invokes handleRedirect()", async () => {
    const {container} = render(
    <DashButtons handleRedirect={handleRedirect} setAskConfirm={setAskConfirm}
      handleDelete={handleDelete} confirm={confirm} askConfirm={askConfirm} />
    )
    const goToPartyButton = container.querySelector('#go-to-ur-party-btn')
    await userEvent.click(goToPartyButton)
    expect(handleRedirect).toHaveBeenCalled()
  })

  it("Clicking 'DELETE CURRENT PARTY' button invokes confirm()", async () => {  
    const {container} = render(
    <DashButtons handleRedirect={handleRedirect} setAskConfirm={setAskConfirm}
      handleDelete={handleDelete} confirm={confirm} askConfirm={askConfirm} />
    )
    const deleteButton = container.querySelector('#delete-btn')
    await userEvent.click(deleteButton)
    expect(confirm).toHaveBeenCalled()
  })
  
  it("Clicking 'DELETE CURRENT PARTY' button invokes confirm()", async () => {  
    const {container} = render(
    <DashButtons handleRedirect={handleRedirect} setAskConfirm={setAskConfirm}
      handleDelete={handleDelete} confirm={confirm} askConfirm={askConfirm} />
    )
    const deleteButton = container.querySelector('#delete-btn')
    await userEvent.click(deleteButton)
    expect(confirm).toHaveBeenCalled()
  })
  
  it("Clicking 'LOGOUT' button invokes logout()", async () => {  
    const {container} = render(<LogButton id="logout-btn" onClick={logout}/>)
    const logoutButton = container.querySelector('#logout-btn')
    await userEvent.click(logoutButton)
    expect(logout).toHaveBeenCalled()
  })

  it("Clicking 'YES' button when prompted to confirm delete invokes handleDelete()", async () => {  
    const {container} = render(
      <DashButtons handleRedirect={handleRedirect} setAskConfirm={setAskConfirm}
      handleDelete={handleDelete} confirm={confirm} askConfirm={askConfirm} />
    )
    const confirmYes = container.getElementsByClassName('confirmYes')[0]
    await userEvent.click(confirmYes)
    expect(handleDelete).toHaveBeenCalled()
  })
})


