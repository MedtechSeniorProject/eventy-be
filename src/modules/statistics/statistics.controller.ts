import "reflect-metadata";
import {
  Body,
  Get,
  JsonController,
  Param,
  Post,
  UseBefore,
} from "routing-controllers";
import { CheckAutheticated } from "../auth/jwt.middleware";
import { CheckRole } from "../auth/role.middleware";
import { ROLES } from "../auth/roles";
import statisticsService from "./statistics.service";
import { StatisticsDateDto } from "./dto/statisticsDate.dto";

@JsonController("/statistics")
export class StatisticsController {
  @Get("/event/:eventId")
  public async getEventStatistics(@Param("eventId") eventId: string) {
    return statisticsService.getEventStatistics(eventId);
  }
  @Post("/eventmanager/:eventManagerId")
  public async getEventManagerStatistics(
    @Param("eventManagerId") eventManagerId: string,
    @Body() statisticDates: StatisticsDateDto
  ) {
    return statisticsService.getEventManagerStatistics(
      eventManagerId,
      statisticDates.startTime,
      statisticDates.endTime
    );
  }

  @Post("/superadmin")
  public async getSuperAdminStatistics(
    @Body() statisticDates: StatisticsDateDto
  ) {
    return statisticsService.getSuperAdminStatistics(
      statisticDates.startTime,
      statisticDates.endTime
    );
  }

  @Get("/eventResponses/:eventId")
  public async getEventResponses(@Param("eventId") eventId: string) {
    return statisticsService.getEvaluationStatistics(eventId);
  }
}
