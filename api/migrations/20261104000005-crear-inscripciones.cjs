module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inscripciones', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      estudianteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onDelete: 'RESTRICT',
      },
      cursoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'cursos', key: 'id' },
        onDelete: 'RESTRICT',
      },
      fechaInscripcion: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      completado: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    });
    await queryInterface.addIndex('inscripciones', ['estudianteId', 'cursoId'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inscripciones');
  },
};
