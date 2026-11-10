module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('preguntas', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      enunciado: { type: Sequelize.TEXT, allowNull: false },
      opciones: { type: Sequelize.JSON, allowNull: false },
      indiceCorrecto: { type: Sequelize.INTEGER, allowNull: false },
      leccionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'lecciones', key: 'id' },
        onDelete: 'CASCADE',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('preguntas');
  },
};
