require('dotenv').config();

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: ['./src/**/*.entity.ts', './dist/**/*.entity.js']
};
