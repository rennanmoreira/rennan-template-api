import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common'
import { ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import {
  CreateAccountDTO,
  UpdateAccountDTO,
  ResponseAccountDTO,
  ResponseAccountListDTO,
  FilterAccountDTO,
  SortByAccountDTO
} from '@accounts/account.dto'
import { AccountService } from '@accounts/account.service'
// import { Roles } from '@auth/decorators/roles.decorator';

@Controller('accounts')
@ApiBearerAuth()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  //  @Post()
  //  @ApiResponse({
  //    status: 201,
  //    description: 'Account created',
  //    type: ResponseAccountDTO,
  //  })
  //  async create(@Body() data: CreateAccountDTO): Promise<ResponseAccountDTO> {
  //    return this.accountService.create(data);
  //  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all accounts',
    type: ResponseAccountListDTO
  })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 10 })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'sort_by_name', required: false, type: String })
  @ApiQuery({ name: 'sort_by_created_at', required: false, type: String, default: 'desc' })
  @ApiQuery({ name: 'sort_by_updated_at', required: false, type: String, default: 'desc' })
  async getAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('offset', new ParseIntPipe({ optional: true })) offset = 10,
    @Query() filters: FilterAccountDTO,
    @Query() sortBy: SortByAccountDTO
  ): Promise<ResponseAccountListDTO> {
    return this.accountService.getAll({ page, offset, filters, sortBy })
  }

  @Get(':account_id')
  @ApiResponse({
    status: 200,
    description: 'Get account by id',
    type: ResponseAccountDTO
  })
  async getById(@Param('account_id', ParseIntPipe) id: string): Promise<ResponseAccountDTO> {
    return this.accountService.getById(id)
  }

  //  @Put(':account_id')
  //  @ApiResponse({
  //    status: 200,
  //    description: 'Account updated',
  //    type: ResponseAccountDTO,
  //  })
  //  async update(
  //    @Param('account_id', ParseIntPipe) id: string,
  //    @Body() data: UpdateAccountDTO,
  //  ): Promise<ResponseAccountDTO> {
  //    return this.accountService.update(id, data);
  //  }

  //  @Delete(':account_id')
  //  @ApiResponse({
  //    status: 200,
  //    description: 'Account soft deleted',
  //  })
  //  async delete(@Param('account_id', ParseIntPipe) id: string): Promise<ResponseAccountDTO> {
  //    return this.accountService.delete(id);
  //  }
}
