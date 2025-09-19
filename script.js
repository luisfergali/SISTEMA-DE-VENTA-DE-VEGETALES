// POO: Definimos la clase Vegetal
class Vegetal {
  constructor(id, nombre, cantidad, precio) {
    this.id = id;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precio = precio;
  }
}

// POO: Definimos la clase Bodega
class Bodega {
  constructor() {
    this.vegetales = [];
  }

  cargarVegetales() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.vegetales = [
          new Vegetal(1, 'Tomate', 50, 1.50),
          new Vegetal(2, 'Lechuga', 20, 2.00),
          new Vegetal(3, 'Papa', 150, 0.75),
          new Vegetal(4, 'Cebolla', 80, 1.00),
        ];
        resolve(this.vegetales);
      }, 1000);
    });
  }

  agregarVegetal(nombre, cantidad, precio) {
    const nuevoId = this.vegetales.length > 0 ? Math.max(...this.vegetales.map(v => v.id)) + 1 : 1;
    const nuevoVegetal = new Vegetal(nuevoId, nombre, cantidad, precio);
    this.vegetales.push(nuevoVegetal);
    return nuevoVegetal;
  }

  actualizarVegetal(id, nombre, cantidad, precio) {
    const vegetalIndex = this.vegetales.findIndex(v => v.id === id);
    if (vegetalIndex !== -1) {
      this.vegetales[vegetalIndex].nombre = nombre;
      this.vegetales[vegetalIndex].cantidad = cantidad;
      this.vegetales[vegetalIndex].precio = precio;
    }
    return this.vegetales[vegetalIndex];
  }

  eliminarVegetal(id) {
    this.vegetales = this.vegetales.filter(v => v.id !== id);
  }
  
  venderVegetales(listaVenta) {
    let ventaExitosa = true;
    for (const item of listaVenta) {
      const vegetal = this.vegetales.find(v => v.id === item.id);
      if (vegetal && vegetal.cantidad >= item.cantidad) {
        vegetal.cantidad -= item.cantidad;
      } else {
        ventaExitosa = false;
        alert(`Error: La cantidad de ${vegetal.nombre} no es suficiente. Disponible: ${vegetal.cantidad} kg.`);
        break;
      }
    }
    return ventaExitosa;
  }
}

// 3. Instanciamos la Bodega y seleccionamos elementos del DOM
const bodega = new Bodega();
const navButtons = document.querySelectorAll('.nav-btn');
const contentSections = document.querySelectorAll('.content-section');
const form = document.getElementById('vegetal-form');
const listaVegetales = document.getElementById('lista-vegetales');
const submitBtn = document.getElementById('submit-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const precioInput = document.getElementById('precio');

// Nuevos elementos para la venta
const ventaSearchInput = document.getElementById('venta-search-input');
const datalistSugerencias = document.getElementById('vegetal-sugerencias'); // Seleccionamos el datalist
const ventaCantidadInput = document.getElementById('venta-cantidad-input');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const listaCompra = document.getElementById('lista-compra');
const totalProductosSpan = document.getElementById('total-productos-venta');
const totalVentaSpan = document.getElementById('total-venta');
const confirmarVentaBtn = document.getElementById('confirmar-venta-btn');
const vaciarVentaBtn = document.getElementById('vaciar-venta-btn');

// Variable para el estado de la venta
let ventaActual = [];

// 4. Lógica para renderizar la interfaz
const renderizarVegetales = (vegetales) => {
  listaVegetales.innerHTML = '';
  vegetales.forEach(vegetal => {
    const li = document.createElement('li');
    li.className = 'vegetal-item';
    li.innerHTML = `
      <div class="vegetal-info">
        <h3>${vegetal.nombre}</h3>
        <p>Cantidad: ${vegetal.cantidad} kg</p>
        <p>Precio: $${vegetal.precio.toFixed(2)}/kg</p>
      </div>
      <div class="btn-container">
        <button class="edit-btn" data-id="${vegetal.id}">Editar</button>
        <button class="delete-btn" data-id="${vegetal.id}">Eliminar</button>
      </div>
    `;
    listaVegetales.appendChild(li);
  });
};

const renderizarListaCompra = () => {
    listaCompra.innerHTML = '';
    let total = 0;
    let totalProductos = 0;

    ventaActual.forEach(item => {
        const vegetal = bodega.vegetales.find(v => v.id === item.id);
        if (vegetal) {
            const subtotal = item.cantidad * vegetal.precio;
            total += subtotal;
            totalProductos += item.cantidad;
            const li = document.createElement('li');
            li.innerHTML = `
                <h3>${vegetal.nombre}</h3>
                <span>${item.cantidad} kg x $${vegetal.precio.toFixed(2)} = $${subtotal.toFixed(2)}</span>
            `;
            listaCompra.appendChild(li);
        }
    });

    totalProductosSpan.textContent = totalProductos;
    totalVentaSpan.textContent = `$${total.toFixed(2)}`;
};

// Nueva función para llenar el datalist
const popularDatalist = () => {
    datalistSugerencias.innerHTML = '';
    bodega.vegetales.forEach(vegetal => {
        const option = document.createElement('option');
        option.value = vegetal.nombre;
        datalistSugerencias.appendChild(option);
    });
};

// ... (El resto de las funciones se mantienen igual)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('vegetal-id').value;
    const nombre = document.getElementById('nombre').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const precio = parseFloat(document.getElementById('precio').value);

    if (id) {
        bodega.actualizarVegetal(parseInt(id), nombre, cantidad, precio);
        submitBtn.textContent = 'Agregar Vegetal';
        document.getElementById('vegetal-id').value = '';
    } else {
        bodega.agregarVegetal(nombre, cantidad, precio);
    }
    form.reset();
});

