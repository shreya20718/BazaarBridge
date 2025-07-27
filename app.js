// app.js
import express from 'express';
import path from 'path';
import http from 'http';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import User from './models/User.js';
import bcrypt from 'bcrypt'; // Only if you're using ES modules
import session from 'express-session';
import Supplier from "./models/registrationDetails.js"
import Store from "./models/store.js"
import Product from "./models/product.js";
import Cart from "./models/cart.js";
import Review from "./models/review.js"
import Todo from"./models/review.js"
import Order from "./models/order.js"


// Setup __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'yourSecretKey', // Replace with a strong secret in production
  resave: false,
  saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {
  res.render('pages/index');
});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
  
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});


// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.send('<h2>Invalid email or password. <a href="/">Try again</a></h2>');
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send('<h2>Invalid email or password. <a href="/">Try again</a></h2>');
    }

    // If passwords match, user is authenticated
    req.session.userId = user._id; // Store user ID in session for future use
    res.render('pages/dashboard', { user });

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


app.get("/register.html",(req,res)=>{
  res.render("pages/mainPage")
});


app.get("/supplierdetail",(req,res)=>{
  res.render("pages/supplier")
})



app.post('/supplierlist', async (req, res) => {
  console.log(req.body)
   const {
            fullName,
            gstNumber,
            panNumber,
            aadhaarNumber,
            contactNumber,
            emailAddress,
            businessAddress,
            pickupAddress,
            accountHolderName,
            bankName,
            accountNumber,
            ifscCode
        } = req.body;
    console.log("Request body:", req.body);  // Debugging: Check received data

    try {
       

        // Check if supplier already exists with same GST, PAN, or Aadhaar
        const existingSupplier=await Supplier.findOne({
            $or: [
                { gstNumber: gstNumber.toUpperCase() }, // Ensure uppercase for comparison
                { panNumber: panNumber.toUpperCase() }, // Ensure uppercase for comparison
                { aadhaarNumber }
            ]
        });

        if (existingSupplier) {
            let field = '';
            if (existingSupplier.gstNumber === gstNumber.toUpperCase()) {
                field = 'gstNumber';
            } else if (existingSupplier.panNumber === panNumber.toUpperCase()) {
                field = 'panNumber';
            } else {
                field = 'aadhaarNumber';
            }

            return res.status(400).json({
                error: 'Supplier already registered with this GST/PAN/Aadhaar number',
                field: field
            });
        }

        const newSupplier=new Supplier({
            fullName,
            gstNumber: gstNumber.toUpperCase(),
            panNumber: panNumber.toUpperCase(),
            aadhaarNumber,
            contactNumber,
            emailAddress,
            businessAddress,
            pickupAddress: pickupAddress || businessAddress,
            accountHolderName,
            bankName,
            accountNumber,
            ifscCode: ifscCode.toUpperCase()
        });

        await newSupplier.save(); // Save the new supplier to the database

        console.log("Supplier saved successfully:", newSupplier); // Debugging: Confirm successful save

        res.status(201).json({
            success: true,
            message: 'Supplier registration submitted successfully',
            data: {
                id: newSupplier._id,
                fullName: newSupplier.fullName,
                contactNumber: newSupplier.contactNumber,
            }
        });
    } catch (error) {
        console.error("Error during supplier registration:", error); // Log the error for debugging

        if (error.name === 'ValidationError') {
            // Handle validation errors
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            console.log("Validation Errors:", errors);
            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            });
        }

        // Handle other errors
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

app.get("/partnership",(req,res)=>{
    res.render("pages/partnership");
})

app.get('/supplierlogin', (req, res) => {
  res.render('pages/supplierLogin');
});

app.get('/quick-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'simple-login.html'));
});

