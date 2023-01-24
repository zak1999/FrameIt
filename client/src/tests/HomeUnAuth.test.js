import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAuth0 } from '@auth0/auth0-react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import Home from '../pages/Home';
import { sampleData } from './sampleData';

jest.mock("@auth0/auth0-react")

describe('<Home /> component tests for unauthenticated user', ()=>{
  beforeEach(() => {
    useAuth0.mockReturnValue({
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
    const logInBtn = container.querySelector('#login-btn');
    userEvent.click(logInBtn);
    expect(loginWithPopup).toHaveBeenCalled()
  });
})