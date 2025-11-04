// ======================================================
// 🐾 HappyPaws - Control de Refugio (login/registro)
// ======================================================

const API_URL = 'http://localhost:3000/api'; // URL base para el Backend

// Simulación de sesión activa para el refugio (usando localStorage)
let refugioActivo = JSON.parse(localStorage.getItem("refugioActivo")) || null;

// ======================================================
// === SECCIONES ===
const inicioSection = document.getElementById("inicioSection");
const loginSection = document.getElementById("loginSection");
const registroSection = document.getElementById("registroSection");
// Si tienes un panel de refugio, agrégalo aquí: const panelRefugio = document.getElementById("panelRefugio");

// ======================================================
// === FUNCIÓN GENÉRICA DE MOSTRAR SECCIONES ===
function mostrarSolo(seccionActiva) {
    [inicioSection, loginSection, registroSection].forEach(
        (s) => (s.style.display = "none")
    );
    seccionActiva.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ======================================================
// === CAMBIO DE SECCIONES ===
function mostrarInicio() {
    mostrarSolo(inicioSection);
}

function mostrarLogin() {
    mostrarSolo(loginSection);
}

function mostrarRegistro() {
    mostrarSolo(registroSection);
}

// ======================================================
// === REGISTRO DE NUEVO REFUGIO (Conexión a Backend) ===
function registrarRefugio() {
    // Campos del formulario de refugio.html
    const nombreRefugio = document.getElementById("nombreRefugio").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const ciudad = document.getElementById("ciudad").value.trim(); // Se mapea a direccionRes en server.js
    const responsable = document.getElementById("responsable").value.trim(); // Se mapea a nombreRes en server.js

    if (!nombreRefugio || !email || !password || !responsable) {
        mostrarAlerta("Por favor completa los campos obligatorios.", "error");
        return;
    }

    // Llama a la ruta POST /api/refugio/registro
    fetch(`${API_URL}/refugio/registro`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // Enviamos todos los campos, el backend se encarga de mapearlos a Responsables_de_Refugio
        body: JSON.stringify({ nombreRefugio, email, password, telefono, ciudad, responsable }),
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(result => {
        if (result.status === 201) {
            mostrarAlerta("Refugio registrado con éxito 🐾 Ahora puedes iniciar sesión.", "success");
            document.getElementById("registroForm").reset();
            mostrarLogin();
        } else if (result.status === 409) {
            mostrarAlerta(result.body.error, "error"); // Correo ya registrado
        } else {
            mostrarAlerta("Error al registrar: " + (result.body.error || "Intenta más tarde."), "error");
        }
    })
    .catch(error => {
        console.error('Error de red/servidor:', error);
        mostrarAlerta("Error de conexión con el servidor. Verifica que el backend esté corriendo.", "error");
    });
}

// ======================================================
// === INICIO DE SESIÓN DEL REFUGIO (Conexión a Backend) ===
function iniciarSesion() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        mostrarAlerta("Por favor completa todos los campos.", "error");
        return;
    }

    // Llama a la ruta POST /api/refugio/login
    fetch(`${API_URL}/refugio/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(result => {
        if (result.status === 200) {
            // Login exitoso: guardar el refugio devuelto por el servidor
            refugioActivo = result.body.refugio;
            localStorage.setItem("refugioActivo", JSON.stringify(refugioActivo));
            
            mostrarAlerta(result.body.mensaje, "success");
            
            // Lógica para mostrar el panel de administración
            // Si tienes un panel, llama a mostrarPanelRefugio()
            mostrarInicio(); 
        } else {
            // Error de credenciales (401) o cualquier otro error
            mostrarAlerta(result.body.error || "Error al iniciar sesión. Intenta más tarde.", "error");
        }
    })
    .catch(error => {
        console.error('Error de red/servidor:', error);
        mostrarAlerta("Error de conexión con el servidor. Verifica que el backend esté corriendo.", "error");
    });
}

// ======================================================
// === ALERTAS BÁSICAS (Reemplaza los alert() nativos) ===
function mostrarAlerta(mensaje, tipo = "info") {
    // Esta función usa el alert nativo por simplicidad, pero con un log
    console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
    alert(mensaje);
}

// ======================================================
// === INICIALIZACIÓN ===
window.onload = () => {
    // Si hay una sesión de refugio activa, saltar al panel
    if (refugioActivo) {
        // Aquí iría la llamada a mostrarPanelRefugio() si lo tuvieras
        mostrarAlerta(`Sesión de ${refugioActivo.nombre} activa.`, "info");
    }
    mostrarInicio(); 
};