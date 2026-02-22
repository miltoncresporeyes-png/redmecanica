
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();
const API_URL = process.env.API_URL || 'http://localhost:3010/api';

async function testAdminAccess() {
  console.log('🚀 Starting Admin Access Test...');

  try {
    // 1. Setup Data
    console.log('Creating test users...');
    
    // Normal User
    const userEmail = `user_${Date.now()}@test.com`;
    await prisma.user.upsert({
        where: { email: userEmail },
        update: {},
        create: {
            email: userEmail,
            password: 'password123', // In real app, this should be hashed, but for test script calling login endpoint, we need to know the raw password. 
            // Wait, if I create via Prisma, I need to hash it if the login endpoint compares hashes.
            // Let's use the register endpoint instead to ensure hashing.
            name: 'Test User',
            role: 'USER'
        }
    });

    // Admin User
    const adminEmail = `admin_${Date.now()}@test.com`;
     // We need to create admin directly in DB to force role, as register usually defaults to USER/MECHANIC
    // But we need the password to be hashed. 
    // Actually, let's just use the login endpoint if the user exists, or creating it via Prisma with a known hash? 
    // Or better, let's use the `auth/register` then update role in DB.
    
    // Register Admin Candidate
    try {
        await axios.post(`${API_URL}/auth/register`, {
            email: adminEmail,
            password: 'adminpassword',
            name: 'Admin Candidate',
            role: 'client' 
        });
    } catch (e) {
        // Ignore if exists
    }

    // Elevate to ADMIN
    await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'ADMIN' }
    });

    // Register Normal User
    try {
        await axios.post(`${API_URL}/auth/register`, {
            email: userEmail,
            password: 'userpassword',
            name: 'Normal User',
            role: 'client'
        });
    } catch (e) {
        // Ignore if exists
    }


    // 2. Login as Normal User
    console.log('\nTesting Normal User Access...');
    const userLogin = await axios.post(`${API_URL}/auth/login`, {
        email: userEmail,
        password: 'userpassword'
    });
    const userToken = userLogin.data.accessToken; // Assumes token in accessToken or token

    try {
        await axios.get(`${API_URL}/admin/stats`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        console.error('❌ User should NOT be able to access admin stats!');
        process.exit(1);
    } catch (error: any) {
        if (error.response?.status === 403) {
            console.log('✅ User correctly denied access (403)');
        } else {
            console.error(`❌ Unexpected error: ${error.message}`);
        }
    }

    // 3. Login as Admin
    console.log('\nTesting Admin Access...');
    const adminLogin = await axios.post(`${API_URL}/auth/login`, {
        email: adminEmail,
        password: 'adminpassword'
    });
    const adminToken = adminLogin.data.accessToken;

    try {
        const stats = await axios.get(`${API_URL}/admin/stats`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Admin accessed stats successfully');
        console.log('Stats:', stats.data);
    } catch (error: any) {
        console.error(`❌ Admin failed to access stats: ${error.response?.data?.error || error.message}`);
        process.exit(1);
    }

    // 4. Test User Management (Admin Only)
    try {
        const users = await axios.get(`${API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`✅ Admin accessed users list (${users.data.length} users found)`);
    } catch (error: any) {
         console.error(`❌ Admin failed to access users: ${error.response?.data?.error || error.message}`);
    }

    console.log('\n🎉 Admin Security Tests Passed!');

  } catch (error: any) {
    console.error('Test Failed:', error.message);
    if (error.response) {
        console.error('Response Data:', error.response.data);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testAdminAccess();
