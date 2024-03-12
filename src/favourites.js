// @desc      Toggle Favourite Product
// @route     Get api/v1/users/toggle-favourite-product/:userId/:productId
// @access    user/admin
exports.toggleProductInFavourites = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Find the user by userId
    const user = await userServices.findById(userId);

    // If user is not found, return an error
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the productId already exists in favouriteProducts
    const salonIndex = user.favouriteProducts.indexOf(productId);
    console.log(salonIndex);
    if (salonIndex !== -1) {
      // Salon already exists, remove it from favouriteProducts array
      user.favouriteProducts.splice(salonIndex, 1);
      await user.save();
      return res.json({
        status: true,
        message: "Product removed from favourites",
        user,
      });
    } else {
      // Product doesn't exist, add it to favouriteProducts array
      user.favouriteProducts.push(productId);
      await user.save();
      return res.json({
        status: true,
        message: "Product added to favourites",
        user,
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// @desc      Toggle Favourite Product
// @route     Get api/v1/users/toggle-favourite-product/:userId/:productId
// @access    user/admin
exports.getFavouriteProducts = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userServices.findById(userId);

    // Fetch salon details for each salon ID in the favouriteSalons array
    const favouriteProductsDetails = await Promise.all(
      user.favouriteProducts.map(async (productId) => {
        const product = await salonServices.findById(productId);
        return product;
      })
    );

    res.json({ status: true, productDetails: favouriteProductsDetails });
  } catch (error) {
    throw new Error(error.message);
  }
};
