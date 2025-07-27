import { Body, Controller, Param, Put } from "@nestjs/common";
import { MovementsService } from "./movements.service";

@Controller(`movements/:userId`)
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) { }

  @Put()
  async updateMovements(
    @Param('userId') userId: string,
    @Body() body: { timestamp: number }
  ) {
    return this.movementsService.update(userId, body.timestamp);
  }
}