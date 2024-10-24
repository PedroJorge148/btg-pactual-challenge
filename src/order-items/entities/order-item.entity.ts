import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class OrderItem {
  @Prop({ required: true })
  productName: string

  @Prop({ required: true })
  quantity: number

  @Prop({ required: true })
  price: number
}

export type OrderItemDocument = OrderItem & Document

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem)
