import { render } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { sampleData } from './sampleData';
import ShareButton from '../components/ShareButton';
import userEvent from '@testing-library/user-event';

const canShare = jest.fn();
const handleShare = jest.fn();
const goToPh = jest.fn();
const copied = false;

jest.mock("@auth0/auth0-react")
describe('<PartyRoomOwner /> page component tests: ', () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      ...sampleData
    })
  })
  it("Clicking share button shouldrun handleShare()", async () => {
    const {container} = render(
      <ShareButton canShare={canShare} copied={copied} onClick={handleShare}/>
      )
      const ShareButtonOnScreen = container.querySelector('#share-btn')
      await userEvent.click(ShareButtonOnScreen)
      expect(handleShare).toHaveBeenCalled()
  })
})