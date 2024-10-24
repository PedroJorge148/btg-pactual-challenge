import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { OrderItem } from 'src/order-items/entities/order-item.entity'

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  customerId: string

  @Prop({ type: [{ type: Types.ObjectId, ref: 'OrderItem' }] })
  items: OrderItem[]

  @Prop({ required: true })
  totalPrice: number
}

export type OrderDocument = Order & Document

export const OrderSchema = SchemaFactory.createForClass(Order)
