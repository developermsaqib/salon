const mongoose = require("mongoose");

// Define schema for the order
const orderSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    order_date: {
      type: Date,
      default: Date.now,
    },
    shipping_address: {
      street: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
    },
    billing_address: {
      street: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
    },
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    order_total: {
      type: Number,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
    order_status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    shipping_method: String,
    tracking_number: String,
    notes: String,
    promo_code: String,
    discount: Number,
    tax: Number,
    shipping_cost: Number,
    order_completion_date: Date,
    refund_return_info: {
      refund_amount: Number,
      return_shipping_instructions: String,
    },
  },
  { timestamps: true }
);

// Create the Order model
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
