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

## Estructura

```
api/   API REST
web/   Frontend en React
```
