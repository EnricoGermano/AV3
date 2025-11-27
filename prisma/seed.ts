import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.aircraft.createMany({
    data: [
      { name: 'Falcon 1', manufacturer: 'AeroCorp' },
      { name: 'Falcon 2', manufacturer: 'AeroCorp' },
      { name: 'Eagle X', manufacturer: 'SkyWorks' }
    ],
    skipDuplicates: true
  });
  console.log('Seed finished');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });