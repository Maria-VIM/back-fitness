export const up = (pgm) => {
  pgm.createTable('groups', {
    id: 'id',
    name: { type: 'text', notNull: true },
  });

  pgm.createTable('categories', {
    id: 'id',
    name: { type: 'text', notNull: true },
    groupId: {
      type: 'integer',
      references: '"groups"',
      onDelete: 'CASCADE',
      notNull: true,
    },
  });

  pgm.createTable('exercises', {
    id: 'id',
    title: { type: 'text', notNull: true },
    content: { type: 'text', notNull: true },
    imagePath: { type: 'text' },
    during: { type: 'integer', notNull: true },
    createdAt: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
      notNull: true,
    },
    deletedAt: {
      type: 'timestamp',
    },
  });

  pgm.createTable('exercisesCategory', {
    id: 'id',
    exerciseId: {
      type: 'integer',
      references: '"exercises"',
      onDelete: 'CASCADE',
      notNull: true,
    },
    categoryId: {
      type: 'integer',
      references: '"categories"',
      onDelete: 'CASCADE',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('exercisesCategory');
  pgm.dropTable('exercises');
  pgm.dropTable('categories');
  pgm.dropTable('groups');
};
