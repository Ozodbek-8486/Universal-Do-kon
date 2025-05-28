   const themeToggle = document.getElementById('themeToggle');
        const moonIcon = document.getElementById('moonIcon');
        const sunIcon = document.getElementById('sunIcon');
        const body = document.body;
        
        body.classList.remove('light-theme');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';

        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('light-theme')) {
                body.classList.remove('light-theme');
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'block';
            } else {
                body.classList.add('light-theme');
                moonIcon.style.display = 'block';
                sunIcon.style.display = 'none';
            }
        });


        const backBtn = document.querySelector('.back-btn');
        backBtn.addEventListener('click', () => {
            alert('Orqaga tugmasi bosildi');
        });

        const form = document.getElementById('registrationForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Parollar mos kelmadi!');
                return;
            }
            
            alert('Ro\'yxatdan o\'tish muvaffaqiyatli!');
            form.reset();
        });