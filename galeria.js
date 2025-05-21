let lightboxIndex = 0;
let lightboxFotos = [];

function cargarGaleria() {
  const galeria = document.getElementById("galeria");
  if (!galeria) return;
  db.ref('galeria').on('value', snapshot => {
    const fotos = snapshot.val() || [];
    lightboxFotos = fotos; // Guarda las fotos para el lightbox
    galeria.innerHTML = "";
    fotos.forEach((foto, index) => {
      const item = document.createElement("div");
      item.className = "galeria-item";

      const img = document.createElement("img");
      img.src = foto.url;
      img.alt = "Foto de la galería";
      img.onerror = () => { img.src = "https://via.placeholder.com/120x120?text=Imagen"; };
      img.style.cursor = "pointer";
      img.onclick = () => mostrarLightbox(index); // Abre el lightbox

      const btnEliminar = document.createElement("button");
      btnEliminar.className = "galeria-eliminar";
      btnEliminar.innerHTML = "×";
      btnEliminar.title = "Eliminar foto";
      btnEliminar.onclick = () => eliminarFoto(index);

      item.appendChild(img);
      item.appendChild(btnEliminar);
      galeria.appendChild(item);
    });
  });
}

function agregarFoto(event) {
  event.preventDefault();
  const inputUrl = document.getElementById("nuevaFoto");
  const inputFile = document.getElementById("archivoFoto");
  const url = inputUrl.value.trim();
  const file = inputFile.files[0];

  if (url) {
    db.ref('galeria').once('value', snapshot => {
      let fotos = snapshot.val() || [];
      fotos.push({ url });
      db.ref('galeria').set(fotos);
      inputUrl.value = "";
      inputFile.value = "";
    });
  } else if (file) {
    const storageRef = firebase.storage().ref();
    const nombreUnico = Date.now() + "_" + file.name;
    const fotoRef = storageRef.child('galeria/' + nombreUnico);

    fotoRef.put(file).then(snapshot => {
      return snapshot.ref.getDownloadURL();
    }).then(downloadURL => {
      db.ref('galeria').once('value', snapshot => {
        let fotos = snapshot.val() || [];
        fotos.push({ url: downloadURL });
        db.ref('galeria').set(fotos);
        inputUrl.value = "";
        inputFile.value = "";
      });
    }).catch(error => {
      alert("Error al subir la imagen: " + error.message);
    });
  } else {
    alert("Por favor ingresa una URL o selecciona una imagen.");
  }
}

function eliminarFoto(index) {
  db.ref('galeria').once('value', snapshot => {
    let fotos = snapshot.val() || [];
    fotos.splice(index, 1);
    db.ref('galeria').set(fotos);
  });
}

// Lightbox simple para ver imágenes en grande y navegar
function mostrarLightbox(index) {
  lightboxIndex = index;
  const foto = lightboxFotos[index];
  let lightbox = document.getElementById("lightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.style.position = "fixed";
    lightbox.style.top = 0;
    lightbox.style.left = 0;
    lightbox.style.width = "100vw";
    lightbox.style.height = "100vh";
    lightbox.style.background = "rgba(0,0,0,0.8)";
    lightbox.style.display = "flex";
    lightbox.style.alignItems = "center";
    lightbox.style.justifyContent = "center";
    lightbox.style.zIndex = 9999;
    lightbox.innerHTML = `
      <button id="prevFoto" class="lightbox-arrow" style="position:absolute;left:30px;">&#8592;</button>
      <img id="lightboxImg" src="" style="max-width:90vw;max-height:80vh;border-radius:10px;box-shadow:0 4px 24px #0008;">
      <button id="nextFoto" class="lightbox-arrow" style="position:absolute;right:30px;">&#8594;</button>
      <button id="closeLightbox" style="position:absolute;top:30px;right:30px;font-size:2em;background:none;color:white;border:none;cursor:pointer;">&times;</button>
    `;
    document.body.appendChild(lightbox);

    document.getElementById("closeLightbox").onclick = () => lightbox.remove();
    document.getElementById("prevFoto").onclick = (e) => { e.stopPropagation(); cambiarLightbox(-1); };
    document.getElementById("nextFoto").onclick = (e) => { e.stopPropagation(); cambiarLightbox(1); };
    lightbox.onclick = (e) => { if (e.target === lightbox) lightbox.remove(); };
  }
  document.getElementById("lightboxImg").src = foto.url;
}

function cambiarLightbox(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxFotos.length) % lightboxFotos.length;
  document.getElementById("lightboxImg").src = lightboxFotos[lightboxIndex].url;
}

cargarGaleria();