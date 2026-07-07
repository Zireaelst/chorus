import { PrismaClient } from '@prisma/client';
// @ts-ignore
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { AuditService } from '../../api/src/audit/audit.service';
import { PrismaService } from '../../api/src/prisma/prisma.service';

const connectionString = process.env.DATABASE_URL || "postgresql://chorus:chorus_dev_password@localhost:5432/chorus_dev";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

// Instantiate AuditService using PrismaClient (duck-typed as PrismaService)
export const auditService = new AuditService(prisma as unknown as PrismaService);
