import { CreateOrderItemDto } from 'src/order-items/dto/create-order-item.dto'

export class CreateOrderDto {
  readonly customerId: string
  readonly items: CreateOrderItemDto[]
  readonly totalPrice: number
}
