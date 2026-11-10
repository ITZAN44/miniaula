import app from './app.js';
import sequelize from './config/sequelize.js';

const port = process.env.PORT || 3000;

await sequelize.authenticate();

app.listen(port, () => {
  console.log(`API escuchando en el puerto ${port}`);
});
