// Espera a que todo el contenido del DOM (HTML) esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. OBTENER REFERENCIAS A LOS ELEMENTOS HTML ---
    // (Ahora estamos seguros de que estos elementos existen)
    const botonAgregarNota = document.getElementById('botonAgregarNota');
    const contenedorPuntosNotas = document.getElementById('contenedorPuntosNotas');
    const gridNotas = document.getElementById('gridNotas');

    // Contador para el número de notas. Lo usamos para crear IDs únicos.
    let contadorNotas = 0;

    // --- 2. FUNCIONES ---

    /**
     * @description Genera un color pastel aleatorio en formato HSL.
     * Los colores pastel son claros y agradables a la vista.
     * @returns {string} Una cadena de color en formato 'hsl(hue, saturation%, lightness%)'.
     */
    function generarColorPastelAleatorio() {
        // Matiz (color): 0 a 360 grados en la rueda de color
        const matiz = Math.floor(Math.random() * 361);
        // Saturación (intensidad del color): 40% a 70% para que no sea ni muy gris ni muy chillón
        const saturacion = Math.floor(Math.random() * (70 - 40 + 1)) + 40;
        // Luminosidad (brillo): 80% a 95% para que sea claro (pastel)
        const luminosidad = Math.floor(Math.random() * (95 - 80 + 1)) + 80;
        return `hsl(${matiz}, ${saturacion}%, ${luminosidad}%)`;
    }

    /**
     * @description Crea y añade un nuevo punto de color en la barra lateral junto a su título.
     * El punto y el título aparecen lado a lado en la barra lateral.
     * @param {string} id - El ID único para este punto (ej: 'punto-1')
     * @param {string} color - El color de fondo a aplicar.
     * @param {string} titulo - El título de la nota (se mostrará junto al punto)
     */
    function crearPuntoNota(id, color, titulo) {
        // Creamos un contenedor que tendrá el punto + título
        const itemPunto = document.createElement('div');
        itemPunto.classList.add('item-punto-nota');
        itemPunto.id = `item-${id}`; // ID del contenedor (ej: "item-punto-1")
        
        // Creamos el punto de color
        const punto = document.createElement('div');
        punto.classList.add('punto-nota'); // Añadimos la clase base del CSS
        punto.id = id; // Asignamos el ID único (ej: "punto-1")
        punto.style.backgroundColor = color; // Asignamos el color pastel aleatorio
        
        // Creamos la etiqueta con el título
        const etiquetaTitulo = document.createElement('span');
        etiquetaTitulo.classList.add('etiqueta-titulo-punto');
        etiquetaTitulo.textContent = titulo; // El título de la nota
        etiquetaTitulo.id = `etiqueta-${id}`; // ID para poder actualizarlo luego
        
        // Añadimos el punto y la etiqueta al contenedor
        itemPunto.appendChild(punto);
        itemPunto.appendChild(etiquetaTitulo);
        
        // Añadimos el contenedor al contenedor de la barra lateral
        contenedorPuntosNotas.appendChild(itemPunto);

        // Activamos la animación de "pop" (salta y aparece) con un pequeño retraso
        // El retraso garantiza que la clase se aplique después de que el elemento esté en el DOM
        setTimeout(() => {
            punto.classList.add('animacion-pop');
        }, 10);
    }

    /**
     * @description Crea y añade una nueva tarjeta de nota al grid principal.
     * La tarjeta contiene un título editable, una lista editable con puntos/viñetas,
     * botón de favoritos, fecha de creación y botón de eliminar.
     * @param {string} id - El ID único para esta tarjeta (ej: 'nota-1')
     * @param {string} color - El color de fondo a aplicar.
     * @param {string} titulo - El título inicial de la nota
     * @param {boolean} esFavorito - Si la nota es favorita (por defecto false)
     * @param {string} fecha - Fecha de creación (si no se proporciona, se usa la actual)
     */
    function crearTarjetaNota(id, color, titulo, esFavorito = false, fecha = null) {
        // Obtenemos la fecha actual si no se proporciona
        if (!fecha) {
            const ahora = new Date();
            const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
            const dia = ahora.getDate().toString().padStart(2, '0');
            const año = ahora.getFullYear();
            fecha = `${mes}/${dia}/${año}`;
        }

        // Creamos un nuevo elemento <div> para la tarjeta
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-nota'); // Añadimos la clase base del CSS
        tarjeta.id = id; // Asignamos el ID único (ej: "nota-1")
        tarjeta.style.backgroundColor = color; // Asignamos el color pastel
        tarjeta.dataset.favorito = esFavorito; // Almacenamos si es favorito
        tarjeta.dataset.fecha = fecha; // Almacenamos la fecha

        // Definimos el contenido HTML de la tarjeta
        // Contiene: botón de eliminar, botón de favoritos, título editable,
        // lista editable y fecha en la esquina inferior izquierda
        tarjeta.innerHTML = `
            <div class="contenedor-botones-tarjeta">
                <button class="boton-favorito" title="Marcar como favorito">
                    <i class="far fa-star"></i>
                </button>
                <button class="boton-eliminar-nota" title="Eliminar esta nota">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <h4 class="titulo-nota" contenteditable="true">${titulo}</h4>
            <ul contenteditable="true" class="lista-nota">
                <li></li>
            </ul>
            <div class="fecha-nota">${fecha}</div>
        `;
        
        // Añadimos la nueva tarjeta al principio del grid de notas (prepend)
        // Así las notas nuevas aparecen arriba
        gridNotas.prepend(tarjeta);

        // Forzamos que los estilos de lista se mantengan incluso con contenteditable
        const lista = tarjeta.querySelector('.lista-nota');
        lista.style.display = 'block';
        const primerLi = lista.querySelector('li');
        if (primerLi) {
            primerLi.style.display = 'list-item';
        }

        // Si la nota es favorita, mostramos la estrella llena
        if (esFavorito) {
            const botonFavorito = tarjeta.querySelector('.boton-favorito');
            botonFavorito.innerHTML = '<i class="fas fa-star"></i>';
            tarjeta.classList.add('es-favorito');
        }

        // Activamos la animación de "deslizamiento de entrada" con un pequeño retraso
        setTimeout(() => {
            tarjeta.classList.add('animacion-deslizizar-entrada');
        }, 10);

        // Permite editar el título y sincronizarlo con la etiqueta en la barra lateral
        agregarEventosTitulo(tarjeta, id);
        
        // Permite editar la lista y presionar Enter para crear nuevos puntos
        agregarEventosLista(tarjeta);

        // Agregar evento al botón de favoritos
        const botonFavorito = tarjeta.querySelector('.boton-favorito');
        botonFavorito.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que se propague el clic
            toggleFavorito(tarjeta, id);
        });

        // Agregar evento al botón de eliminar
        const botonEliminar = tarjeta.querySelector('.boton-eliminar-nota');
        botonEliminar.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que se propague el clic
            manejarEliminacion(e);
        });
    }

    /**
     * @description Añade eventos al título para sincronizarlo con la etiqueta en la barra lateral.
     * Cuando el usuario cambia el título, se actualiza la etiqueta del punto.
     * @param {HTMLElement} tarjeta - La tarjeta que contiene el título
     * @param {string} idNota - El ID de la nota (ej: "nota-1")
     */
    function agregarEventosTitulo(tarjeta, idNota) {
        // Obtenemos el título (<h4>) dentro de la tarjeta
        const titulo = tarjeta.querySelector('.titulo-nota');
        
        // Derivamos el ID del punto correspondiente
        const idPunto = idNota.replace('nota-', 'punto-');
        
        // Evento input: se dispara cada vez que cambia el contenido del título
        titulo.addEventListener('input', () => {
            // Obtenemos la etiqueta del título en la barra lateral
            const etiquetaTitulo = document.getElementById(`etiqueta-${idPunto}`);
            
            // Actualizamos el texto de la etiqueta en la barra lateral
            if (etiquetaTitulo) {
                etiquetaTitulo.textContent = titulo.textContent;
            }
        });
    }

    /**
     * @description Añade eventos a la lista editable para permitir:
     * - Crear nuevos puntos al presionar Enter
     * - Mantener el formato de lista incluso si está vacía
     * - Permitir edición continua sin perder foco
     * - Las viñetas siempre son visibles
     * @param {HTMLElement} tarjeta - La tarjeta de nota que contiene la lista
     */
    function agregarEventosLista(tarjeta) {
        // Obtenemos la lista (<ul>) dentro de la tarjeta
        const lista = tarjeta.querySelector('.lista-nota');

        /**
         * Función auxiliar para asegurar que un <li> tiene los estilos correctos
         */
        function asegurarEstilosLi(li) {
            li.style.display = 'list-item';
            li.style.margin = '0 0 8px 0';
            li.style.padding = '0';
        }

        // Evento keydown: se dispara cuando el usuario presiona una tecla
        lista.addEventListener('keydown', (evento) => {
            // Si el usuario presionó Enter
            if (evento.key === 'Enter') {
                evento.preventDefault(); // Evitamos el comportamiento por defecto

                // Intentamos obtener el elemento <li> que está siendo editado
                const seleccion = window.getSelection();
                const filaActual = seleccion.anchorNode?.parentElement;

                // Validación: asegurarse de que filaActual es un <li>
                if (filaActual && filaActual.tagName === 'LI') {
                    // Creamos un nuevo elemento <li> vacío (sin texto de placeholder)
                    const nuevoLi = document.createElement('li');
                    nuevoLi.textContent = ''; // Vacío, solo cursor
                    
                    // Aseguramos que tiene los estilos correctos
                    asegurarEstilosLi(nuevoLi);

                    // Insertamos el nuevo <li> después del actual
                    filaActual.parentNode.insertBefore(nuevoLi, filaActual.nextSibling);

                    // Movemos el cursor al nuevo <li> para que el usuario pueda escribir
                    const rango = document.createRange();
                    rango.selectNodeContents(nuevoLi);
                    rango.collapse(true); // Cursor al inicio
                    seleccion.removeAllRanges();
                    seleccion.addRange(rango);
                }
            }
            // Si el usuario presionó Backspace y la línea está vacía, la eliminamos
            // (pero solo si hay más de un <li>)
            else if (evento.key === 'Backspace') {
                const seleccion = window.getSelection();
                const filaActual = seleccion.anchorNode?.parentElement;

                // Validación: asegurarse de que filaActual es un <li>
                if (filaActual && filaActual.tagName === 'LI') {
                    // Si el <li> está vacío y no es el único elemento
                    if (filaActual.textContent.trim() === '' && filaActual.parentNode.children.length > 1) {
                        filaActual.remove();
                    }
                }
            }
        });

        // Evento input: se dispara cuando cambia el contenido
        // Esto ayuda a mantener la lista editable incluso si se vacía completamente
        lista.addEventListener('input', () => {
            // Si la lista está completamente vacía, aseguramos que tiene al menos un <li>
            if (lista.querySelectorAll('li').length === 0) {
                const nuevoLi = document.createElement('li');
                nuevoLi.textContent = '';
                asegurarEstilosLi(nuevoLi);
                lista.appendChild(nuevoLi);

                // Movemos el cursor al nuevo <li>
                const rango = document.createRange();
                const seleccion = window.getSelection();
                rango.selectNodeContents(nuevoLi);
                rango.collapse(true);
                seleccion.removeAllRanges();
                seleccion.addRange(rango);
            }
            
            // Asegurar que todos los <li> tienen los estilos correctos
            lista.querySelectorAll('li').forEach(li => {
                asegurarEstilosLi(li);
            });
        });
    }

    /**
     * @description Función principal que se llama para crear una nota nueva.
     * Genera IDs, un color, un título, y llama a las funciones para crear el punto y la tarjeta.
     */
    function agregarNuevaNota() {
        contadorNotas++; // Incrementamos el contador para el siguiente ID

        // Generamos IDs únicos usando el contador
        // Ejemplo: contadorNotas = 1 -> idNota = "nota-1", idPunto = "punto-1"
        const idNota = `nota-${contadorNotas}`;
        const idPunto = `punto-${contadorNotas}`;

        // Creamos un título por defecto basado en el contador
        const titulo = `Nota ${contadorNotas}`;

        // Generamos un color pastel aleatorio
        // Este color se usará tanto en el punto como en la tarjeta
        const colorAleatorio = generarColorPastelAleatorio();

        // Creamos los dos elementos: el punto en la barra lateral y la tarjeta en el grid
        // Ahora pasamos el título a ambas funciones
        crearPuntoNota(idPunto, colorAleatorio, titulo);
        crearTarjetaNota(idNota, colorAleatorio, titulo);
    }

    /**
     * @description Alterna el estado de favorito de una nota.
     * Si es favorita, la mueve al inicio del grid.
     * También actualiza la estrella de la barra lateral.
     * @param {HTMLElement} tarjeta - La tarjeta de nota
     * @param {string} id - El ID de la nota (ej: "nota-1")
     */
    function toggleFavorito(tarjeta, id) {
        // Obtenemos el estado actual de favorito
        const esFavorito = tarjeta.dataset.favorito === 'true';
        
        // Invertimos el estado
        const nuevoEsFavorito = !esFavorito;
        tarjeta.dataset.favorito = nuevoEsFavorito;

        // Obtenemos el botón de favoritos y la estrella
        const botonFavorito = tarjeta.querySelector('.boton-favorito');
        
        // Actualizamos el icono de la estrella
        if (nuevoEsFavorito) {
            // Cambiamos a estrella llena (fas = font awesome solid)
            botonFavorito.innerHTML = '<i class="fas fa-star"></i>';
            tarjeta.classList.add('es-favorito');
            
            // Movemos la tarjeta al inicio del grid (como favorita)
            gridNotas.prepend(tarjeta);
        } else {
            // Cambiamos a estrella vacía (far = font awesome regular)
            botonFavorito.innerHTML = '<i class="far fa-star"></i>';
            tarjeta.classList.remove('es-favorito');
        }

        // Derivamos el ID del punto correspondiente
        const idPunto = id.replace('nota-', 'punto-');
        
        // Obtenemos el item del punto en la barra lateral
        const itemPunto = document.getElementById(`item-${idPunto}`);
        
        if (itemPunto) {
            // Si es favorita, agregamos la clase 'es-favorito' al item del punto
            if (nuevoEsFavorito) {
                itemPunto.classList.add('es-favorito');
            } else {
                itemPunto.classList.remove('es-favorito');
            }
        }
    }

    /**
     * @description Maneja la eliminación de una nota y su punto correspondiente en la barra lateral.
     * Se dispara cuando el usuario hace clic en el botón "X" de una tarjeta.
     * @param {Event} evento - El objeto del evento de clic.
     */
    function manejarEliminacion(evento) {
        // 'evento.target' es el elemento exacto donde se hizo clic
        const elementoClicado = evento.target;

        // Buscamos si el clic fue en el botón '.boton-eliminar-nota' o en su icono '<i>'
        // .closest() busca el elemento padre más cercano que coincida con el selector
        const botonEliminar = elementoClicado.closest('.boton-eliminar-nota');

        if (botonEliminar) {
            // ¡Sí se hizo clic en un botón de eliminar!

            // Obtenemos la tarjeta padre de ese botón
            const tarjetaParaEliminar = botonEliminar.closest('.tarjeta-nota');

            // Obtenemos el ID de esa tarjeta (ej: "nota-1")
            const idNotaParaEliminar = tarjetaParaEliminar.id;

            // Derivamos el ID del punto correspondiente (ej: "punto-1")
            // Hacemos un replace: "nota-1" -> "punto-1"
            const idPuntoParaEliminar = idNotaParaEliminar.replace('nota-', 'punto-');

            // Buscamos el contenedor del punto (item-punto-nota) en la barra lateral
            const itemPuntoParaEliminar = document.getElementById(`item-${idPuntoParaEliminar}`);

            // Aplicamos la animación de desvanecer a la tarjeta
            tarjetaParaEliminar.classList.add('desvanecer');

            // Después de 300ms (lo que dura la animación), eliminamos la tarjeta del DOM
            setTimeout(() => {
                tarjetaParaEliminar.remove();
            }, 300);

            // Hacemos lo mismo para el item del punto en la barra lateral
            if (itemPuntoParaEliminar) {
                itemPuntoParaEliminar.classList.add('desvanecer');
                setTimeout(() => {
                    itemPuntoParaEliminar.remove();
                }, 300);
            }
        }
    }

    /**
     * @description Función para cargar algunas notas iniciales al abrir la página.
     * Esto hace que la aplicación no se vea vacía cuando el usuario entra por primera vez.
     */
    function cargarNotasIniciales() {
        // Creamos 3 notas de ejemplo
        for (let i = 0; i < 3; i++) {
            agregarNuevaNota();
        }
    }

    // --- 3. ASIGNACIÓN DE EVENTOS (EVENT LISTENERS) ---

    // Evento para el botón de "Agregar Nota"
    // Cuando el usuario hace clic, se crea una nota nueva
    botonAgregarNota.addEventListener('click', agregarNuevaNota);

    // Evento para la eliminación (Delegación de eventos en el grid)
    // Escuchamos los clics en el grid y buscamos si fue en un botón de eliminar
    gridNotas.addEventListener('click', manejarEliminacion);

    // --- 4. EJECUCIÓN INICIAL ---

    // Llamamos a la función para cargar las notas iniciales cuando se carga la página
    cargarNotasIniciales();

}); // <-- FIN DEL 'DOMContentLoaded'