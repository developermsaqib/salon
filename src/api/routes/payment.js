require('dotenv').config();
const paymentRouter = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)


paymentRouter.post('/create-checkout-session', async (req, res) => {

    const { products } = req.body;

    const lineItems = products.map((product)=>({
        price_data:{
            currency:"usd",
            product_data:{
                name:product.name,
                image: product.images
            },
            unit_amount:Math.round(product.price * 100),
        },
        quantity:product.quantity
    }));
   
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: 'http://localhost:3000/cart',
        cancel_url: 'http://localhost:3000/checkout',
    });

    res.json({ id: session.id });
});



module.exports = paymentRouter;





