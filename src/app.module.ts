import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'ticket-flow-30', 'dist'),
      serveRoot: '/',
      exclude: ['/tickets*', '/health', '/docs*', '/api-json'],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TicketsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