listaVegetales.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = parseInt(e.target.dataset.id);
        bodega.eliminarVegetal(id);
        renderizarVegetales(bodega.vegetales);
    }
    
    if (e.target.classList.contains('edit-btn')) {
        const id = parseInt(e.target.dataset.id);
        const vegetalAEditar = bodega.vegetales.find(v => v.id === id);
        if (vegetalAEditar) {
            document.getElementById('vegetal-id').value = vegetalAEditar.id;
            document.getElementById('nombre').value = vegetalAEditar.nombre;
            document.getElementById('cantidad').value = vegetalAEditar.cantidad;
            document.getElementById('precio').value = vegetalAEditar.precio;
            submitBtn.textContent = 'Actualizar Vegetal';
        }
    }
});

searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        renderizarVegetales(bodega.vegetales);
        return;
    }
    
    const resultadosBusqueda = bodega.vegetales.filter(vegetal => {
        return vegetal.nombre.toLowerCase().includes(searchTerm);
    });
    
    renderizarVegetales(resultadosBusqueda);
});

// Lógica para el nuevo flujo de venta (actualizado para usar el datalist)
addToCartBtn.addEventListener('click', () => {
    const searchTerm = ventaSearchInput.value.trim(); // No se convierte a minúsculas para un match exacto
    const cantidad = parseInt(ventaCantidadInput.value);

    if (!searchTerm || cantidad <= 0 || isNaN(cantidad)) {
        alert("Por favor, selecciona un producto y una cantidad válida.");
        return;
    }

    const vegetalEncontrado = bodega.vegetales.find(v => v.nombre === searchTerm);
    if (!vegetalEncontrado) {
        alert("Producto no encontrado en el inventario.");
        return;
    }

    if (cantidad > vegetalEncontrado.cantidad) {
        alert(`No hay suficiente stock de ${vegetalEncontrado.nombre}. Cantidad disponible: ${vegetalEncontrado.cantidad} kg.`);
        return;
    }

    const itemEnCarrito = ventaActual.find(item => item.id === vegetalEncontrado.id);
    if (itemEnCarrito) {
        itemEnCarrito.cantidad += cantidad;
    } else {
        ventaActual.push({ id: vegetalEncontrado.id, cantidad: cantidad });
    }

    ventaSearchInput.value = '';
    ventaCantidadInput.value = 0;
    renderizarListaCompra();
});

confirmarVentaBtn.addEventListener('click', () => {
    if (ventaActual.length === 0) {
        alert("El carrito de ventas está vacío.");
        return;
    }

    const exito = bodega.venderVegetales(ventaActual);
    if (exito) {
        alert("Venta confirmada y stock actualizado.");
        ventaActual = [];
        renderizarListaCompra();
    }
});

vaciarVentaBtn.addEventListener('click', () => {
    ventaActual = [];
    renderizarListaCompra();
    alert("Venta vaciada.");
});

// Lógica asíncrona: Cargar datos y configurar eventos al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Cargando inventario...');
    try {
        await bodega.cargarVegetales();
        console.log('Inventario cargado exitosamente.');
    } catch (error) {
        console.error('Error al cargar el inventario:', error);
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showSection(btn.dataset.section);
        });
    });
    
    showSection('home');
});

// Lógica de la SPA: Muestra y oculta secciones
const showSection = (sectionId) => {
    contentSections.forEach(section => {
        section.classList.remove('active');
    });

    document.getElementById(sectionId + '-section').classList.add('active');
    
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionId) {
            btn.classList.add('active');
        }
    });

    if (sectionId === 'inventory') {
        renderizarVegetales(bodega.vegetales);
    } else if (sectionId === 'venta') {
        popularDatalist(); // Llenamos el datalist cuando se abre la sección de venta
        renderizarListaCompra();
    }
};