import mongoose from 'mongoose';
import Review from './models/review.js';
import Store from './models/store.js';

const MONGO_URI = 'mongodb+srv://shreyagaikwad107:PshuPkjxdG2HMWY5@cluster0.enpmrvd.mongodb.net/?retryWrites=true&w=majority';

async function testProductQualityReview() {
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

        // Test 1: Check existing product quality reviews
        const existingProductReviews = await Review.find({ 
            storeId: store._id, 
            category: 'product_quality' 
        });
        console.log('Existing product quality reviews:', existingProductReviews.length);

        // Test 2: Create a test product quality review
        const testProductReview = new Review({
            userId: new mongoose.Types.ObjectId(),
            storeId: store._id,
            rating: 4,
            comment: 'This is a test product quality review - products are fresh and good quality!',
            category: 'product_quality'
        });

        await testProductReview.save();
        console.log('✅ Product quality review saved successfully');

        // Test 3: Verify the review was saved with correct category
        const savedProductReview = await Review.findById(testProductReview._id);
        console.log('Retrieved product quality review:', {
            category: savedProductReview.category,
            rating: savedProductReview.rating,
            comment: savedProductReview.comment
        });

        // Test 4: Check all reviews by category
        const allReviews = await Review.find({ storeId: store._id });
        console.log('\nAll reviews by category:');
        
        const productQualityCount = allReviews.filter(r => r.category === 'product_quality').length;
        const safetyCount = allReviews.filter(r => r.category === 'safety').length;
        const generalCount = allReviews.filter(r => r.category === 'general').length;
        
        console.log(`- Product Quality: ${productQualityCount}`);
        console.log(`- Safety: ${safetyCount}`);
        console.log(`- General: ${generalCount}`);

        console.log('\n✅ Product quality review test completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

testProductQualityReview(); 