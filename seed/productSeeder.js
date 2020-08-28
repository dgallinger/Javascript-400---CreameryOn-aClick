const Item  = require('../models/items');

const  mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/js400-final-project')

var items = [
    new Item({
        imagePath: "https://www.chewboom.com/wp-content/uploads/2017/11/Cold-Stone-Creamery-Introduces-New-Caramel-Chocolate-Cheesecake-Ice-Cream-For-The-2017-Holiday-Season-678x381.jpg",
        title: "Caramel Chocolate Cheesecake",
        description: "Caramel Cheesecake Ice Cream with Graham Cracker-Covered Cheesecake Truffles & Chocolate Cookie Swirls",
        story: "In your cheesecake dreams, is it like you’re spooning through a world of caramel cheesecake ice cream swirled with chocolate cookies in a wonderland of truffles filled with cheesecake?" ,
        size: "Pint",
        price: 5
    }),
    new Item({
        imagePath: "https://seansskillet.files.wordpress.com/2018/04/img_9365.jpg?w=450&h=450",
        title: "Chocolate ShakeIt!",
        description: "Chocolate Malt Milkshake Ice Cream with Chocolate Cookie-Covered Fudge Truffles & Marshmallow Swirls",
        story: "For those who prefer their ice cream shaken, swirled, and truffled, here’s a chocolate malt milkshake and marshmallow creation we truffled up with euphoric morsels of cookie crumble-covered fudge",
        size: "Pint",
        price: 8
    }),
    new Item({
        imagePath: "https://www.chewboom.com/wp-content/uploads/2019/05/Carvel-Introduces-New-Cold-Brew-Coffee-Ice-Cream-678x381.jpg",
        title: "Chilling the Roast",
        description: "Cold Brew Coffee Ice Cream with Chocolate Cookie-Covered Coffee Liqueur Truffles & Fudge Swirls",
        story:"Our cold brew coffee ice cream not only delivers a chillacious blast of creamy caffeination, it’s also loaded with enough coffee liqueur-filled, cookie crumble-covered truffles to fuel a truffolution.",
        size: "Pint",
        price: 7
    }),
    new Item({
        imagePath: "https://stressbaking.com/wp-content/uploads/2017/02/americone-dream-ice-cream-cone-2-684x1024.png",
        title: "Americon Dream",
        description: "Vanilla Ice Cream with Fudge-Covered Waffle Cone Pieces & a Caramel Swirl",
        story: "Founded in fudge-covered waffle cones, this caramel-swirled concoction is the only flavor that gets a s'cream of approval from The Late Show host, Stephen Colbert. What's sweeter is this flavor supports charitable causes through The Stephen Colbert AmeriCone Dream Fund.",
        size: "Pint",
        price: 6
    }),
    new Item({
           
        imagePath: "https://images-gmi-pmc.edge-generalmills.com/e731b771-fd06-4e54-beb5-83aac0ed7b0f.jpg",
        title: "Blondie Ambition",
        description: "Buttery Brown Sugar Ice Cream with Blonde Brownies and Butterscotch Toffee Flakes ",
        story:"What makes our Creamery so euphoric? Some say it's the legendary creamy-richness of our flavor creations. Others say it's the tastebud-boggling combinations of spoon-bending chunks & perfect swirls. We say,Enjoy!",
        size: "Pint",
        price: 9
    }),
    new Item({
       
        imagePath: "https://cdn.kiwilimon.com/recetaimagen/26478/26077.jpg",
        title: "Banana Split",
        description: "Banana & Strawberry Ice Creams with Walnuts, Fudge Chunks & a Fudge Swirl",
        story:"We turned the classic ice cream parlor sundae you've always loved into the at-home flavor creation you've always wanted. Enjoy!",
        size: "Pint",
        price: 12
    }),
    new Item({
       
        imagePath: "https://www.awayfromthebox.com/wp-content/uploads/2019/02/Turtle-Cheesecake-Brownies-2.jpg",
        title: "Cheesecake Brownie",
        description: "Cheesecake Ice Cream with Cheesecake Brownie Chunks",
        story:"What do you call a creamy cheesecake ice cream filled with dreamy cheesecake brownies? A surreally good reason to go fetch a spoon. Enjoy!",
        size: "Pint",
        price: 9
    }),

    new Item({
       
        imagePath: "https://i.huffpost.com/gen/2483498/thumbs/o-SCOOPS-570.jpg",
        title: "Boom Chocolatta Cookie Core",
        description: "Mocha & Caramel Ice Creams with Chocolate Cookies, Fudge Flakes & a Chocolate Cookie Core",
        story:"As you slam dunk your spoon through creamy mocha & caramel to celebrate the epic chocolate cookie-spread core, your technique may not be perfect, but the victory’s perfectly delicious.",
        size: "Pint",
        price: 5
    }),

    new Item({
       
        imagePath: "https://i.ytimg.com/vi/ZhHiIjKenmQ/maxresdefault.jpg",
        title: "Chubby Hubby",
        description: "Vanilla Malt Ice Cream with Peanutty Fudge-Covered Pretzels with Fudge & Peanut Buttery Swirls",
        story:"Two tricksters convinced a co-worker this flavor really existed (it didn’t), then felt guilty and made him an actual batch packed with pretzels, peanut butter & fudge. He loved it, so did we, and the rest is history. Enjoy!",
        size: "Pint",
        price: 8
    }),

    
];

var done = 0;
for (var i = 0; i < items.length; i++) {
    items[i].save(function(err, result) {
        done++;
        if (done === items.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}