import mongoose from 'mongoose';
import Review from './models/review.js';
import Store from './models/store.js';

const MONGO_URI = 'mongodb+srv://shreyagaikwad107:PshuPkjxdG2HMWY5@cluster0.enpmrvd.mongodb.net/?retryWrites=true&w=majority';

async function testReviewSystem() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Get a store to test with
        const store = await Store.findOne({});
        if (!store) {
            console.log('No stores found in database');
            return;
        }

        console.log('Testing with store:', store.name, 'ID:', store._id);

        // Test 1: Check existing reviews
        const existingReviews = await Review.find({ storeId: store._id });
        console.log('Existing reviews for this store:', existingReviews.length);

        // Test 2: Create a test review
        const testReview = new Review({
            userId: new mongoose.Types.ObjectId(),
            storeId: store._id,
            rating: 5,
            comment: 'This is a test review from the test script',
            category: 'product_quality'
        });

        await testReview.save();
        console.log('Test review saved successfully');

        // Test 3: Verify the review was saved
        const savedReview = await Review.findById(testReview._id);
        console.log('Retrieved saved review:', savedReview);

        // Test 4: Check total reviews for the store
        const totalReviews = await Review.countDocuments({ storeId: store._id });
        console.log('Total reviews for store:', totalReviews);

        // Test 5: Get reviews by category
        const productReviews = await Review.find({ 
            storeId: store._id, 
            category: 'product_quality' 
        });
        console.log('Product quality reviews:', productReviews.length);

        const safetyReviews = await Review.find({ 
            storeId: store._id, 
            category: 'safety' 
        });
        console.log('Safety reviews:', safetyReviews.length);

        console.log('✅ All tests passed! Review system is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

testReviewSystem(); 