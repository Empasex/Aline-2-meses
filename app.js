function agregarActividad() {
  const input = document.getElementById("nuevaActividad");
  const actividad = input.value.trim();

  if (actividad) {
    db.ref('actividades').once('value', snapshot => {
      let actividades = snapshot.val() || [];
      actividades.push({ texto: actividad, hecha: false });
      db.ref('actividades').set(actividades);
      input.value = "";
    });
  }
}

function eliminarActividad(index) {
  db.ref('actividades').once('value', snapshot => {
    let actividades = snapshot.val() || [];
    actividades.splice(index, 1);
    db.ref('actividades').set(actividades);
  });
}

function marcarActividad(index) {
  db.ref('actividades').once('value', snapshot => {
    let actividades = snapshot.val() || [];
    actividades[index].hecha = !actividades[index].hecha;
    db.ref('actividades').set(actividades);
  });
}

let listenerSet = false;
function cargarActividades() {
  const lista = document.getElementById("actividades");
  if (listenerSet) return; // Evita múltiples listeners
  listenerSet = true;

  db.ref('actividades').on('value', snapshot => {
    const actividades = snapshot.val() || [];
    lista.innerHTML = "";
    actividades.forEach((actividad, index) => {
      const li = document.createElement("li");

      // Imagen (opcional)
      const imgContainer = document.createElement("div");
      imgContainer.classList.add("img-container");
      const img = document.createElement("img");
      img.src = "imagenes/nosotros.png";
      img.alt = "Imagen de actividad";
      imgContainer.appendChild(img);

      // Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = actividad.hecha;
      checkbox.onclick = () => marcarActividad(index);

      // Texto
      const texto = document.createElement("span");
      texto.textContent = actividad.texto;
      texto.title = actividad.texto; // Para tooltip nativo
      texto.style.textDecoration = actividad.hecha ? "line-through" : "none";
      texto.style.color = actividad.hecha ? "gray" : "black";

      // Espera a que el span esté en el DOM para medirlo
      setTimeout(() => {
        if (texto.scrollWidth > texto.clientWidth) {
          texto.classList.add("truncado");
        } else {
          texto.classList.remove("truncado");
        }
      }, 0);

      // Botón eliminar
      const botonEliminar = document.createElement("button");
      botonEliminar.textContent = "Eliminar";
      botonEliminar.onclick = () => eliminarActividad(index);

      li.appendChild(imgContainer);
      li.appendChild(checkbox);
      li.appendChild(texto);
      li.appendChild(botonEliminar);

      lista.appendChild(li);
    });
  });

  // Permitir agregar con Enter
  document.getElementById("nuevaActividad").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      agregarActividad();
    }
  });
}

// Ejecutar cargarActividades solo si existe el elemento en la página
if (document.getElementById("actividades")) {
  cargarActividades();
}