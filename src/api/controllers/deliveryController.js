const deliveryServices = require("../services/deliveryServices");

const deliveryController = async (req, res) => {
  try {
    const { cart, formData } = req.body;

    await deliveryServices({ cart, formData });

    const user = await User.findOne({ salonId: salon._id });
    console.log(user);
    const salonOwnerId = user._id;
    const notification = await Notification.create({
      recipient_id: salonOwnerId,
      // sender_id: req.user.id,
      sender_id: "65d6ea6c2cab0eaa1203b50e",
      content: "The New order has been placed",
      type: "order",
    });
    console.log(notification);
    const adminNamespace = io.of("/admin");
    const receiverSocketId = getReceiverSocketId(salonOwnerId);
    if (notification) {
      adminNamespace.to(receiverSocketId).emit("newAppointment", notification);
      console.log("Notification Sended");
    }

    res.status(200).json({ message: "Order successfully place" });
    console.log("try is running");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Your order not successfull" });
    // console.log("caugth api data")
  }
};

module.exports = { deliveryController };
