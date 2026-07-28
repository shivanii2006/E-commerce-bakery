const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(async () => {
  console.log('Initializing database tables...');

  // Create Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer'
    )
  `);

  // Create Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      price INTEGER NOT NULL,
      details TEXT,
      eggless TEXT DEFAULT 'Yes',
      weight TEXT,
      serves TEXT,
      shelfLife TEXT,
      allergens TEXT,
      stock INTEGER DEFAULT 10,
      featured INTEGER DEFAULT 0
    )
  `);

  // Create Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      pincode TEXT NOT NULL,
      totalAmount INTEGER NOT NULL,
      status TEXT DEFAULT 'Pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Order Items table
  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER NOT NULL,
      productId INTEGER,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);

  console.log('Tables created. Seeding initial data...');

  // Seeding default users
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const customerPasswordHash = await bcrypt.hash('customer123', 10);

  db.run(
    `INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    ['Admin User', 'admin@sweettreats.com', adminPasswordHash, 'admin']
  );

  db.run(
    `INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    ['John Doe', 'customer@gmail.com', customerPasswordHash, 'customer']
  );

  // Seeding default products
  const products = [
    {
      name: "Chocolate Cake",
      slug: "chocolate-cake",
      category: "Cakes",
      image: "/uploads/chocolate-cake.jpg",
      price: 500,
      details: "Rich and moist chocolate delight.",
      eggless: "Yes",
      weight: "1 kg",
      serves: "8 people",
      shelfLife: "3 days (refrigerated)",
      allergens: "Wheat, Dairy",
      stock: 15,
      featured: 1
    },
    {
      name: "Black Forest",
      slug: "black-forest",
      category: "Cakes",
      image: "/uploads/black-forest.jpg",
      price: 600,
      details: "Classic black forest with cherries and cream.",
      eggless: "No",
      weight: "1 kg",
      serves: "8 people",
      shelfLife: "2 days (refrigerated)",
      allergens: "Wheat, Dairy, Eggs",
      stock: 10,
      featured: 1
    },
    {
      name: "White Forest",
      slug: "white-forest",
      category: "Cakes",
      image: "/uploads/white-forest.jpg",
      price: 550,
      details: "Light & fluffy white forest cake.",
      eggless: "Yes",
      weight: "1 kg",
      serves: "8 people",
      shelfLife: "2 days (refrigerated)",
      allergens: "Wheat, Dairy",
      stock: 12,
      featured: 0
    },
    {
      name: "Cheese Cake",
      slug: "cheese-cake",
      category: "Cakes",
      image: "/uploads/cheesecake.jpg",
      price: 700,
      details: "Creamy New York-style cheesecake.",
      eggless: "Yes",
      weight: "500 g",
      serves: "4 people",
      shelfLife: "3 days (refrigerated)",
      allergens: "Wheat, Dairy",
      stock: 8,
      featured: 1
    },
    {
      name: "Croissant",
      slug: "croissant",
      category: "Croissants",
      image: "/uploads/croissant.jpg",
      price: 150,
      details: "Flaky, buttery croissant baked fresh daily.",
      eggless: "No",
      weight: "100 g",
      serves: "1 person",
      shelfLife: "1 day",
      allergens: "Wheat, Dairy, Eggs",
      stock: 25,
      featured: 1
    },
    {
      name: "Cookies",
      slug: "cookies",
      category: "Cookies",
      image: "/uploads/cookies.jpg",
      price: 200,
      details: "Crunchy chocolate-chip cookies.",
      eggless: "Yes",
      weight: "250 g",
      serves: "5 people",
      shelfLife: "5 days (airtight)",
      allergens: "Wheat, Dairy",
      stock: 30,
      featured: 0
    }
  ];

  const insertProductStmt = db.prepare(`
    INSERT OR IGNORE INTO products (
      name, slug, category, image, price, details, eggless, weight, serves, shelfLife, allergens, stock, featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const product of products) {
    insertProductStmt.run(
      product.name,
      product.slug,
      product.category,
      product.image,
      product.price,
      product.details,
      product.eggless,
      product.weight,
      product.serves,
      product.shelfLife,
      product.allergens,
      product.stock,
      product.featured
    );
  }

  insertProductStmt.finalize();
  console.log('Database seeded successfully!');
  db.close();
});
