module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('progresos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      inscripcionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'inscripciones', key: 'id' },
        onDelete: 'CASCADE',
      },
      leccionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'lecciones', key: 'id' },
        onDelete: 'CASCADE',
      },
      completada: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      intentos: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      mejorNota: { type: Sequelize.INTEGER, allowNull: true },
      actualizadoEn: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('progresos', ['inscripcionId', 'leccionId'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('progresos');
  },
};
