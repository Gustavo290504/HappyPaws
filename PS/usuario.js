// ======== DATOS SIMULADOS ========
const mascotas = [
  { nombre: "Luna", especie: "Perro", raza: "Labrador", edad: 3, ciudad: "Monterrey", img: "https://place-puppy.com/300x300" },
  { nombre: "Milo", especie: "Gato", raza: "Siamés", edad: 2, ciudad: "Guadalajara", img: "https://placekitten.com/300/300" },
  { nombre: "Rocky", especie: "Perro", raza: "Pitbull", edad: 4, ciudad: "CDMX", img: "https://place-puppy.com/301x301" },
  { nombre: "Nina", especie: "Conejo", raza: "Mini Lop", edad: 1, ciudad: "Tampico", img: "https://placebear.com/300/300" },
];

// ======== CARGA DE USUARIO ACTIVO ========
let usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

window.onload = function () {
  if (!usuarioActivo) {
    alert("Por favor inicia sesión primero 🐾");
    window.location.href = "usuario_login.html"; // si tienes un archivo de login aparte
    return;
  }

  document.getElementById("nombreUsuario").textContent = usuarioActivo.nombre;
  document.getElementById("userName").textContent = usuarioActivo.nombre;

  mostrarMascotas();
};

// ======== MOSTRAR MASCOTAS ========
function mostrarMascotas() {
  const lista = document.getElementById("listaMascotas");
  lista.innerHTML = "";

  mascotas.forEach(m => {
    const card = document.createElement("div");
    card.classList.add("mascota-card");
    card.innerHTML = `
      <img src="${m.img}" alt="${m.nombre}">
      <h4>${m.nombre}</h4>
      <p>${m.especie} • ${m.raza}</p>
      <p>Edad: ${m.edad} años</p>
      <p>📍 ${m.ciudad}</p>
      <button class="adoptar-btn" onclick="adoptar('${m.nombre}')">Adoptar</button>
    `;
    lista.appendChild(card);
  });
}

// ======== ADOPTAR MASCOTA ========
function adoptar(nombreMascota) {
  alert(`Has enviado una solicitud de adopción por ${nombreMascota} 💌`);
}

// ======== CERRAR SESIÓN ========
function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  alert("Sesión cerrada correctamente 🐾");
  window.location.href = "index.html";
}
