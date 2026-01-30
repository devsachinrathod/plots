document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const password2Input = document.getElementById('password2');
    const fullNameInput = document.getElementById('fname');
    const roleInputs = document.querySelectorAll('input[name="role"]');
    const submitButton = document.querySelector('button[type="submit"]');

    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', checkFormValidity);
    passwordInput.addEventListener('blur', validatePassword);
    passwordInput.addEventListener('input', checkFormValidity);
    password2Input.addEventListener('blur', validateConfirmPassword);
    password2Input.addEventListener('input', checkFormValidity);
    fullNameInput.addEventListener('blur', validateFullName);
    fullNameInput.addEventListener('input', checkFormValidity);
    roleInputs.forEach(roleInput => roleInput.addEventListener('change', checkFormValidity));

    function validateEmail() {
        const emailValue = emailInput.value.trim();
        const emailError = document.getElementById('email-error');

        if (!emailValue) {
            emailError.textContent = 'Email is required';
            emailInput.classList.add('input-error');
        } else if (!isValidEmail(emailValue)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('input-error');
        } else {
            emailError.textContent = '';
            emailInput.classList.remove('input-error');
        }
        checkFormValidity();
    }

    function validatePassword() {
        const passwordValue = passwordInput.value.trim();
        const passwordError = document.getElementById('password-error');

        if (!passwordValue) {
            passwordError.textContent = 'Password is required';
            passwordInput.classList.add('input-error');
        } else {
            if (passwordValue.length < 8) {
                passwordError.textContent = 'Password must be at least 8 characters long';
                passwordInput.classList.add('input-error');
            } else if (
                !/[A-Z]/.test(passwordValue) ||
                !/[a-z]/.test(passwordValue) ||
                !/[0-9]/.test(passwordValue) ||
                !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue)
            ) {
                passwordError.textContent = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
                passwordInput.classList.add('input-error');
            } else {
                passwordError.textContent = '';
                passwordInput.classList.remove('input-error');
            }
        }
        checkFormValidity();
    }

    function validateConfirmPassword() {
        const passwordValue = passwordInput.value.trim();
        const confirmPasswordValue = password2Input.value.trim();
        const confirmPasswordError = document.getElementById('password2-error');

        if (!confirmPasswordValue) {
            confirmPasswordError.textContent = 'Please confirm your password';
            password2Input.classList.add('input-error');
        } else if (passwordValue !== confirmPasswordValue) {
            confirmPasswordError.textContent = 'Passwords do not match';
            password2Input.classList.add('input-error');
        } else {
            confirmPasswordError.textContent = '';
            password2Input.classList.remove('input-error');
        }
        checkFormValidity();
    }

    function validateFullName() {
        const fullNameValue = fullNameInput.value.trim();
        const fullNameError = document.getElementById('fname-error');

        if (!fullNameValue) {
            fullNameError.textContent = 'Full name is required';
            fullNameInput.classList.add('input-error');
        } else {
            fullNameError.textContent = '';
            fullNameInput.classList.remove('input-error');
        }
        checkFormValidity();
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function checkFormValidity() {
        const isEmailValid = !document.getElementById('email-error').textContent;
        const isPasswordValid = !document.getElementById('password-error').textContent;
        const isConfirmPasswordValid = !document.getElementById('password2-error').textContent;
        const isFullNameValid = !document.getElementById('fname-error').textContent;
        const isRoleSelected = [...roleInputs].some(roleInput => roleInput.checked);

        submitButton.disabled = !(isEmailValid && isPasswordValid && isConfirmPasswordValid && isFullNameValid && isRoleSelected);
    }

    // Initial check
    checkFormValidity();
});
