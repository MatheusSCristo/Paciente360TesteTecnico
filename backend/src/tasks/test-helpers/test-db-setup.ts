import { PrismaClient } from '@prisma/client';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';

export class TestDatabaseSetup {
  private container: StartedPostgreSqlContainer | null = null;
  private prisma: PrismaClient | null = null;

  async setup(): Promise<PrismaClient> {
    try {
      this.container = await new PostgreSqlContainer('postgres:16-alpine')
        .withExposedPorts(5432)
        .withDatabase('test_db')
        .withUsername('test_user')
        .withPassword('test_password')
        .start();

      const connectionUri = this.container.getConnectionUri();
      console.log('Container PostgreSQL iniciado!');

      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: connectionUri,
          },
        },
      });

      await this.prisma.$connect();

      execSync('npx prisma migrate deploy', {
        env: {
          ...process.env,
          DATABASE_URL: connectionUri,
        },
        stdio: 'inherit',
      });

      return this.prisma;
    } catch (error) {
      console.error('Erro ao configurar banco de testes:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    if (!this.prisma) return;

    try {
      await this.prisma.task.deleteMany();
    } catch (error) {
      console.error('Erro ao limpar banco de testes:', error);
    }
  }

  async teardown(): Promise<void> {
    try {
      if (this.prisma) {
        await this.prisma.$disconnect();
        console.log('Prisma desconectado');
      }

      if (this.container) {
        await this.container.stop();
        console.log('Container PostgreSQL parado');
      }
    } catch (error) {
      console.error('Erro ao desconectar do banco de testes:', error);
    }
  }

  getPrismaClient(): PrismaClient {
    if (!this.prisma) {
      throw new Error(
        'Prisma Client não inicializado. Execute setup() primeiro.',
      );
    }
    return this.prisma;
  }

  getConnectionUri(): string {
    if (!this.container) {
      throw new Error('Container não inicializado. Execute setup() primeiro.');
    }
    return this.container.getConnectionUri();
  }
}
