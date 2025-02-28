// Función para mostrar el formulario de registro
function showRegister() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'block';
}

// Función para mostrar el formulario de inicio de sesión
function showLogin() {
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

// Manejar el envío del formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe de manera tradicional

    const username = document.getElementById('loginUsername').value;

    // Enviar solicitud al servidor para iniciar sesión
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirigir al usuario a un sitio web después del inicio de sesión
            window.location.href = 'http://192.168.1.6:5000'; // Cambia esta URL
        } else {
            // Mostrar mensaje de error
            document.getElementById('loginMessage').textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('loginMessage').textContent = 'Error al iniciar sesión';
    });
});

// Manejar el envío del formulario de registro
document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe de manera tradicional

    const username = document.getElementById('registerUsername').value;

    // Enviar solicitud al servidor para registrar al usuario
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Mostrar mensaje de éxito y cambiar al formulario de inicio de sesión
            document.getElementById('registerMessage').textContent = data.message;
            showLogin(); // Cambiar al formulario de inicio de sesión
        } else {
            // Mostrar mensaje de error
            document.getElementById('registerMessage').textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('registerMessage').textContent = 'Error al registrar el usuario';
    });
});