document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-recomendacion');
  const contenedorResenas = document.querySelector('.resenas-contenedor');
  
  const toggleOscuro = document.getElementById('modoOscuroToggle');
	toggleOscuro.addEventListener('change', () => {
	  document.body.classList.toggle('dark-mode');
	});

  
  const filtro = document.getElementById('filtroPuntuacion');
	filtro.addEventListener('change', () => {
  const valor = parseInt(filtro.value);
	contenedorResenas.innerHTML = '';

  const filtradas = valor > 0
    ? reseñasGuardadas.filter(r => parseInt(r.puntuacion) >= valor)
    : reseñasGuardadas;

  filtradas.forEach(resena => agregarResenaAlDOM(resena));
});


  // Cargar reseñas guardadas
  const reseñasGuardadas = JSON.parse(localStorage.getItem('resenas')) || [];
  reseñasGuardadas.forEach(resena => agregarResenaAlDOM(resena));

  // Evento de envío del formulario
  form.addEventListener('submit', (e) => {
  e.preventDefault();

  const archivoImagen = document.getElementById('imagenLugar').files[0];

  if (archivoImagen) {
    const lector = new FileReader();
    lector.onload = function (evento) {
      const base64img = evento.target.result;

      guardarYAgregarResena(base64img);
    };
    lector.readAsDataURL(archivoImagen);
  } else {
    guardarYAgregarResena(null); // sin imagen
  }
});


	function guardarYAgregarResena(imagenBase64) {
	  const nuevaResena = {
		nombre: document.getElementById('nombreLugar').value,
		direccion: document.getElementById('direccion').value,
		comentario: document.getElementById('comentario').value,
		puntuacion: document.getElementById('puntuacion').value,
		imagen: imagenBase64 || "imagenes/ejemplo1.jpg"
	  };

	  reseñasGuardadas.push(nuevaResena);
	  localStorage.setItem('resenas', JSON.stringify(reseñasGuardadas));
	  agregarResenaAlDOM(nuevaResena);
	  form.reset();
	}
	function agregarResenaAlDOM(resena) {
	  const nueva = document.createElement('article');
	  nueva.classList.add('resena');

	  nueva.innerHTML = `
		<img src="${resena.imagen}" alt="Foto del lugar" />
		<h3>${resena.nombre}</h3>
		<p><strong>Dirección:</strong> ${resena.direccion}</p>
		<p><strong>Comentario:</strong> ${resena.comentario}</p>
		<p><strong>Puntuación:</strong> ${'⭐'.repeat(resena.puntuacion)}</p>
		<button class="borrar">🗑️ Borrar</button>
	  `;

	  nueva.querySelector('.borrar').addEventListener('click', () => {
		eliminarResena(resena);
		nueva.remove();
	  });

	  contenedorResenas.appendChild(nueva);
	}
	function eliminarResena(obj) {
	  const index = reseñasGuardadas.findIndex(r =>
		r.nombre === obj.nombre &&
		r.direccion === obj.direccion &&
		r.comentario === obj.comentario &&
		r.puntuacion === obj.puntuacion
	  );

	  if (index !== -1) {
		reseñasGuardadas.splice(index, 1);
		localStorage.setItem('resenas', JSON.stringify(reseñasGuardadas));
	  }
	}
	
});
document.getElementById('exportarJSON').addEventListener('click', () => {
  const datos = JSON.stringify(reseñasGuardadas, null, 2);
  const blob = new Blob([datos], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'resenas_quito.json';
  a.click();
  URL.revokeObjectURL(url);
});
document.getElementById('borrarTodo').addEventListener('click', () => {
  if (confirm("¿Estás seguro de que quieres borrar todas las reseñas?")) {
    localStorage.removeItem('resenas');
    reseñasGuardadas.length = 0;
    contenedorResenas.innerHTML = '';
  }
});
window.addEventListener('load', () => {
  document.getElementById('loader').style.display = 'none';
});

