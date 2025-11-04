// ======================================================
// 🐾 HappyPaws - Control de usuario (inicio, login y panel)
// ======================================================

const API_URL = 'http://localhost:3000/api'; // <--- URL base para el Backend

// Simulación de base de datos (guardada en localStorage)
// Ahora se usa principalmente para mantener el estado de la sesión
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo")) || null;

// ======================================================
// === SECCIONES ===
const inicioSection = document.getElementById("inicioSection");
const loginSection = document.getElementById("loginSection");
const registroSection = document.getElementById("registroSection");
const panelUsuario = document.getElementById("panelUsuario");

// ======================================================
// === FUNCIÓN GENÉRICA DE MOSTRAR SECCIONES ===
function mostrarSolo(seccionActiva) {
  [inicioSection, loginSection, registroSection, panelUsuario].forEach(
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
// === REGISTRO DE NUEVO USUARIO (Conexión a Backend) ===
function registrarUsuario() {
  const nombre = document.getElementById("nombreComp").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const ciudad = document.getElementById("ciudad").value.trim();

  if (!nombre || !email || !password) {
    return mostrarAlerta("Por favor completa los campos obligatorios.", "error");
  }

  // Llama a la ruta POST /api/registro del backend
  fetch(`${API_URL}/registro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre, email, password, telefono, ciudad }),
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(result => {
      if (result.status === 201) {
        mostrarAlerta("Cuenta creada con éxito 🐾 Ahora puedes iniciar sesión.", "success");
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
// === INICIO DE SESIÓN (Conexión a Backend) ===
function iniciarSesion() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    return mostrarAlerta("Por favor completa todos los campos.", "error");
  }

  // Llama a la ruta POST /api/login del backend
  fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(result => {
      if (result.status === 200) {
        // Login exitoso: guardar el usuario devuelto por el servidor
        usuarioActivo = result.body.usuario;
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
        
        mostrarAlerta(result.body.mensaje, "success");
        mostrarPanelUsuario();
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
// ====== PANEL DE USUARIO ===
function mostrarPanelUsuario() {
  mostrarSolo(panelUsuario);

  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!usuario) return;

  // Accede a 'usuario.nombre', que ya fue mapeado a 'nombreComp' por el backend.
  document.getElementById("userName").textContent = usuario.nombre;
  document.getElementById("nombreUsuario").textContent = usuario.nombre;
  
  mostrarMascotas();
}

// ======================================================
// === MOSTRAR MASCOTAS EN TARJETAS (Carga desde Backend) ===
// Eliminamos la lista local 'const mascotas = [...]'
function mostrarMascotas() {
  const lista = document.getElementById("listaMascotas");
  lista.innerHTML = `<div style="text-align:center; padding:20px;">Cargando mascotas disponibles... 🐾</div>`;

  // Llama a la ruta GET /api/mascotas del backend
  fetch(`${API_URL}/mascotas`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(mascotas => {
      lista.innerHTML = ""; // Limpia el mensaje de carga

      if (mascotas.length === 0) {
          lista.innerHTML = `<div style="text-align:center; padding:20px;">¡Vaya! No hay mascotas disponibles por ahora. 😿</div>`;
          return;
      }
      
      mascotas.forEach((m, i) => {
        const card = document.createElement("div");
        card.classList.add("hp-pet");
        card.style.animationDelay = `${i * 0.1}s`;

        // Los campos deben coincidir con lo que devuelve la base de datos (nombre, especie, img_url, etc.)
        card.innerHTML = `
          <img src="${m.img_url}" alt="${m.nombre}" class="hp-pet__img" />
          <div class="hp-pet__body">
            <h4 class="hp-pet__name">${m.nombre}</h4>
            <p class="hp-pet__meta">${m.especie} • ${m.raza}</p>
            <p class="hp-pet__meta">Edad: ${m.edad}</p>
            <p class="hp-pet__location">📍 ${m.ciudad}</p>
          </div>
          <div class="hp-pet__cta">
            <button class="hp-pet__btn" onclick="adoptar('${m.nombre}')">Adoptar</button>
          </div>
        `;
        lista.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error al cargar mascotas:', error);
      lista.innerHTML = `<div style="text-align:center; padding:20px; color:var(--hp-danger); font-weight:600;">Error de conexión con el servidor.</div>`;
    });
}

// ======================================================
// === ADOPTAR MASCOTA ===
function adoptar(nombreMascota) {
  // NOTA: Esta función enviará una solicitud al backend más adelante
  mostrarAlerta(`Has enviado una solicitud de adopción por ${nombreMascota} 💌`, "success");
}

// ======================================================
// === CERRAR SESIÓN ===
function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  usuarioActivo = null;
  mostrarAlerta("Sesión cerrada correctamente 🐾", "info");
  setTimeout(() => location.reload(), 1000);
}

// ======================================================
// === ALERTAS BONITAS ===
function mostrarAlerta(mensaje, tipo = "info") {
  const colores = {
    success: "#c1f4d3",
    error: "#f8caca",
    info: "#d7e7ff",
  };
  const alerta = document.createElement("div");
  alerta.textContent = mensaje;
  Object.assign(alerta.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 18px",
    borderRadius: "10px",
    background: colores[tipo] || "#eee",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    zIndex: "9999",
    fontWeight: "600",
    transition: "all 0.4s ease",
  });
  document.body.appendChild(alerta);

  setTimeout(() => {
    alerta.style.opacity = "0";
    alerta.style.transform = "translateY(-10px)";
    setTimeout(() => alerta.remove(), 400);
  }, 2500);
}

// ======================================================
// === AL CARGAR LA PÁGINA ===
window.onload = () => {
  usuarioActivo ? mostrarPanelUsuario() : mostrarInicio();
};