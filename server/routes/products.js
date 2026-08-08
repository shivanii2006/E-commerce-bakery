const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const isVercel = process.env.VERCEL || process.env.NOW_BUILDER;
const uploadsDir = isVercel ? '/tmp/uploads' : path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (.jpg, .jpeg, .png, .webp, .gif) are allowed!'));
  }
});

// Helper: slugify product names
function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
}

// GET all products (with category filter and search keyword filter)
router.get('/', async (req, res) => {
  const { category, search } = req.query;
  let sql = 'SELECT * FROM products';
  let params = [];

  const conditions = [];
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }
  if (search) {
    conditions.push('(name LIKE ? OR details LIKE ? OR category LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  try {
    const products = await db.query(sql, params);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error retrieving products.' });
  }
});

// GET single product by slug or id
router.get('/:identifier', async (req, res) => {
  const ident = req.params.identifier;
  try {
    let product = await db.get('SELECT * FROM products WHERE slug = ?', [ident]);
    if (!product) {
      // Try by ID
      product = await db.get('SELECT * FROM products WHERE id = ?', [ident]);
    }
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error retrieving product.' });
  }
});

// POST create product (Admin only)
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  const { name, category, price, details, eggless, weight, serves, shelfLife, allergens, stock, featured } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ message: 'Name, category, and price are required.' });
  }

  let imageUrl = '/uploads/default-cake.jpg';
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  } else if (req.body.image) {
    imageUrl = req.body.image;
  }

  const slug = slugify(name) + '-' + Math.round(Math.random() * 1000);

  try {
    const result = await db.run(
      `INSERT INTO products (
        name, slug, category, image, price, details, eggless, weight, serves, shelfLife, allergens, stock, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        category,
        imageUrl,
        parseInt(price),
        details || '',
        eggless || 'Yes',
        weight || '',
        serves || '',
        shelfLife || '',
        allergens || '',
        parseInt(stock) || 10,
        featured ? 1 : 0
      ]
    );

    const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.id]);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error creating product.' });
  }
});

// PUT update product (Admin only)
router.put('/:id', requireAdmin, upload.single('image'), async (req, res) => {
  const productId = req.params.id;
  const { name, category, price, details, eggless, weight, serves, shelfLife, allergens, stock, featured } = req.body;

  try {
    const product = await db.get('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    let imageUrl = product.image;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      // Optional: Delete old uploaded image if it exists and is not default
      if (product.image.startsWith('/uploads/') && !product.image.includes('chocolate-cake') && !product.image.includes('black-forest') && !product.image.includes('white-forest') && !product.image.includes('cheesecake') && !product.image.includes('croissant') && !product.image.includes('cookies')) {
        const oldPath = path.join(__dirname, '..', product.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const updatedSlug = name ? slugify(name) + '-' + productId : product.slug;

    await db.run(
      `UPDATE products SET 
        name = ?, slug = ?, category = ?, image = ?, price = ?, details = ?, 
        eggless = ?, weight = ?, serves = ?, shelfLife = ?, allergens = ?, 
        stock = ?, featured = ?
       WHERE id = ?`,
      [
        name || product.name,
        updatedSlug,
        category || product.category,
        imageUrl,
        price !== undefined ? parseInt(price) : product.price,
        details !== undefined ? details : product.details,
        eggless !== undefined ? eggless : product.eggless,
        weight !== undefined ? weight : product.weight,
        serves !== undefined ? serves : product.serves,
        shelfLife !== undefined ? shelfLife : product.shelfLife,
        allergens !== undefined ? allergens : product.allergens,
        stock !== undefined ? parseInt(stock) : product.stock,
        featured !== undefined ? (featured === 'true' || featured === 1 ? 1 : 0) : product.featured,
        productId
      ]
    );

    const updatedProduct = await db.get('SELECT * FROM products WHERE id = ?', [productId]);
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error updating product.' });
  }
});

// DELETE product (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await db.get('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Delete image from filesystem if it was uploaded
    if (product.image.startsWith('/uploads/') && !product.image.includes('chocolate-cake') && !product.image.includes('black-forest') && !product.image.includes('white-forest') && !product.image.includes('cheesecake') && !product.image.includes('croissant') && !product.image.includes('cookies')) {
      const oldPath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await db.run('DELETE FROM products WHERE id = ?', [productId]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error deleting product.' });
  }
});

module.exports = router;
