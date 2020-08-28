const wishlistSchema =  new mongoose.Schema({
    name: {type: String, required: true},
    items: {type: Object, required: true}
});

module.exports = mongoose.model('wishlist', wishlistSchema);