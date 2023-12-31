import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtConfigModule } from './config/typeorm/jwt.module';
import { TypeormConfigModule } from './config/typeorm/typeorm.module';
import { UserModule } from './user/user.module';

const ENV = process.env.NEST_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env.dev' : `.env.${ENV}`,
    }),
    TypeormConfigModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
