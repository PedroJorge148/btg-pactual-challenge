import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { Order } from './entities/order.entity'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto)
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id)
  }

  @Get('customer/:customerId')
  findByCustomerId(@Param('customerId') customerId: string) {
    return this.ordersService.findByCustomerId(customerId)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Order> {
    return this.ordersService.remove(id)
  }
}
