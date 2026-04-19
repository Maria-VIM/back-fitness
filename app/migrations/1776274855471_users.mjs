export const up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    username: { type: 'text', notNull: true },
    birthday: { type: 'timestamp', notNull: true },
    email: { type: 'text', notNull: true },
    passwordHash: { type: 'text', notNull: true },
    verificationCode: { type: 'string' },
    verificationCodeExpiresAt: { type: 'timestamp' },
    isVerified: { type: 'boolean', notNull: true, default: false },
    isAdmin: { type: 'boolean', notNull: true, default: false },
    createdAt: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('users');
};
