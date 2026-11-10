const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Contraseña compartida para todos los usuarios de prueba: "password123"
    // Usamos bcryptjs con costo 10 tal como se definio en el plan del proyecto
    const passwordHash = bcrypt.hashSync('password123', 10);
    const ahora = new Date();

    // ==========================================
    // 1. USUARIOS (2 instructores y 3 estudiantes)
    // ==========================================
    await queryInterface.bulkInsert('usuarios', [
      {
        id: 1,
        nombre: 'Ana Pérez',
        email: 'ana.perez@miniaula.com',
        passwordHash: passwordHash,
        rol: 'instructor',
        creadoEn: ahora,
      },
      {
        id: 2,
        nombre: 'Luis Rojas',
        email: 'luis.rojas@miniaula.com',
        passwordHash: passwordHash,
        rol: 'instructor',
        creadoEn: ahora,
      },
      {
        id: 3,
        nombre: 'Juan Pérez',
        email: 'juan.perez@miniaula.com',
        passwordHash: passwordHash,
        rol: 'estudiante',
        creadoEn: ahora,
      },
      {
        id: 4,
        nombre: 'María Gómez',
        email: 'maria.gomez@miniaula.com',
        passwordHash: passwordHash,
        rol: 'estudiante',
        creadoEn: ahora,
      },
      {
        id: 5,
        nombre: 'Lucas Fernández',
        email: 'lucas.fernandez@miniaula.com',
        passwordHash: passwordHash,
        rol: 'estudiante',
        creadoEn: ahora,
      },
    ]);

    // ==========================================
    // 2. CURSOS (3 cursos en estado publicado)
    // ==========================================
    await queryInterface.bulkInsert('cursos', [
      {
        id: 1,
        titulo: 'Node.js desde cero',
        descripcion: 'Aprende a construir aplicaciones y APIs REST profesionales con Node.js y Express.',
        categoria: 'Programación',
        nivel: 'basico',
        estado: 'publicado',
        instructorId: 1,
        creadoEn: ahora,
      },
      {
        id: 2,
        titulo: 'Diseño UI con Figma',
        descripcion: 'Domina los conceptos de diseño de interfaces modernas, auto layout y componentes.',
        categoria: 'Diseño',
        nivel: 'intermedio',
        estado: 'publicado',
        instructorId: 2,
        creadoEn: ahora,
      },
      {
        id: 3,
        titulo: 'Inglés para devs',
        descripcion: 'Aprende vocabulario técnico clave para comunicarte en equipos globales y leer documentación.',
        categoria: 'Idiomas',
        nivel: 'basico',
        estado: 'publicado',
        instructorId: 1,
        creadoEn: ahora,
      },
    ]);

    // ==========================================
    // 3. LECCIONES (5 lecciones por cada curso)
    // ==========================================
    await queryInterface.bulkInsert('lecciones', [
      // Curso 1: Node.js desde cero (4 contenido + 1 cuestionario)
      {
        id: 1,
        titulo: '1. Introducción a Node.js',
        tipo: 'contenido',
        contenido: 'Node.js es un entorno de ejecución para JavaScript construido con el motor V8 de Chrome. Permite ejecutar JavaScript fuera del navegador, ideal para construir servidores y herramientas de desarrollo.',
        videoUrl: 'https://www.youtube.com/watch?v=yB4n_K7dZV8',
        orden: 1,
        notaMinima: null,
        cursoId: 1,
      },
      {
        id: 2,
        titulo: '2. Instalar Node.js y npm',
        tipo: 'contenido',
        contenido: 'Revisaremos la instalación oficial de Node.js mediante LTS y el uso básico del gestor de paquetes npm para iniciar un nuevo proyecto con npm init.',
        videoUrl: 'https://www.youtube.com/watch?v=yB4n_K7dZV8',
        orden: 2,
        notaMinima: null,
        cursoId: 1,
      },
      {
        id: 3,
        titulo: '3. Express básico',
        tipo: 'contenido',
        contenido: 'Express es el framework web minimalista más popular de Node.js. Aprenderemos a crear rutas GET, POST, usar middlewares y enviar respuestas JSON.',
        videoUrl: 'https://www.youtube.com/watch?v=yB4n_K7dZV8',
        orden: 3,
        notaMinima: null,
        cursoId: 1,
      },
      {
        id: 4,
        titulo: '4. Cuestionario 1: Express básico',
        tipo: 'cuestionario',
        contenido: null,
        videoUrl: null,
        orden: 4,
        notaMinima: 70,
        cursoId: 1,
      },
      {
        id: 5,
        titulo: '5. APIs REST',
        tipo: 'contenido',
        contenido: 'Diseño de endpoints siguiendo las convenciones REST: uso de sustantivos en plural, códigos de estado HTTP correctos (200, 201, 404, 500) y separación de responsabilidades.',
        videoUrl: 'https://www.youtube.com/watch?v=yB4n_K7dZV8',
        orden: 5,
        notaMinima: null,
        cursoId: 1,
      },

      // Curso 2: Diseño UI con Figma (4 contenido + 1 cuestionario)
      {
        id: 6,
        titulo: '1. Principios del diseño de interfaces',
        tipo: 'contenido',
        contenido: 'Aprenderemos los conceptos fundamentales de jerarquía visual, contraste, alineación y consistencia en el diseño de interfaces de usuario.',
        videoUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
        orden: 1,
        notaMinima: null,
        cursoId: 2,
      },
      {
        id: 7,
        titulo: '2. Marcos y formas en Figma',
        tipo: 'contenido',
        contenido: 'Uso de Frames, jerarquía de capas, grupos y aplicación de sistemas de cuadrícula (grids) para organizar la pantalla.',
        videoUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
        orden: 2,
        notaMinima: null,
        cursoId: 2,
      },
      {
        id: 8,
        titulo: '3. Auto Layout fluido',
        tipo: 'contenido',
        contenido: 'El motor de Auto Layout permite crear componentes que se adaptan automáticamente al tamaño del contenido y a pantallas responsivas.',
        videoUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
        orden: 3,
        notaMinima: null,
        cursoId: 2,
      },
      {
        id: 9,
        titulo: '4. Cuestionario 1: Auto Layout',
        tipo: 'cuestionario',
        contenido: null,
        videoUrl: null,
        orden: 4,
        notaMinima: 70,
        cursoId: 2,
      },
      {
        id: 10,
        titulo: '5. Componentes y variantes',
        tipo: 'contenido',
        contenido: 'Creación de componentes reutilizables como botones y tarjetas, y definición de variantes para estados hover, activo y deshabilitado.',
        videoUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
        orden: 5,
        notaMinima: null,
        cursoId: 2,
      },

      // Curso 3: Inglés para devs (4 contenido + 1 cuestionario)
      {
        id: 11,
        titulo: '1. Vocabulario técnico esencial',
        tipo: 'contenido',
        contenido: 'Palabras y verbos más comunes en desarrollo: deploy, merge, pull request, bug, refactor, benchmark y staging.',
        videoUrl: 'https://www.youtube.com/watch?v=4p_1M4b9yqk',
        orden: 1,
        notaMinima: null,
        cursoId: 3,
      },
      {
        id: 12,
        titulo: '2. Lectura de documentación en inglés',
        tipo: 'contenido',
        contenido: 'Estrategias para comprender rápidamente la documentación oficial de librerías, mensajes de error y respuestas en foros técnicos.',
        videoUrl: 'https://www.youtube.com/watch?v=4p_1M4b9yqk',
        orden: 2,
        notaMinima: null,
        cursoId: 3,
      },
      {
        id: 13,
        titulo: '3. Redacción de Pull Requests y commits',
        tipo: 'contenido',
        contenido: 'Cómo escribir resúmenes claros en inglés para que compañeros internacionales entiendan los cambios introducidos.',
        videoUrl: 'https://www.youtube.com/watch?v=4p_1M4b9yqk',
        orden: 3,
        notaMinima: null,
        cursoId: 3,
      },
      {
        id: 14,
        titulo: '4. Cuestionario 1: Términos técnicos',
        tipo: 'cuestionario',
        contenido: null,
        videoUrl: null,
        orden: 4,
        notaMinima: 80,
        cursoId: 3,
      },
      {
        id: 15,
        titulo: '5. Participación en Daily Standups',
        tipo: 'contenido',
        contenido: 'Frases clave para comunicar en qué trabajaste ayer, en qué trabajarás hoy y si tienes algún bloqueo (blocker).',
        videoUrl: 'https://www.youtube.com/watch?v=4p_1M4b9yqk',
        orden: 5,
        notaMinima: null,
        cursoId: 3,
      },
    ]);

    // ==========================================
    // 4. PREGUNTAS PARA LOS CUESTIONARIOS
    // ==========================================
    await queryInterface.bulkInsert('preguntas', [
      // Preguntas para el Cuestionario del Curso 1 (Leccion id 4)
      {
        id: 1,
        enunciado: '¿Qué método HTTP se utiliza habitualmente para crear un nuevo recurso en una API REST?',
        opciones: JSON.stringify(['GET', 'POST', 'PUT', 'DELETE']),
        indiceCorrecto: 1, // POST
        leccionId: 4,
      },
      {
        id: 2,
        enunciado: '¿Qué código de estado HTTP indica que un recurso fue creado exitosamente?',
        opciones: JSON.stringify(['200 OK', '201 Created', '400 Bad Request', '404 Not Found']),
        indiceCorrecto: 1, // 201 Created
        leccionId: 4,
      },

      // Preguntas para el Cuestionario del Curso 2 (Leccion id 9)
      {
        id: 3,
        enunciado: '¿Cuál es la función principal de Auto Layout en Figma?',
        opciones: JSON.stringify([
          'Generar animaciones 3D',
          'Alinear y organizar elementos automáticamente adaptándose al tamaño',
          'Exportar archivos a formato PDF',
          'Compilar código JavaScript'
        ]),
        indiceCorrecto: 1,
        leccionId: 9,
      },
      {
        id: 4,
        enunciado: '¿Qué propiedad controla el espacio libre entre elementos en un marco con Auto Layout?',
        opciones: JSON.stringify(['Padding', 'Gap (Spacing between items)', 'Corner radius', 'Stroke']),
        indiceCorrecto: 1,
        leccionId: 9,
      },

      // Preguntas para el Cuestionario del Curso 3 (Leccion id 14)
      {
        id: 5,
        enunciado: 'En desarrollo de software, ¿a qué se refiere el término "Deploy"?',
        opciones: JSON.stringify([
          'Poner en funcionamiento la aplicación en un servidor o producción',
          'Borrar toda la base de datos',
          'Corregir un error ortográfico en el código',
          'Apagar la máquina de desarrollo'
        ]),
        indiceCorrecto: 0,
        leccionId: 14,
      },
      {
        id: 6,
        enunciado: '¿Qué significa el término "Merge" al trabajar con ramas en Git?',
        opciones: JSON.stringify([
          'Descartar todos los cambios locales',
          'Fusionar los cambios de una rama con otra',
          'Clonar un repositorio remoto',
          'Cambiar el nombre del autor de un commit'
        ]),
        indiceCorrecto: 1,
        leccionId: 14,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Revertimos en orden inverso para respetar las restricciones de llaves foraneas
    await queryInterface.bulkDelete('preguntas', null, {});
    await queryInterface.bulkDelete('lecciones', null, {});
    await queryInterface.bulkDelete('cursos', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});
  },
};
