describe('The dashsboard should have the correct contents', () => {
  // Currently not working as the page will only load upon authentication.

  it('Should correctly redirect you to the dashboard page when clicking on the navbar logo', () => {
    cy.get('navbar').click();
    cy.url().should('eq', 'http://localhost:3000/dashboard');
  });

  it('Should create a new party and redirect the user upon creating a party', () => {
    cy.get('#test-create-party').click();
    cy.url().should('eq', 'http://localhost:3000/party/*');
  });

  it('Should contain the correct contents in the buttons', () => {
    cy.contains('Hello !');
    cy.contains('CREATE A PARTY 📸');
    cy.contains('LOGOUT');
  });
});
