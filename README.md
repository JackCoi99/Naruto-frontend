# Naruto API | Frontend

Interfaz web desarrollada con **HTML, CSS y JavaScript** para gestionar personajes del universo Naruto mediante una API REST.

La aplicación permite visualizar, crear, editar y eliminar personajes desde el navegador, comunicándose con un backend independiente desarrollado con FastAPI.

## Tecnologías utilizadas

- **HTML5:** estructura y contenido de la aplicación.
- **CSS3:** diseño visual, estilos y adaptación a diferentes pantallas.
- **JavaScript:** lógica e interactividad de la interfaz.
- **Fetch API:** comunicación HTTP con el backend.
- **Git y GitHub:** control de versiones.

El proyecto utiliza tecnologías web nativas, sin frameworks de frontend.

## Funcionalidades

La aplicación permite:

- Consultar los personajes registrados en la base de datos.
- Visualizar la información de cada personaje.
- Crear nuevos personajes mediante un formulario.
- Editar los datos de personajes existentes.
- Actualizar parcialmente la información de un personaje.
- Eliminar personajes.
- Mostrar los resultados de las operaciones realizadas mediante la API.

## Estructura del proyecto

```text
naruto-frontend/
├── index.html
├── style.css
├── script.js
├── .gitignore
└── README.md
```

### Organización de los archivos

- `index.html`: estructura principal de la interfaz.
- `style.css`: estilos, colores y diseño adaptable.
- `script.js`: comunicación con la API y gestión de las operaciones CRUD.
- `.gitignore`: exclusión de archivos innecesarios.
- `README.md`: documentación del proyecto.

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/naruto-frontend.git
cd naruto-frontend
```

### 2. Abrir el proyecto

Abre la carpeta en Visual Studio Code.

### 3. Iniciar el frontend

Puedes utilizar la extensión **Live Server** de Visual Studio Code.

1. Abre `index.html`.
2. Haz clic derecho sobre el archivo.
3. Selecciona **Open with Live Server**.

Normalmente, la aplicación estará disponible en:

`http://127.0.0.1:5500`

## Conexión con el backend

Este frontend necesita que la API de FastAPI esté ejecutándose para poder consultar y modificar los personajes.

La dirección del backend está configurada en `script.js`:

```javascript
const API_URL = "http://127.0.0.1:8000";
```

Las peticiones se realizan mediante `fetch()` utilizando los métodos HTTP correspondientes.

Por ejemplo:

```javascript
fetch(`${API_URL}/characters`)
```

Para utilizar todas las funcionalidades, es necesario ejecutar ambos proyectos:

| Proyecto | Dirección local |
|---|---|
| Frontend | `http://127.0.0.1:5500` |
| Backend | `http://127.0.0.1:8000` |
| Swagger UI | `http://127.0.0.1:8000/docs` |

Si el backend no está iniciado, el frontend no podrá recuperar ni modificar los datos.

## Operaciones CRUD

La interfaz se comunica con los siguientes endpoints:

| Operación | Método HTTP | Endpoint |
|---|---|---|
| Consultar personajes | GET | `/characters` |
| Consultar un personaje | GET | `/characters/{id}` |
| Crear un personaje | POST | `/characters` |
| Actualizar un personaje | PUT | `/characters/{id}` |
| Modificar datos | PATCH | `/characters/{id}` |
| Eliminar un personaje | DELETE | `/characters/{id}` |

## Datos de los personajes

Los formularios permiten gestionar información como:

- Nombre.
- Edad.
- Aldea.
- Rango ninja.
- Clan.
- Naturaleza del chakra.

Los datos se envían al backend en formato JSON.

## Diseño de la interfaz

La aplicación utiliza una identidad visual basada en tonos azules, fondos claros y tarjetas para organizar la información.

El diseño busca ofrecer:

- Navegación sencilla.
- Formularios claros.
- Botones diferenciados según su función.
- Presentación organizada de los personajes.
- Adaptación a diferentes tamaños de pantalla.

## Backend del proyecto

La API REST está desarrollada con Python, FastAPI, SQLAlchemy y SQLite.

Repositorio del backend:

`https://github.com/TU_USUARIO/naruto-backend`

Documentación interactiva del backend en ejecución:

`http://127.0.0.1:8000/docs`

## Objetivo del proyecto

Este proyecto se ha desarrollado como ejercicio práctico para aprender:

- Manipulación del DOM con JavaScript.
- Consumo de APIs REST.
- Peticiones HTTP mediante Fetch API.
- Gestión de formularios.
- Operaciones CRUD desde una interfaz web.
- Separación entre frontend y backend.
- Organización y publicación de proyectos en GitHub.
