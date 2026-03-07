import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.user.updateMany({
    where: { email: { in: ['abdullah@bxb-om.com', 'amna@muznalkair.com'] } },
    data: { role: 'ADMIN' },
  });
  console.log('Updated', updated.count, 'users to ADMIN');
  await prisma.$disconnect();
}

main().catch(console.error);
