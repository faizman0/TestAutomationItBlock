describe('Login OrangeHRM', () => {
  beforeEach( () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });
  it('Login dengan username dan password benar', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    //verifikasi berhasil login
    cy.url().should('include', '/web/index.php/dashboard/index');
  })
})