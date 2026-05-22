export const up = (pgm) => {
  pgm.createType('exercisePlace', ['home', 'gym', 'both']);
  pgm.addColumn('exercises', {
    difficulty: {
      type: 'integer',
      default: 0,
      notNull: true,
    },
    place: {
      type: '"exercisePlace"',
      notNull: true,
      default: 'both',
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumn('exercises', 'difficulty');
  pgm.dropColumn('exercises', 'place');
  pgm.dropType('exercisePlace');
};
