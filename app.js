function mostrarLista() {
  document.getElementById('inicio').style.display = 'none';
  document.getElementById('lista').style.display = 'block';
  cargarActividades();
}

function agregarActividad() {
  const input = document.getElementById("nuevaActividad");
  const actividad = input.value.trim();

  if (actividad) {
    let actividades = JSON.parse(localStorage.getItem("actividades")) || [];
    actividades.push({ texto: actividad, hecha: false }); // Guardar actividad con estado "hecha"
    localStorage.setItem("actividades", JSON.stringify(actividades));
    input.value = "";
    cargarActividades();
  }
}

function eliminarActividad(index) {
  let actividades = JSON.parse(localStorage.getItem("actividades")) || [];
  actividades.splice(index, 1);
  localStorage.setItem("actividades", JSON.stringify(actividades));
  cargarActividades();
}

function marcarActividad(index) {
  let actividades = JSON.parse(localStorage.getItem("actividades")) || [];
  actividades[index].hecha = !actividades[index].hecha; // Cambiar el estado de "hecha"
  localStorage.setItem("actividades", JSON.stringify(actividades));
  cargarActividades();
}

function cargarActividades() {
  const lista = document.getElementById("actividades");
  lista.innerHTML = "";
  const actividades = JSON.parse(localStorage.getItem("actividades")) || [];

  actividades.forEach((actividad, index) => {
    const li = document.createElement("li");

    // Crear el contenedor de la imagen
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");

    // Crear la imagen
    const img = document.createElement("img");
    img.src = "imagenes/nosotros.png"; // Ruta relativa a la carpeta del proyecto
    img.alt = "Imagen de actividad";
    imgContainer.appendChild(img);

    // Crear el checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = actividad.hecha; // Marcar si está hecha
    checkbox.onclick = () => marcarActividad(index);

    // Crear el texto de la actividad
    const texto = document.createElement("span");
    texto.textContent = actividad.texto;
    texto.style.textDecoration = actividad.hecha ? "line-through" : "none"; // Tachado si está hecha
    texto.style.color = actividad.hecha ? "gray" : "black";

    // Crear el botón eliminar
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.onclick = () => eliminarActividad(index);

    // Agregar los elementos al <li>
    li.appendChild(imgContainer);
    li.appendChild(checkbox);
    li.appendChild(texto);
    li.appendChild(botonEliminar);

    // Agregar el <li> a la lista
    lista.appendChild(li);
  });
}