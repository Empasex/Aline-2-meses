function cargarGaleria() {
  const galeria = document.getElementById("galeria");
  if (!galeria) return;
  db.ref('galeria').on('value', snapshot => {
    const fotos = snapshot.val() || [];
    galeria.innerHTML = "";
    fotos.forEach((foto, index) => {
      const item = document.createElement("div");
      item.className = "galeria-item";

      const img = document.createElement("img");
      img.src = foto.url;
      img.alt = "Foto de la galería";
      img.onerror = () => { img.src = "https://via.placeholder.com/120x120?text=Imagen"; };

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

cargarGaleria();