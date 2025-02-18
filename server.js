// Arrancar servidor: node server.js
// Acceso desde el navegador: 

// GET /usuarios: Obtiene todos los usuarios.
// GET /usuarios/:id: Obtiene un usuario por ID.
// POST /usuarios: Crea un nuevo usuario. (Enviar JSON en el cuerpo).
// PUT /usuarios/:id: Actualiza un usuario por ID.
// DELETE /usuarios/:id: Elimina un usuario por ID.



const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressJSDocSwagger = require('express-jsdoc-swagger');

const app = express();
const port = 3000;

// Configuración de express-jsdoc-swagger
const options = {
  info: {
    version: '1.0.0',
    title: 'API de Usuarios',
    description: 'Documentación automática de la API',
    contact: {
      name: 'Tu Nombre',
      email: 'tuemail@example.com',
    },
  },
  baseDir: __dirname, // Directorio base donde está tu aplicación
  filesPattern: '*.js', // Patrón de archivos que se van a analizar
  swaggerUIPath: '/api-docs', // Ruta donde se servirá la documentación
  exposeSwaggerUI: true, // Habilitar la UI de Swagger
};

// Inicializa la documentación automática de Swagger
expressJSDocSwagger(app)(options);

// Middlewares
app.use(cors());
app.use(bodyParser.json()); // Permite recibir JSON en las solicitudes

// Rutas
/**
 * GET /
 * @summary Página de inicio
 * @return {string} 200 - Mensaje de bienvenida
 */
app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi API RESTful!');
});

// CRUD básico para un recurso (por ejemplo, "usuarios")
const usuarios = [
  { id: 1, nombre: 'Juan', email: 'juan@example.com' },
  { id: 2, nombre: 'María', email: 'maria@example.com' },
];

/**
 * GET /usuarios
 * @summary Obtiene todos los usuarios
 * @return {array<object>} 200 - Lista de usuarios
 */
app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

/**
 * GET /usuarios/{id}
 * @summary Obtiene un usuario por ID
 * @param {number} id.path.required - ID del usuario
 * @return {object} 200 - Usuario encontrado
 * @return {object} 404 - Usuario no encontrado
 */
app.get('/usuarios/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  res.json(usuario);
});

/**
 * POST /usuarios
 * @summary Crea un nuevo usuario
 * @param {object} request.body.required - Datos del nuevo usuario
 * @param {string} request.body.nombre - Nombre del usuario
 * @param {string} request.body.email - Email del usuario
 * @return {object} 201 - Usuario creado
 */
app.post('/usuarios', (req, res) => {
  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre: req.body.nombre,
    email: req.body.email,
  };
  usuarios.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

/**
 * PUT /usuarios/{id}
 * @summary Actualiza un usuario por ID
 * @param {number} id.path.required - ID del usuario a actualizar
 * @param {object} request.body - Datos del usuario actualizados
 * @param {string} request.body.nombre - Nombre del usuario
 * @param {string} request.body.email - Email del usuario
 * @return {object} 200 - Usuario actualizado
 * @return {object} 404 - Usuario no encontrado
 */
app.put('/usuarios/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  usuario.nombre = req.body.nombre || usuario.nombre;
  usuario.email = req.body.email || usuario.email;
  res.json(usuario);
});

/**
 * DELETE /usuarios/{id}
 * @summary Elimina un usuario por ID
 * @param {number} id.path.required - ID del usuario a eliminar
 * @return {string} 204 - Usuario eliminado correctamente
 * @return {object} 404 - Usuario no encontrado
 */
app.delete('/usuarios/:id', (req, res) => {
  const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  usuarios.splice(index, 1);
  res.status(204).send(); // Sin contenido
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  console.log(`Documentación disponible en http://localhost:${port}/api-docs`);
});

