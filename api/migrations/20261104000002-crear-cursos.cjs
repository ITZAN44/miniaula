module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cursos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      titulo: { type: Sequelize.STRING(150), allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: false },
      categoria: { type: Sequelize.STRING(50), allowNull: false },
      nivel: { type: Sequelize.ENUM('basico', 'intermedio', 'avanzado'), allowNull: false },
      estado: {
        type: Sequelize.ENUM('borrador', 'publicado', 'archivado'),
        allowNull: false,
        defaultValue: 'borrador',
      },
      instructorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onDelete: 'RESTRICT',
      },
      creadoEn: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cursos');
  },
};
