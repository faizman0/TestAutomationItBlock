describe('Login OrangeHRM', () => {
  beforeEach( () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  it('TC_001-Login dengan username dan password benar', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    //verifikasi berhasil login
    cy.url().should('include', '/web/index.php/dashboard/index');
  });

  it('TC_002-Login dengan username tidak terdaftar', () => {
    cy.get('input[name="username"]').type('aadmin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    //verifikasi muncul pesan kesalahan
    cy.get('.oxd-alert-content.oxd-alert-content--error').should('contain', 'Invalid credentials');
  });

  it('TC_003-Login dengan password salah', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin1234');
    cy.get('button[type="submit"]').click();

    //verifikasi muncul pesan kesalahan
    cy.get('.oxd-alert-content.oxd-alert-content--error').should('contain', 'Invalid credentials');
  });

  it('TC_004-Login dengan field kosong', () => {
    //langsung klik tombol login tanpa mengisi form
    cy.get('button[type="submit"]').click();

    //verifikasi muncul pesan kesalahan
    cy.get('div:nth-child(2) > .oxd-input-group > .oxd-text--span.oxd-input-field-error-message').should('have.text', 'Required');
    cy.get('div:nth-child(3) > .oxd-input-group > .oxd-text--span.oxd-input-field-error-message').should('have.text', 'Required');
  });
  it('TC_005-Login dengan tombol enter', () => {
      // Aksi: Mengisi form dan tekan tombol enter untuk login
      cy.get('input[name="username"]').type('Admin');
      cy.get('input[name="password"]').type('admin123{enter}');

      // Verifikasi: Memastikan navigasi berhasil ke halaman dashboard
      cy.url().should('include', '/web/index.php/dashboard/index');
      cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard');
  });

  it('TC_006 - Menggunakan fitur lupa password', () => {
      // Aksi: Mengklik link "Forgot your password?"
      cy.get('.orangehrm-login-forgot-header').click();

      // Verifikasi: Memastikan navigasi berhasil ke halaman reset password
      cy.url().should('include', '/requestPasswordResetCode');
      cy.get('.orangehrm-card-container').should('contain', 'Reset Password');
  });
});