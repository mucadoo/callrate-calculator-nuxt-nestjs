import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalculationService {
  constructor(private prisma: PrismaService) {}

  async compareRates(destinationCountryId: number, minutes: number) {
    const plans = await this.prisma.callingPlan.findMany({
      include: {
        provider: true,
        rates: {
          where: { destinationCountryId },
        },
      },
    });

    // Filter plans that have a rate for the chosen country
    const applicablePlans = plans.filter((plan) => plan.rates.length > 0);

    if (applicablePlans.length === 0) {
      throw new NotFoundException('No plans found for the given country');
    }

    return applicablePlans.map((plan) => {
      const rate = plan.rates[0].ratePerMin;
      const exceededPercent = plan.exceededMinutesPercent / 100;
      let costWithPlan = 0;
      if (minutes > plan.minutes) {
        const exceededMinutes = minutes - plan.minutes;
        costWithPlan = exceededMinutes * (rate * (1 + exceededPercent));
      }

      return {
        provider: plan.provider?.name || 'Unknown Provider',
        planName: plan.name,
        standardRate: rate,
        standardCost: parseFloat((minutes * rate).toFixed(2)),
        costWithPlan: parseFloat(costWithPlan.toFixed(2)),
      };
    });
  }
}
