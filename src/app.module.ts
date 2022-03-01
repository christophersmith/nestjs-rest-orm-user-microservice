import { Module } from '@nestjs/common';
import { OrmModule } from './orm/orm.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, OrmModule],
})
export class AppModule {}
