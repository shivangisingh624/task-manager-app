// backend/test-mongo.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📍 Using connection string (hidden):', process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI not found in .env file');
        console.log('💡 Create .env file with your MongoDB connection string');
        return;
    }
    
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ MongoDB Connected Successfully!');
        console.log('📊 Database Name:', mongoose.connection.name);
        
        // Try to create a test collection
        const db = mongoose.connection.db;
        const result = await db.command({ ping: 1 });
        console.log('✅ Database ping successful:', result);
        
        await mongoose.disconnect();
        console.log('✅ Test completed!');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        
        if (error.message.includes('Authentication failed')) {
            console.log('\n🔑 PASSWORD ERROR:');
            console.log('1. Go to MongoDB Atlas → Database Access');
            console.log('2. Reset password for user: shivangishingh23');
            console.log('3. Update password in .env file');
        }
        
        if (error.message.includes('getaddrinfo ENOTFOUND')) {
            console.log('\n🌐 CLUSTER NAME ERROR:');
            console.log('1. Check your cluster name: cluster0.6u08psl.mongodb.net');
            console.log('2. Get fresh connection string from MongoDB Atlas');
        }
        
        if (error.message.includes('Server selection timed out')) {
            console.log('\n🔒 IP WHITELIST ERROR:');
            console.log('1. Go to MongoDB Atlas → Network Access');
            console.log('2. Add IP address: 0.0.0.0/0');
            console.log('3. Wait 1-2 minutes for changes to apply');
        }
    }
};

testConnection();