module.exports = function wishlistCart(oldwishlistCart) {
    this.items= oldwishlistCart.items || {};
    this.totalQty = oldwishlistCart.totalQty || 0;
    


    this.add = function(item, id) {
        let storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0}; //new entry
        }
        storedItem.qty = 1;
        this.totalQty ++;
        
    };


    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.getItems = function () {
        let arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };

};


