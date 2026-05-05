import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  const areaCodes = [
    { code: '11' },
    { code: '16' },
    { code: '17' },
    { code: '18' },
  ];

  for (const area of areaCodes) {
    await prisma.areaCode.upsert({
      where: { code: area.code },
      update: {},
      create: area,
    });
  }

  const callingPlans = [
    { name: 'FaleMais 30', minutes: 30, exceededMinutesPercent: 10 },
    { name: 'FaleMais 60', minutes: 60, exceededMinutesPercent: 10 },
    { name: 'FaleMais 120', minutes: 120, exceededMinutesPercent: 10 },
  ];

  for (const plan of callingPlans) {
    await prisma.callingPlan.create({
      data: plan,
    });
  }

  const area11 = (await prisma.areaCode.findUnique({ where: { code: '11' } }))!;
  const area16 = (await prisma.areaCode.findUnique({ where: { code: '16' } }))!;
  const area17 = (await prisma.areaCode.findUnique({ where: { code: '17' } }))!;
  const area18 = (await prisma.areaCode.findUnique({ where: { code: '18' } }))!;

  const callingRates = [
    { originAreaId: area11.id, destinationAreaId: area16.id, ratePerMin: 1.9 },
    { originAreaId: area16.id, destinationAreaId: area11.id, ratePerMin: 2.9 },
    { originAreaId: area11.id, destinationAreaId: area17.id, ratePerMin: 1.7 },
    { originAreaId: area17.id, destinationAreaId: area11.id, ratePerMin: 2.7 },
    { originAreaId: area11.id, destinationAreaId: area18.id, ratePerMin: 0.9 },
    { originAreaId: area18.id, destinationAreaId: area11.id, ratePerMin: 1.9 },
  ];

  for (const rate of callingRates) {
    await prisma.callingRate.create({
      data: rate,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
