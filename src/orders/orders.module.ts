import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { Order, OrderSchema } from './entities/order.entity'
import {
  OrderItem,
  OrderItemSchema,
} from 'src/order-items/entities/order-item.entity'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([
      { name: OrderItem.name, schema: OrderItemSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
