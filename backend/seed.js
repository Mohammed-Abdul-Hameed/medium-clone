// # Sample Data Seeder Script
// # This script will populate your database with sample users and articles for testing

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import Article from './src/models/Article.js';
import { config } from './src/config/env.js';
import { connectDB } from './src/config/db.js';

const sampleUsers = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    bio: 'Tech enthusiast and full-stack developer',
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123',
    bio: 'Writer, designer, and creative thinker',
  },
  {
    username: 'alexsmith',
    email: 'alex@example.com',
    password: 'password123',
    bio: 'Software engineer passionate about clean code',
  },
];

const sampleArticles = [
  {
    title: 'Getting Started with the MERN Stack',
    content: `The MERN stack has become one of the most popular tech stacks for building modern web applications. MERN stands for MongoDB, Express.js, React, and Node.js.

In this article, we'll explore why the MERN stack is so powerful and how you can get started with it.

MongoDB provides a flexible, document-based database that scales easily. Express.js offers a minimal and flexible Node.js web application framework. React enables us to build interactive user interfaces with reusable components. Node.js allows us to run JavaScript on the server.

Together, these technologies create a seamless JavaScript development experience from front to back.`,
  },
  {
    title: 'Understanding JWT Authentication',
    content: `JSON Web Tokens (JWT) have become the standard for securing web applications. But what exactly are they, and how do they work?

A JWT is a compact, URL-safe token that represents claims between two parties. It consists of three parts: header, payload, and signature.

The header contains the token type and hashing algorithm. The payload contains the claims (user data). The signature ensures the token hasn't been tampered with.

When a user logs in, the server creates a JWT and sends it to the client. The client then includes this token in subsequent requests, allowing the server to verify the user's identity without maintaining session state.`,
  },
  {
    title: 'React Best Practices in 2026',
    content: `React continues to evolve, and with it, our best practices. Here are some essential patterns every React developer should follow in 2026.

1. Use functional components and hooks instead of class components
2. Keep components small and focused on a single responsibility
3. Implement proper error boundaries for better error handling
4. Use Context API or state management libraries wisely
5. Optimize performance with React.memo and useMemo when appropriate
6. Write clean, readable code with consistent naming conventions

Following these practices will help you build maintainable, scalable React applications.`,
  },
  {
    title: 'Building RESTful APIs with Express',
    content: `Express.js makes it incredibly easy to build RESTful APIs. In this guide, we'll cover the fundamentals of REST API design.

REST stands for Representational State Transfer. A RESTful API uses HTTP methods to perform CRUD operations:
- GET: Retrieve resources
- POST: Create new resources
- PUT/PATCH: Update existing resources
- DELETE: Remove resources

When designing your API, think in terms of resources, not actions. Use proper HTTP status codes (200, 201, 400, 404, 500) to indicate the result of operations.

Implement middleware for authentication, validation, and error handling. This keeps your route handlers clean and focused.`,
  },
  {
    title: 'MongoDB Schema Design Tips',
    content: `Designing your MongoDB schemas correctly from the start can save you hours of refactoring later. Here are some key considerations.

Unlike relational databases, MongoDB gives you flexibility in how you structure your data. You can embed related data or reference it.

Embed data when:
- The data is always accessed together
- The embedded data is small
- The data doesn't change frequently

Reference data when:
- The data is large
- The data is accessed independently
- The data changes frequently

Also consider query patterns when designing schemas. How will your application access this data most often? Design your schema to optimize for those queries.`,
  },
  {
    title: 'CSS Grid vs Flexbox: When to Use Each',
    content: `Both CSS Grid and Flexbox are powerful layout tools, but they excel in different scenarios. Understanding when to use each will make you a better frontend developer.

Flexbox is designed for one-dimensional layouts - either a row or a column. It's perfect for:
- Navigation bars
- Card layouts in a row
- Centering elements
- Distributing space among items

CSS Grid is designed for two-dimensional layouts - rows and columns simultaneously. Use it for:
- Page layouts
- Complex component layouts
- Magazine-style layouts
- Responsive grids

In practice, you'll often use both together. Grid for the overall page layout, Flexbox for components within grid items.`,
  },
];

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Article.deleteMany({});

    // Create users
    console.log('👥 Creating sample users...');
    const createdUsers = [];

    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(userData.password, salt);

      const user = await User.create({
        username: userData.username,
        email: userData.email,
        passwordHash,
        bio: userData.bio,
      });

      createdUsers.push(user);
      console.log(`   ✓ Created user: ${user.username}`);
    }

    // Create articles (distribute among users)
    console.log('📝 Creating sample articles...');
    for (let i = 0; i < sampleArticles.length; i++) {
      const articleData = sampleArticles[i];
      const author = createdUsers[i % createdUsers.length]; // Rotate through users

      const article = await Article.create({
        title: articleData.title,
        content: articleData.content,
        author: author._id,
      });

      console.log(`   ✓ Created article: ${article.title}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Users created: ${createdUsers.length}`);
    console.log(`   Articles created: ${sampleArticles.length}`);
    console.log(`\n🔐 Test credentials:`);
    sampleUsers.forEach((user) => {
      console.log(`   Email: ${user.email} | Password: ${user.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
