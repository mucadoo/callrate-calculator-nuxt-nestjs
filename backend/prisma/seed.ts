import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ddds = [
    { code: '11' },
    { code: '16' },
    { code: '17' },
    { code: '18' },
  ];

  for (const ddd of ddds) {
    await prisma.dDD.upsert({
      where: { code: ddd.code },
      update: {},
      create: ddd,
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

  const ddd11 = await prisma.dDD.findUnique({ where: { code: '11' } });
  const ddd16 = await prisma.dDD.findUnique({ where: { code: '16' } });
  const ddd17 = await prisma.dDD.findUnique({ where: { code: '17' } });
  const ddd18 = await prisma.dDD.findUnique({ where: { code: '18' } });

  const callingRates = [
    { originDDDId: ddd11.id, destinationDDDId: ddd16.id, ratePerMin: 1.9 },
    { originDDDId: ddd16.id, destinationDDDId: ddd11.id, ratePerMin: 2.9 },
    { originDDDId: ddd11.id, destinationDDDId: ddd17.id, ratePerMin: 1.7 },
    { originDDDId: ddd17.id, destinationDDDId: ddd11.id, ratePerMin: 2.7 },
    { originDDDId: ddd11.id, destinationDDDId: ddd18.id, ratePerMin: 0.9 },
    { originDDDId: ddd18.id, destinationDDDId: ddd11.id, ratePerMin: 1.9 },
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
