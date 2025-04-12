import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common'
import { ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import {
  CreateAccountEventDTO,
  UpdateAccountEventDTO,
  ResponseAccountEventDTO,
  ResponseAccountEventListDTO,
  FilterAccountEventDTO,
  SortByAccountEventDTO
} from '@account-events/account-event.dto'
import { AccountEventService } from '@account-events/account-event.service'
// import { Roles } from '@auth/decorators/roles.decorator';

@Controller('account-events')
@ApiBearerAuth()
export class AccountEventController {
  constructor(private readonly accountEventService: AccountEventService) {}

  //  @Post()
  //  @ApiResponse({
  //    status: 201,
  //    description: 'AccountEvent created',
  //    type: ResponseAccountEventDTO,
  //  })
  //  async create(@Body() data: CreateAccountEventDTO): Promise<ResponseAccountEventDTO> {
  //    return this.accountEventService.create(data);
  //  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all accountEvents',
    type: ResponseAccountEventListDTO
  })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 10 })
  @ApiQuery({ name: 'sort_by_created_at', required: false, type: String, default: 'desc' })
  @ApiQuery({ name: 'sort_by_updated_at', required: false, type: String, default: 'desc' })
  async getAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('offset', new ParseIntPipe({ optional: true })) offset = 10,
    @Query() filters: FilterAccountEventDTO,
    @Query() sortBy: SortByAccountEventDTO
  ): Promise<ResponseAccountEventListDTO> {
    return this.accountEventService.getAll({ page, offset, filters, sortBy })
  }

  @Get(':account_event_id')
  @ApiResponse({
    status: 200,
    description: 'Get accountEvent by id',
    type: ResponseAccountEventDTO
  })
  async getById(@Param('account_event_id', ParseIntPipe) id: number): Promise<ResponseAccountEventDTO> {
    return this.accountEventService.getById(id)
  }

  //  @Put(':account_event_id')
  //  @ApiResponse({
  //    status: 200,
  //    description: 'AccountEvent updated',
  //    type: ResponseAccountEventDTO,
  //  })
  //  async update(
  //    @Param('account_event_id', ParseIntPipe) id: number,
  //    @Body() data: UpdateAccountEventDTO,
  //  ): Promise<ResponseAccountEventDTO> {
  //    return this.accountEventService.update(id, data);
  //  }

  //  @Delete(':account_event_id')
  //  @ApiResponse({
  //    status: 200,
  //    description: 'AccountEvent soft deleted',
  //  })
  //  async delete(@Param('account_event_id', ParseIntPipe) id: number): Promise<ResponseAccountEventDTO> {
  //    return this.accountEventService.delete(id);
  //  }
}
