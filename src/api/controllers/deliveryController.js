const  deliveryServices = require('../services/deliveryServices')



const deliveryController = async (req, res) => {
  try {
    const { cart, formData } = req.body;

    await deliveryServices({ cart, formData });

    res.status(200).json({ message: 'Order successfully place' });
    console.log("try is running")
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Your order not successfull' });
    // console.log("caugth api data")
  }
};

module.exports = { deliveryController };
