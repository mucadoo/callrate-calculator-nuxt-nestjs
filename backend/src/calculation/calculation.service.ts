import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalculationService {
  constructor(private prisma: PrismaService) {}

  async calculate(destinationCountryId: number, minutes: number, callingPlanId: number) {
    const callingRate = await this.prisma.callingRate.findFirst({
      where: { destinationCountryId },
    });

    if (!callingRate) {
      throw new NotFoundException('Calling rate not found for the given country');
    }

    const callingPlan = await this.prisma.callingPlan.findUnique({
      where: { id: callingPlanId },
    });

    if (!callingPlan) {
      throw new NotFoundException('Calling plan not found');
    }

    const rate = callingRate.ratePerMin;
    const planMinutes = callingPlan.minutes;
    const exceededPercent = callingPlan.exceededMinutesPercent / 100;

    // Without plan
    const costWithoutPlan = minutes * rate;

    // With plan
    let costWithPlan = 0;
    if (minutes > planMinutes) {
      const exceededMinutes = minutes - planMinutes;
      costWithPlan = exceededMinutes * (rate * (1 + exceededPercent));
    }

    return {
      destinationCountryId,
      minutes,
      callingPlan: callingPlan.name,
      costWithPlan: parseFloat(costWithPlan.toFixed(2)),
      costWithoutPlan: parseFloat(costWithoutPlan.toFixed(2)),
    };
  }
}
