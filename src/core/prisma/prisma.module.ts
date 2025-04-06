import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global() // Torna o PrismaModule global, evitando múltiplas instâncias
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
