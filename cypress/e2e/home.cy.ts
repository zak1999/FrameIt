describe('The page should contain the correct contents', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Should successfully load the page', () => {
    cy.visit('http://localhost:3000');
  });

  it('Should contain Login Button and Slogan', () => {
    cy.contains('LOGIN');
    cy.contains('Frame It');
    cy.contains('Share It');
    cy.contains('Create a Party');
    cy.contains('Send everybody the link');
  });
});

describe('The buttons should correctly perform their usage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('LinkedIn Button should redirect correctly', () => {
    cy.get('#linkedin').click();
    cy.url().should('not.contain', 'http://localhost:3000');
  });

  it('GitHub Button should redirect correctly', () => {
    cy.get('#github').click();
    cy.url().should('not.contain', 'http://localhost:3000');
  });
});
