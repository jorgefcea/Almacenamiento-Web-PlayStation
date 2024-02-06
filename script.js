// Inicialización de Swiper para el primer slider
var swiper1 = new Swiper(".mySwiper-1", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    }
});

// Inicialización de Swiper para el segundo slider con breakpoints responsivos
var swiper2 = new Swiper(".mySwiper-2", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    },
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        520: {
            slidesPerView: 2
        },
        950: {
            slidesPerView: 3
        }
    }
});

// Seleccionar elementos del DOM relacionados con el carrito
const carrito = document.getElementById('carrito');
const elementos1 = document.getElementById('lista-1');
const elementos2 = document.getElementById('lista-2');
const elementos3 = document.getElementById('lista-3');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

// Evento que se dispara cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    cargarElementosDesdeLocalStorage(); // Cargar elementos del localStorage al carrito
    cargarEventListeners(); // Configurar event listeners
});

// Función para cargar elementos desde el localStorage al carrito
function cargarElementosDesdeLocalStorage() {
    let elementos;

    if (localStorage.getItem('elementos') === null) {
        elementos = [];
    } else {
        elementos = JSON.parse(localStorage.getItem('elementos'));
    }

    // Insertar cada elemento del localStorage al carrito
    elementos.forEach(elemento => {
        insertarCarrito(elemento);
    });
}

// Configuración de event listeners
function cargarEventListeners() {
    elementos1.addEventListener('click', comprarElemento);
    elementos2.addEventListener('click', comprarElemento);
    elementos3.addEventListener('click', comprarElemento);

    carrito.addEventListener('click', eliminarElemento);

    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
}

// Función para agregar un elemento al carrito
function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
    }
}

// Función para leer información de un elemento y agregarlo al carrito y al localStorage
function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: elemento.querySelector('.precio').textContent,
        id: elemento.querySelector('a').getAttribute('data-id')
    }

    insertarCarrito(infoElemento); // Agregar al carrito
    guardarEnLocalStorage(infoElemento); // Guardar en localStorage
}

// Función para insertar un elemento en la interfaz del carrito
function insertarCarrito(elemento) {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>
        <img src="${elemento.imagen}" width=100 >
    </td>
    <td>
        ${elemento.titulo}
    </td>
    <td>
        ${elemento.precio}
    </td>
    <td>
        <a href="#" class="borrar" data-id="${elemento.id}">X</a>
    </td>
    `;

    lista.appendChild(row);

    actualizarCantidadArticulos();
}

// Función para eliminar un elemento del carrito y del localStorage
function eliminarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar')) {
        const elementoId = e.target.getAttribute('data-id');
        const row = e.target.parentElement.parentElement;
        row.remove();
        eliminarElementoLocalStorage(elementoId);
    }

    actualizarCantidadArticulos();
}

// Función para vaciar el carrito y el localStorage
function vaciarCarrito() {
    const lista = document.querySelector('#lista-carrito tbody');
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    
    localStorage.clear(); // Vaciar el localStorage
    
    return false;
}

// Función para guardar un elemento en el localStorage
function guardarEnLocalStorage(elemento) {
    let elementos;

    if (localStorage.getItem('elementos') === null) {
        elementos = [];
    } else {
        elementos = JSON.parse(localStorage.getItem('elementos'));
    }

    elementos.push(elemento);
    localStorage.setItem('elementos', JSON.stringify(elementos, null, '\n'));
}

// Función para eliminar un elemento del localStorage usando su ID
function eliminarElementoLocalStorage(id) {
    let elementos = JSON.parse(localStorage.getItem('elementos'));

    const index = elementos.findIndex(elemento => elemento.id === id);

    if (index !== -1) {
        delete elementos[index];
        localStorage.setItem('elementos', JSON.stringify(elementos.filter(Boolean)));
    }
}

// Función para mostrar el contenido del localStorage (usada para propósitos de prueba)
function mostrarContenido() {
    const elementos = JSON.parse(localStorage.getItem('elementos'));

    if (elementos && elementos.length > 0) {
        let contenidoFormateado = '';
        elementos.forEach(elemento => {
            contenidoFormateado += `${elemento.titulo} - ${elemento.precio}\n`;
        });
        alert(`Contenido almacenado:\n\n${contenidoFormateado}`);
    } else {
        alert('LocalStorage está vacío.');
    }
}

// Función para actualizar la cantidad de artículos en el contador del carrito
function actualizarCantidadArticulos() {
    const contador = document.getElementById('contador-articulos');
    const numeroFilas = lista.getElementsByTagName('tr').length;
    contador.textContent = numeroFilas;
}