app.post('/supplierlogin', async (req, res) => {
  const { fullName, contactNumber } = req.body;
  try {
    const supplier = await Supplier.findOne({ 
      fullName: fullName, 
      contactNumber: contactNumber 
    });

        if (!supplier) {
        return res.status(401).render('pages/supplierLogin', { error: 'Invalid name or mobile number' });
    }

    // Store supplier ID in session
    req.session.supplierId = supplier._id;

    // Redirect to supplier profile page
    res.redirect('/supplier/profile');
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/supplierLogin', { error: 'Internal server error' });
  }
});


app.get('/supplier/profile', async (req, res) => {
  if (!req.session.supplierId) {
    return res.redirect('/supplierlogin');
  }
  try {
    const supplier = await Supplier.findById(req.session.supplierId).select('-accountNumber -ifscCode');
    res.render('pages/supplierProfile', { supplier });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading profile');
  }
});



app.get("/stores.html", async (req, res) => {
  try {
    const stores = await Store.find({});
    res.render("pages/storePage", { stores });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading stores');
  }
});



// Route to handle store-items.html?store=1
app.get('/store-items.html', async (req, res) => {
    try {
        const storeId = req.query.store; // e.g., ?store=1
        const store = await Store.findOne({ id: parseInt(storeId) });

        if (!store) {
            return res.status(404).send("Store not found");
        }

        // Fetch reviews for this store
        const reviews = await Review.find({ storeId: store._id }).populate('userId', 'name').sort({ createdAt: -1 });

        // Render EJS page and pass the store data and reviews
        res.render('pages/listPage', { store, reviews });  // Renders views/pages/listPage.ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading store details');
    }
});

// Route to submit a review
app.post('/submit-review', async (req, res) => {
    try {
        console.log('Review submission received:', req.body);
        const { storeId, rating, comment, category } = req.body;
        
        // Validate required fields
        if (!storeId || !rating) {
            return res.status(400).json({ success: false, message: 'Store ID and rating are required' });
        }

        // Get user ID - try session first, then create a temporary user
        let userId;
        let userName = req.body.userName || `Customer ${Math.floor(Math.random() * 9000) + 1000}`;
        
        if (req.session.userId) {
            userId = req.session.userId;
        } else {
            // Create a temporary user for reviews
            const tempUser = new User({
                name: userName,
                email: `temp${Date.now()}@example.com`,
                password: 'temp'
            });
            await tempUser.save();
            userId = tempUser._id;
        }

        // Create a new review
        const newReview = new Review({
            userId: userId,
            storeId: storeId,
            rating: parseInt(rating),
            comment: comment || 'No comment provided',
            category: category || 'general'
        });

        console.log('Saving review:', newReview);
        await newReview.save();
        console.log('Review saved successfully');

        // Update store's review count
        await Store.findByIdAndUpdate(storeId, { $inc: { reviewCount: 1 } });
        console.log('Store review count updated');

        res.json({ success: true, message: 'Review submitted successfully' });
    } catch (err) {
        console.error('Error in review submission:', err);
        res.status(500).json({ success: false, message: 'Error submitting review: ' + err.message });
    }
});

// Route to get reviews for a store
app.get('/get-reviews/:storeId', async (req, res) => {
    try {
        console.log('Fetching reviews for store:', req.params.storeId);
        const reviews = await Review.find({ storeId: req.params.storeId })
            .populate('userId', 'name email') // Populate user details
            .sort({ createdAt: -1 })
            .limit(10);
        
        console.log('Found reviews:', reviews.length);
        
        // Log the populated user data for debugging
        reviews.forEach(review => {
            console.log('Review:', {
                id: review._id,
                userId: review.userId,
                userDetails: review.userId ? {
                    name: review.userId.name,
                    email: review.userId.email,
                    id: review.userId._id
                } : 'No user data'
            });
        });
        
        res.json(reviews);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ error: 'Error fetching reviews: ' + err.message });
    }
});

