export const up = (pgm) => {
  pgm.createTable('personalWorkouts', {
    id: 'id',
    title: { type: 'text', notNull: true },
    userId: { type: 'integer', references: '"users"', notNull: true },
    createdAt: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
      notNull: true,
    },
    deletedAt: {
      type: 'timestamp',
    },
  });
  pgm.createType('daysOfWeek', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);

  pgm.createTable('personalWorkoutDays', {
    id: 'id',
    personalWorkoutId: {
      type: 'integer',
      references: '"personalWorkouts"',
      notNull: true,
      onDelete: 'cascade',
    },
    daysOfWeek: {
      type: '"daysOfWeek"[]',
      notNull: true,
      default: '{}',
    },
  });
  pgm.createTable('planExercises', {
    id: 'id',
    personalWorkoutId: {
      type: 'integer',
      references: '"personalWorkouts"',
      notNull: true,
      onDelete: 'cascade',
    },
    exerciseId: {
      type: 'integer',
      references: '"exercises"',
      onDelete: 'CASCADE',
      notNull: true,
    },
    sets: { type: 'integer', default: 1, notNull: true },
    reps: { type: 'integer', default: 1, notNull: true },
    orderIndex: { type: 'integer', notNull: true },
    deletedAt: {
      type: 'timestamp',
    },
  });
  pgm.createTable('workoutSessions', {
    id: 'id',
    personalWorkoutId: { type: 'integer', references: '"personalWorkouts"', notNull: true },
    mark: { type: 'integer', default: 1, notNull: true },
    startedAt: {
      type: 'timestamp',
    },
    finishedAt: {
      type: 'timestamp',
    },
  });
  pgm.createTable('workoutSessionExercises', {
    id: 'id',
    workoutSessionId: { type: 'integer', references: '"workoutSessions"', notNull: true },
    planExerciseId: { type: 'integer', references: '"planExercises"', notNull: true },
    sets: { type: 'integer', default: 1 },
    reps: { type: 'integer', default: 1 },
    isPassed: {
      type: 'boolean',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('workoutSessionExercises');
  pgm.dropTable('workoutSessions');
  pgm.dropTable('planExercises');
  pgm.dropTable('personalWorkoutDays');
  pgm.dropType('daysOfWeek');
  pgm.dropTable('personalWorkouts');
};
