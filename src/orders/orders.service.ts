import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateOrderDto } from './dto/create-order.dto'
import { Order, OrderDocument } from './entities/order.entity'
import { CreateOrderItemDto } from 'src/order-items/dto/create-order-item.dto'
import {
  OrderItem,
  OrderItemDocument,
} from 'src/order-items/entities/order-item.entity'

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name)
    private OrderItemModel: Model<OrderItemDocument>,
  ) {}

  // Create a new order with items
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // First, create the order items and save them to the database
    const createdItems = await Promise.all(
      createOrderDto.items.map(async (item: CreateOrderItemDto) => {
        const createdItem = new this.OrderItemModel(item)
        return createdItem.save()
      }),
    )

    // Calculate total price from the created items
    const totalPrice = createdItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    )

    // Now create the order and reference the created item IDs
    const createdOrder = new this.OrderModel({
      customerId: createOrderDto.customerId,
      items: createdItems.map((item) => item._id), // Use the generated _id from created items
      totalPrice,
    })

    return createdOrder.save()
  }

  async findAll(): Promise<Order[]> {
    return this.OrderModel.find().populate('items').exec()
  }

  async findOne(id: string): Promise<Order> {
    return this.OrderModel.findById(id).populate('items').exec()
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    return this.OrderModel.find({ customerId }).populate('items').exec()
  }

  async update(id: string, updateOrderDto: CreateOrderDto): Promise<Order> {
    // Delete the existing items and create new ones
    await this.OrderItemModel.deleteMany({
      _id: { $in: updateOrderDto.items.map((item) => item._id) },
    })

    const updatedItems = await Promise.all(
      updateOrderDto.items.map(async (item: CreateOrderItemDto) => {
        const updatedItem = new this.OrderItemModel(item)
        return updatedItem.save()
      }),
    )

    // Calculate total price again
    const totalPrice = updatedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    )

    // Update the order and reference the updated items
    return this.OrderModel.findByIdAndUpdate(
      id,
      {
        customerId: updateOrderDto.customerId,
        items: updatedItems.map((item) => item._id),
        totalPrice,
      },
      { new: true },
    ).exec()
  }

  async remove(id: string): Promise<Order> {
    // Find the order by ID to get the associated items
    const order = await this.OrderModel.findById(id).exec()

    if (!order) {
      throw new Error(`Order with id ${id} not found`)
    }

    // Delete all associated order items
    await this.OrderItemModel.deleteMany({
      _id: { $in: order.items }, // Remove all items with IDs in the order's items array
    })

    // Delete the order itself
    return this.OrderModel.findByIdAndDelete(id).exec()
  }
}
