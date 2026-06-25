// ==========================================
// UTILITY FUNCTIONS PARA SA UI
// ==========================================

// I-toggle ang visibility ng Password (eye icon)
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Para sa Role Selection (User o Admin tabs)
function setRole(role) {
    const roleInput = document.getElementById('loginRole');
    if (roleInput) roleInput.value = role;

    const tabUser = document.getElementById('tabUser');
    const tabAdmin = document.getElementById('tabAdmin');
    
    if (role === 'user') {
        if(tabUser) tabUser.classList.add('active');
        if(tabAdmin) tabAdmin.classList.remove('active');
    } else {
        if(tabUser) tabUser.classList.remove('active');
        if(tabAdmin) tabAdmin.classList.add('active');
    }
}

// Password Strength Checker sa Registration Page
function checkPasswordStrength(password) {
    const bar1 = document.getElementById('bar1');
    const bar2 = document.getElementById('bar2');
    const bar3 = document.getElementById('bar3');
    const bar4 = document.getElementById('bar4');
    const label = document.getElementById('strengthLabel');

    if (!bar1) return; // I-skip kung wala sa registration page

    // I-reset ang kulay ng bars
    [bar1, bar2, bar3, bar4].forEach(bar => bar.style.background = '#e0d9d2');
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;

    if (password.length > 0) {
        bar1.style.background = '#c0392b'; // Weak
        label.innerText = 'Weak';
        label.style.color = '#c0392b';
    } else {
        label.innerText = '';
    }

    if (strength >= 2) {
        bar2.style.background = '#e67e22'; // Fair
        label.innerText = 'Fair';
        label.style.color = '#e67e22';
    }
    if (strength >= 3) {
        bar3.style.background = '#f1c40f'; // Good
        label.innerText = 'Good';
        label.style.color = '#f1c40f';
    }
    if (strength >= 4) {
        bar4.style.background = '#27ae60'; // Strong
        label.innerText = 'Strong';
        label.style.color = '#27ae60';
    }
}

// Forgot Password Modal logic
function openForgot() {
    const overlay = document.getElementById('forgotOverlay');
    if (overlay) overlay.classList.add('open');
}

function closeForgot() {
    const overlay = document.getElementById('forgotOverlay');
    if (overlay) overlay.classList.remove('open');
}


// ==========================================
// FORM SUBMISSION HANDLING (Ang pipigil sa main page redirect)
// ==========================================

// Hintayin muna mag-load ang buong HTML bago patakbuhin ang scripts
document.addEventListener('DOMContentLoaded', () => {
    
    // --- LOGIN FORM ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const alertBox = document.getElementById('loginAlert');
            const alertMsg = document.getElementById('loginAlertMsg');
            const btnText = document.getElementById('loginBtnText');
            const spinner = document.getElementById('loginSpinner');
            const btnIcon = document.getElementById('loginBtnIcon');
            const role = document.getElementById('loginRole').value;

            if (!email || !password) {
                alertBox.classList.add('show');
                alertMsg.innerText = "Please enter your email and password.";
                return;
            }

            alertBox.classList.remove('show');
            btnText.innerText = "Signing in...";
            if (btnIcon) btnIcon.style.display = 'none';
            if (spinner) spinner.classList.add('show');
            
            // I-setup ang data para ipasa sa PHP
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('role', role);

            // Ipadala sa login.php
            fetch('login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                spinner.classList.remove('show');
                
                if (data.trim() === 'success') {
                    btnText.innerText = "Redirecting...";
                    setTimeout(() => {
                        // Saan pupunta kapag success?
                        if (role === 'admin') {
                            window.location.href = "dashboard.html"; // Palitan mo kung ano ang file name ng admin dashboard mo
                        } else {
                            window.location.href = "index.html"; // Main page para sa normal user
                        }
                    }, 1500);
                } else {
                    alertBox.classList.add('show');
                    alertMsg.innerText = data.replace('error: ', '');
                    btnText.innerText = "Sign In";
                    if (btnIcon) btnIcon.style.display = 'inline-block';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                spinner.classList.remove('show');
                alertBox.classList.add('show');
                alertMsg.innerText = "Connection error. Please try again.";
                btnText.innerText = "Sign In";
                if (btnIcon) btnIcon.style.display = 'inline-block';
            });
        });
    }

    // --- REGISTER FORM ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const alertError = document.getElementById('regAlert');
            const alertMsg = document.getElementById('regAlertMsg');
            const alertSuccess = document.getElementById('regSuccess');
            const btnText = document.getElementById('registerBtnText');
            const spinner = document.getElementById('registerSpinner');
            const btnIcon = document.getElementById('registerBtnIcon');
            const terms = document.getElementById('regTerms');

            if (!terms.checked) {
                alertError.classList.add('show');
                alertMsg.innerText = "You must accept the Terms and Conditions.";
                return;
            }

            alertError.classList.remove('show');
            btnText.innerText = "Creating account...";
            if (btnIcon) btnIcon.style.display = 'none';
            if (spinner) spinner.classList.add('show');

            // I-setup ang data na ipapasa sa PHP
            const formData = new FormData();
            formData.append('regFullName', document.getElementById('regFullName').value);
            formData.append('regUsername', document.getElementById('regUsername').value);
            formData.append('regEmail', document.getElementById('regEmail').value);
            formData.append('regPassword', document.getElementById('regPassword').value);

            // Ipadala sa register.php
            fetch('register.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                spinner.classList.remove('show');
                
                if (data.trim() === 'success') {
                    alertSuccess.classList.add('show');
                    btnText.innerText = "Redirecting...";
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 1500);
                } else {
                    alertError.classList.add('show');
                    alertMsg.innerText = data.replace('error: ', '');
                    btnText.innerText = "Create My Account";
                    if (btnIcon) btnIcon.style.display = 'inline-block';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                spinner.classList.remove('show');
                alertError.classList.add('show');
                alertMsg.innerText = "Connection error. Please try again.";
                btnText.innerText = "Create My Account";
                if (btnIcon) btnIcon.style.display = 'inline-block';
            });
        });
    }

    // --- FORGOT PASSWORD FORM ---
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const spinner = document.getElementById('forgotSpinner');
            const successAlert = document.getElementById('forgotSuccess');
            
            if (spinner) spinner.classList.add('show');

            setTimeout(() => {
                if (spinner) spinner.classList.remove('show');
                if (successAlert) successAlert.classList.add('show');
            }, 1500);
        });
    }
});