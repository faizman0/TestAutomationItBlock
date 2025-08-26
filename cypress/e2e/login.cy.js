describe('Login Feature OrangeHRM', () => {

    beforeEach(() => {
        // Aksi: Mengunjungi halaman login sebelum setiap tes
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    });

    it('TC_001-Login dengan username dan password benar', () => {
        // Intercept: Menyiapkan pencegatan untuk API login
        cy.intercept('POST', '**/auth/validate').as('loginRequest');

        // Aksi: Mengisi form login dengan data valid
        cy.get('input[name="username"]').type('Admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        // Verifikasi: Menunggu dan memverifikasi respons API
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 302);
        
        // Verifikasi: Memastikan navigasi berhasil ke halaman dashboard
        cy.url().should('include', '/web/index.php/dashboard/index');
        cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard');
    });

    it('TC_002-Login dengan username tidak terdaftar', () => {
        // Aksi: Mengisi form login dengan username tidak terdaftar
        cy.get('input[name="username"]').type('aadmin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        // Verifikasi: Memastikan pesan kesalahan muncul di UI
        cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
    });

    it('TC_003-Login dengan password salah', () => {
        // Aksi: Mengisi form login dengan password salah
        cy.get('input[name="username"]').type('Admin');
        cy.get('input[name="password"]').type('admin1234');
        cy.get('button[type="submit"]').click();

        // Verifikasi: Memastikan pesan kesalahan muncul di UI
        cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
    });

    it('TC_004-Login dengan field kosong', () => {
        // Aksi: Langsung klik tombol login tanpa mengisi form
        cy.get('button[type="submit"]').click();

        // Verifikasi: Memastikan pesan kesalahan "Required" muncul di UI
        cy.get('div:nth-child(2) > .oxd-input-group > .oxd-text--span.oxd-input-field-error-message').should('have.text', 'Required');
        cy.get('div:nth-child(3) > .oxd-input-group > .oxd-text--span.oxd-input-field-error-message').should('have.text', 'Required');
    });

    it('TC_005-Login dengan tombol enter', () => {
        // Intercept: Menyiapkan pencegatan untuk API login
        cy.intercept('POST', '**/auth/validate').as('loginRequest');

        // Aksi: Mengisi form dan tekan tombol enter untuk login
        cy.get('input[name="username"]').type('Admin');
        cy.get('input[name="password"]').type('admin123{enter}');

        // Verifikasi: Menunggu dan memverifikasi respons API
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 302);

        // Verifikasi: Memastikan navigasi berhasil ke halaman dashboard
        cy.url().should('include', '/web/index.php/dashboard/index');
        cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard');
    });

    it('TC_006 - Menggunakan fitur lupa password', () => {
        // Intercept: Menyiapkan pencegatan untuk API lupa password
        cy.intercept('POST', '**/auth/sendPasswordReset').as('resetPassword');

        // Aksi: Mengklik link "Forgot your password?" dan mengisi username
        cy.get('.orangehrm-login-forgot-header').click();
        cy.get('input[name="username"]').type('Admin');
        cy.get('button[type="submit"]').click();

        // Verifikasi: Memastikan navigasi berhasil ke halaman reset password
        cy.url().should('include', '/web/index.php/auth/sendPasswordReset');
        cy.get('.orangehrm-card-container').should('contain', 'Reset Password');
    });
});