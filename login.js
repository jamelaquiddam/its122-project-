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
            e.preventDefault(); // Eto ang pinakamahalaga: pinipigilan nito ang automatic page refresh!

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const alertBox = document.getElementById('loginAlert');
            const alertMsg = document.getElementById('loginAlertMsg');
            const btnText = document.getElementById('loginBtnText');
            const spinner = document.getElementById('loginSpinner');
            const btnIcon = document.getElementById('loginBtnIcon');
            const role = document.getElementById('loginRole').value;

            // Simple validation
            if (!email || !password) {
                alertBox.classList.add('show');
                alertMsg.innerText = "Please enter your email and password.";
                return;
            }

            // Itago ang alert kung meron man
            alertBox.classList.remove('show');

            // Ipakita ang loading animation
            btnText.innerText = "Signing in...";
            if (btnIcon) btnIcon.style.display = 'none';
            if (spinner) spinner.classList.add('show');
            
            // Gayahin natin na may nagche-check na backend na umaabot ng 2 segundo
            setTimeout(() => {
                // DITO MO BABAGUHIN: Kung saan siya dapat pumunta pagkatapos mag-login
                // Pinalitan ko ng "dashboard.html" bilang halimbawa base sa CSS mo
                window.location.href = "dashboard.html"; 
            }, 2000);
        });
    }

    // --- REGISTER FORM ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const alertError = document.getElementById('regAlert');
            const alertSuccess = document.getElementById('regSuccess');
            const btnText = document.getElementById('registerBtnText');
            const spinner = document.getElementById('registerSpinner');
            const btnIcon = document.getElementById('registerBtnIcon');
            const terms = document.getElementById('regTerms');

            // I-check kung chineck ang Terms and Conditions
            if (!terms.checked) {
                alertError.classList.add('show');
                document.getElementById('regAlertMsg').innerText = "You must accept the Terms and Conditions.";
                return;
            }

            alertError.classList.remove('show');
            btnText.innerText = "Creating account...";
            if (btnIcon) btnIcon.style.display = 'none';
            if (spinner) spinner.classList.add('show');

            setTimeout(() => {
                // Pagkatapos mag-load, ipakita ang success banner at pumunta sa login
                alertSuccess.classList.add('show');
                spinner.classList.remove('show');
                btnText.innerText = "Redirecting...";
                
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);
            }, 2000);
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