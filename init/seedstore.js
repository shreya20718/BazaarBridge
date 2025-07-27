import mongoose from 'mongoose';
import Store from '../models/store.js';

const MONGO_URI = 'mongodb+srv://shreyagaikwad107:PshuPkjxdG2HMWY5@cluster0.enpmrvd.mongodb.net/?retryWrites=true&w=majority';

const stores = [
    {
        id: 1,
        name: "Fresh Veggie Hub",
        description: "Premium fresh vegetables sourced directly from farms. Perfect for street food vendors who need quality ingredients daily.",
        address: "123 Market Street, Connaught Place, New Delhi - 110001",
        icon: "🥬",
        rating: 4.8,
        reviewCount: 342,
        category:"Grocery",
        itemCount: 156,
        deliveryTime: "30 min",
        tags: ["Fresh Produce", "Farm Direct", "Organic", "Daily Delivery"]
    },
    {
        id: 2,
        name: "Spice Master",
        description: "Authentic spices and masalas for all your street food needs. From garam masala to exotic spices with traditional quality.",
        address: "456 Spice Bazaar, Chandni Chowk, New Delhi - 110006",
        icon: "🌶️",
        rating: 4.9,
        reviewCount: 567,
        category: "Spices",
        itemCount: 89,
        deliveryTime: "25 min",
        tags: ["Pure Spices", "Custom Blends", "Wholesale", "Traditional"]
    },
    {
        id: 3,
        name: "Golden Oil Co.",
        description: "Premium cooking oils including mustard oil, sunflower oil, and specialty oils for authentic flavors and healthy cooking.",
        address: "789 Oil Mills Road, Karol Bagh, New Delhi - 110005",
        icon: "🫗",
        rating: 4.7,
        reviewCount: 234,
        category: "Oil",
        itemCount: 67,
        deliveryTime: "45 min",
        tags: ["Pure Oils", "Cold Pressed", "Bulk Supply", "Quality Assured"]
    },
    {
        id: 4,
        name: "Grain Valley",
        description: "High-quality grains, flour, and cereals. Essential ingredients for various street food preparations with guaranteed freshness.",
        address: "321 Grain Market, Azadpur Mandi, New Delhi - 110033",
        icon: "🌾",
        rating: 4.6,
        reviewCount: 189,
        category: "Grains",
        itemCount: 134,
        deliveryTime: "40 min",
        tags: ["Premium Grains", "Fresh Milling", "Bulk Orders", "Nutritious"]
    },
    {
        id: 5,
        name: "Dairy Direct",
        description: "Fresh dairy products including milk, paneer, butter, and curd delivered daily to your business with hygiene guaranteed.",
        address: "654 Dairy Complex, Ghazipur, New Delhi - 110096",
        icon: "🥛",
        rating: 4.8,
        reviewCount: 445,
        category: "Dairy",
        itemCount: 78,
        deliveryTime: "20 min",
        tags: ["Fresh Daily", "Hygienic", "Farm Fresh", "Quick Delivery"]
    },
    {
        id: 6,
        name: "Pack Pro",
        description: "Eco-friendly packaging solutions for street food vendors. Boxes, bags, and containers in bulk with customization options.",
        address: "987 Industrial Area, Okhla Phase 1, New Delhi - 110020",
        icon: "📦",
        rating: 4.5,
        reviewCount: 156,
        category: "Packaging",
        itemCount: 234,
        deliveryTime: "60 min",
        tags: ["Eco-Friendly", "Customizable", "Bulk Supply", "Food Safe"]
    },
    {
        id: 7,
        name: "Street Food Essentials",
        description: "One-stop shop for all street food ingredients. Everything you need to run your food business with competitive pricing.",
        address: "147 Wholesale Market, Sadar Bazaar, New Delhi - 110006",
        icon: "🍽️",
        rating: 4.9,
        reviewCount: 678,
        category: "Grocery",
        itemCount: 289,
        deliveryTime: "35 min",
        tags: ["Complete Range", "Best Prices", "24/7 Support", "One Stop"]
    },
    {
        id: 8,
        name: "Quick Supply Co.",
        description: "Fast delivery of raw materials with same-day delivery options. Perfect for urgent requirements and emergency supplies.",
        address: "258 Express Hub, Lajpat Nagar, New Delhi - 110024",
        icon: "⚡",
        rating: 4.7,
        reviewCount: 334,
        category: "Grocery",
        itemCount: 198,
        deliveryTime: "15 min",
        tags: ["Same Day", "Express Delivery", "Emergency Supply", "Reliable"]
    },
    {
        id: 9,
        name: "Organic Paradise",
        description: "Certified organic ingredients for health-conscious vendors. Premium quality organic vegetables, spices, and grains.",
        address: "369 Green Valley, Vasant Kunj, New Delhi - 110070",
        icon: "🌱",
        rating: 4.6,
        reviewCount: 267,
        category: "Grocery",
        itemCount: 145,
        deliveryTime: "50 min",
        tags: ["Certified Organic", "Chemical Free", "Premium Quality", "Health Focused"]
    },
    {
        id: 10,
        name: "Frozen Foods Hub",
        description: "Quality frozen ingredients and ready-to-cook items. Perfect for street food vendors looking for convenience and consistency.",
        address: "741 Cold Storage Complex, Narela, New Delhi - 110040",
        icon: "🧊",
        rating: 4.4,
        reviewCount: 198,
        category: "Frozen",
        itemCount: 167,
        deliveryTime: "55 min",
        tags: ["Frozen Foods", "Ready to Cook", "Long Shelf Life", "Consistent Quality"]
    },
    {
        id: 11,
        name: "Masala Junction",
        description: "Traditional spice blends and ready masalas. Authentic recipes passed down through generations for authentic street food taste.",
        address: "852 Heritage Spice Market, Khari Baoli, New Delhi - 110006",
        icon: "🥘",
        rating: 4.8,
        reviewCount: 423,
        category: "Spices",
        itemCount: 112,
        deliveryTime: "30 min",
        tags: ["Traditional Recipes", "Authentic Taste", "Heritage Quality", "Time Tested"]
    },
    {
        id: 12,
        name: "Beverage Supplies",
        description: "Complete range of beverage ingredients, syrups, and concentrates. Everything needed for refreshing drinks and lassis.",
        address: "963 Beverage Park, Rohini, New Delhi - 110085",
        icon: "🥤",
        rating: 4.5,
        reviewCount: 289,
        category: "Beverages",
        itemCount: 93,
        deliveryTime: "40 min",
        tags: ["Beverage Syrups", "Concentrates", "Drink Mixes", "Refreshing"]
    }
];



async function seedStores() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected to MongoDB Atlas");

        await Store.deleteMany(); // optional: clears previous data
        await Store.insertMany(stores);

        console.log("Store data inserted successfully");
        process.exit();
    } catch (err) {
        console.error("Error seeding stores:", err);
        process.exit(1);
    }
}

seedStores();