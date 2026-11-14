import app from './app.js';
import sequelize from './config/sequelize.js';

const port = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
  throw new Error('Falta la variable de entorno JWT_SECRET');
}

await sequelize.authenticate();

app.listen(port, () => {
  console.log(`API escuchando en el puerto ${port}`);
});
