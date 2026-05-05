import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const connectionString = process.env.DATABASE_URL || "mysql://root:admin@localhost:3306/callrate";
const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.callingRate.deleteMany({});
  await prisma.callingPlan.deleteMany({});
  await prisma.provider.deleteMany({});
  await prisma.country.deleteMany({});

  const brazil = await prisma.country.create({ data: { name: 'Brazil', phoneCode: '55' } });
  const usa = await prisma.country.create({ data: { name: 'USA', phoneCode: '1' } });

  const globalTalk = await prisma.provider.create({ data: { name: 'GlobalTalk' } });
  const uniConnect = await prisma.provider.create({ data: { name: 'UniConnect' } });

  const plan1 = await prisma.callingPlan.create({
    data: { name: 'TalkMore 30', minutes: 30, exceededMinutesPercent: 10, providerId: globalTalk.id },
  });
  const plan2 = await prisma.callingPlan.create({
    data: { name: 'TalkMore 60', minutes: 60, exceededMinutesPercent: 10, providerId: globalTalk.id },
  });
  const plan3 = await prisma.callingPlan.create({
    data: { name: 'UniWorld 100', minutes: 100, exceededMinutesPercent: 5, providerId: uniConnect.id },
  });

  await prisma.callingRate.createMany({
    data: [
      { planId: plan1.id, destinationCountryId: brazil.id, ratePerMin: 1.9 },
      { planId: plan1.id, destinationCountryId: usa.id, ratePerMin: 5.5 },
      { planId: plan2.id, destinationCountryId: brazil.id, ratePerMin: 1.7 },
      { planId: plan3.id, destinationCountryId: usa.id, ratePerMin: 0.5 },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