// Cart and Checkout Routes
app.post('/add-to-cart', async (req, res) => {
    try {
        const { userId, itemName, quantity, price, storeId, category } = req.body;
        
        // Create a temporary user if not exists
        let user;
        if (userId) {
            user = await User.findById(userId);
        }
        
        if (!user) {
            user = new User({
                name: `Customer ${Math.floor(Math.random() * 9000) + 1000}`,
                email: `temp${Date.now()}@example.com`,
                password: 'temp'
            });
            await user.save();
        }

        // Find or create cart for user
        let cart = await Cart.findOne({ userId: user._id });
        if (!cart) {
            cart = new Cart({
                userId: user._id,
                items: [],
                totalAmount: 0
            });
        }

        // Add item to cart
        const cartItem = {
            productId: new mongoose.Types.ObjectId(), // Generate new ID for item
            quantity: parseFloat(quantity),
            price: parseFloat(price),
            itemName: itemName,
            category: category,
            storeId: storeId
        };

        cart.items.push(cartItem);
        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.updatedAt = new Date();

        await cart.save();
        
        console.log('Item added to cart:', cartItem);
        res.json({ success: true, message: 'Item added to cart', cartId: cart._id, userId: user._id });
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).json({ success: false, message: 'Error adding to cart' });
    }
});

app.get('/cart/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            return res.json({ items: [], totalAmount: 0 });
        }
        res.json(cart);
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).json({ error: 'Error fetching cart' });
    }
});

app.get('/checkout/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).send('Cart is empty');
        }

        // Calculate totals
        const subtotal = cart.totalAmount;
        const deliveryCharges = 50;
        const tax = subtotal * 0.05; // 5% tax
        const totalAmount = subtotal + deliveryCharges + tax;

        res.render('pages/paymentPage', {
            cart: cart,
            subtotal: subtotal,
            deliveryCharges: deliveryCharges,
            tax: tax,
            totalAmount: totalAmount
        });
    } catch (err) {
        console.error('Error in checkout:', err);
        res.status(500).send('Error processing checkout');
    }
});

app.post('/place-order', async (req, res) => {
    try {
        const { userId, paymentMethod, deliveryAddress } = req.body;
        
        const cart = await Cart.findOne({ userId: userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Calculate totals
        const subtotal = cart.totalAmount;
        const deliveryCharges = 50;
        const tax = subtotal * 0.05;
        const totalAmount = subtotal + deliveryCharges + tax;

        // Create order
        const order = new Order({
            userId: userId,
            items: cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                storeId: item.storeId
            })),
            totalAmount: totalAmount,
            paymentMethod: paymentMethod || 'cod',
            deliveryAddress: deliveryAddress || {},
            status: 'pending',
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed'
        });

        await order.save();

        // Clear cart
        await Cart.findByIdAndDelete(cart._id);

        console.log('Order placed successfully:', order._id);
        res.json({ success: true, message: 'Order placed successfully', orderId: order._id });
    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).json({ success: false, message: 'Error placing order' });
    }
});

// Route to delete a review
app.delete('/delete-review/:reviewId', async (req, res) => {
    try {
        console.log('Deleting review:', req.params.reviewId);
        
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Delete the review
        await Review.findByIdAndDelete(req.params.reviewId);
        
        // Update store's review count (decrease by 1)
        await Store.findByIdAndUpdate(review.storeId, { $inc: { reviewCount: -1 } });
        
        console.log('Review deleted successfully');
        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (err) {
        console.error('Error deleting review:', err);
        res.status(500).json({ success: false, message: 'Error deleting review: ' + err.message });
    }
});




// Port setup
const PORT = process.env.PORT || 3000;
app.set('port', PORT);

// Server
const server = http.createServer(app);

// MongoDB and start server
const start = async () => {
  try {
    const connection = await mongoose.connect("mongodb+srv://shreyagaikwad107:PshuPkjxdG2HMWY5@cluster0.enpmrvd.mongodb.net/?retryWrites=true&w=majority");
    console.log(`Connected to MongoDB: ${connection.connection.host}`);

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

start();

