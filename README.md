# MiniAula

Plataforma web de cursos cortos: los instructores crean cursos con lecciones y cuestionarios, y los estudiantes avanzan lección por lección.

Proyecto final de Ingeniería Web 2.

## Tecnologías

- **API:** Node.js, Express, Sequelize, MySQL
- **Web:** React con Vite
- **Despliegue:** Docker Compose

## Cómo levantar el proyecto

Solo se necesita Docker.

```bash
cp .env.example .env
docker compose up --build
```

- Web: http://localhost:8080
- API: http://localhost:3001/api

## Cómo cargar datos de prueba (Seed)

Con los contenedores en ejecución, ejecuta en tu terminal:

```bash
docker compose exec api npm run seed
```

### Usuarios de prueba cargados en el Seed

Todos los usuarios tienen la contraseña: `password123`

| Rol | Nombre | Email |
|---|---|---|
| Instructor | Ana Pérez | `ana.perez@miniaula.com` |
| Instructor | Luis Rojas | `luis.rojas@miniaula.com` |
| Estudiante | Juan Pérez | `juan.perez@miniaula.com` |
| Estudiante | María Gómez | `maria.gomez@miniaula.com` |
| Estudiante | Lucas Fernández | `lucas.fernandez@miniaula.com` |

## Estructura

```
api/   API REST
web/   Frontend en React
```
