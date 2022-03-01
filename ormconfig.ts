export default {
  type: 'mssql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  connectionTimeout: 30000, // 30 seconds
  logging: true,
  autoLoadEntities: true,
  entities: ['src/**/*entity.ts'],
  synchronize: false,
  migrations: ['src/migration/*.ts'],
  seeds: ['src/typeorm-seeding/seed/**/*{.ts,.js}'],
  factories: ['src/typeorm-seeding/factory/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migration',
  },
  options: {
    encrypt: false,
  },
};
