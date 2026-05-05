import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalculationService {
  constructor(private prisma: PrismaService) {}

  async compareRates(destinationCountryId: number, minutes: number) {
    const rates = await this.prisma.callingRate.findMany({
      where: { destinationCountryId },
      include: {
        provider: {
          include: { callingPlans: true },
        },
      },
    });

    if (rates.length === 0) {
      throw new NotFoundException('No rates found for the given country');
    }

    return rates.map((rate) => {
      const planResults = (rate.provider?.callingPlans || []).map((plan) => {
        const exceededPercent = plan.exceededMinutesPercent / 100;
        let costWithPlan = 0;
        if (minutes > plan.minutes) {
          const exceededMinutes = minutes - plan.minutes;
          costWithPlan = exceededMinutes * (rate.ratePerMin * (1 + exceededPercent));
        }

        return {
          planName: plan.name,
          costWithPlan: parseFloat(costWithPlan.toFixed(2)),
        };
      });

      return {
        provider: rate.provider?.name || 'Unknown Provider',
        standardRate: rate.ratePerMin,
        standardCost: parseFloat((minutes * rate.ratePerMin).toFixed(2)),
        plans: planResults,
      };
    });
  }
}
