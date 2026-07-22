import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { PRODUCTS, CATEGORIES, COUPONS, SAMPLE_ORDERS, REVIEWS } from './src/data/mockData.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI lazily
  let aiClient: GoogleGenAI | null = null;
  const getAiClient = () => {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  };

  // REST API Routes

  // Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'MASTER GROCERY SHOP Pakistan', timestamp: new Date().toISOString() });
  });

  // Get Products
  app.get('/api/products', (req, res) => {
    try {
      const { category, search, minPrice, maxPrice, sort } = req.query;
      let result = [...PRODUCTS];

      if (category && category !== 'all') {
        result = result.filter((p) => p.category === category || p.slug === category);
      }

      if (search) {
        const q = String(search).toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.origin.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }

      if (minPrice) {
        result = result.filter((p) => p.basePricePKR >= Number(minPrice));
      }
      if (maxPrice) {
        result = result.filter((p) => p.basePricePKR <= Number(maxPrice));
      }

      if (sort === 'price-low') {
        result.sort((a, b) => a.basePricePKR - b.basePricePKR);
      } else if (sort === 'price-high') {
        result.sort((a, b) => b.basePricePKR - a.basePricePKR);
      } else if (sort === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      }

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // Get Product by ID or Slug
  app.get('/api/products/:idOrSlug', (req, res) => {
    const { idOrSlug } = req.params;
    const found = PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (found) {
      res.json(found);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  // Get Categories
  app.get('/api/categories', (req, res) => {
    res.json(CATEGORIES);
  });

  // Validate Coupon
  app.post('/api/coupons/validate', (req, res) => {
    const { code, subtotalPKR } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Coupon code required' });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const coupon = COUPONS.find((c) => c.code === cleanCode);

    if (!coupon) {
      return res.status(400).json({ valid: false, discountPKR: 0, message: 'Invalid coupon code.' });
    }

    if (Number(subtotalPKR) < coupon.minOrderPKR) {
      return res.status(400).json({
        valid: false,
        discountPKR: 0,
        message: `Minimum order amount for ${coupon.code} is ₨ ${coupon.minOrderPKR.toLocaleString()}.`,
      });
    }

    let discountPKR = 0;
    if (coupon.discountType === 'percentage') {
      discountPKR = Math.round((Number(subtotalPKR) * coupon.value) / 100);
    } else {
      discountPKR = coupon.value;
    }

    res.json({
      valid: true,
      discountPKR,
      coupon,
      message: `Coupon ${coupon.code} applied! Saved ₨ ${discountPKR.toLocaleString()}`,
    });
  });

  // Create Order
  app.post('/api/orders', (req, res) => {
    const orderData = req.body;
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    
    let defaultStatus: 'Pending' | 'Paid' | 'Verification Required' = 'Pending';
    if (orderData.paymentMethod === 'card') {
      defaultStatus = 'Paid';
    } else if (orderData.paymentMethod === 'cod') {
      defaultStatus = 'Pending';
    } else {
      defaultStatus = orderData.transactionId ? 'Paid' : 'Verification Required';
    }

    const newOrder = {
      id: `order-${Date.now()}`,
      trackingNumber: `MGS-PK-${randomSuffix}`,
      customerName: orderData.customerName || 'Customer',
      email: orderData.email || '',
      phone: orderData.phone || '',
      province: orderData.province || 'Punjab',
      city: orderData.city || 'Lahore',
      address: orderData.address || '',
      paymentMethod: orderData.paymentMethod || 'cod',
      paymentStatus: orderData.paymentStatus || defaultStatus,
      transactionId: orderData.transactionId || '',
      paymentNote: orderData.paymentNote || '',
      items: orderData.items || [],
      subtotalPKR: orderData.subtotalPKR || 0,
      shippingFeePKR: orderData.shippingFeePKR || 0,
      discountPKR: orderData.discountPKR || 0,
      totalPKR: orderData.totalPKR || 0,
      status: 'Order Placed',
      courierName: 'Leopard Courier Express / TCS',
      estimatedDeliveryDays: '1-3 Business Days Across Pakistan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    res.status(201).json(newOrder);
  });

  // Track Order
  app.get('/api/orders/track', (req, res) => {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Tracking number or phone required' });
    }

    const q = String(query).trim().toLowerCase();
    const found = SAMPLE_ORDERS.find(
      (o) =>
        o.trackingNumber.toLowerCase() === q ||
        o.phone.toLowerCase().includes(q) ||
        o.id.toLowerCase() === q
    );

    if (found) {
      res.json(found);
    } else {
      res.status(404).json({ error: 'No order matching tracking ID or phone number' });
    }
  });

  // AI Health & Recipe Assistant (Gemini API)
  app.post('/api/ai-assistant', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getAiClient();
      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not configured
        return res.json({
          reply: `For optimal memory and physical health, soak 5-7 Irani Mamra Almonds and 2 Gilgit Kagzi Walnut halves in warm water overnight. Eat on an empty stomach every morning! Master Grocery Shop guarantees 100% pure organic quality delivered across Pakistan.`,
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are "Master AI", the Senior Nutritionist, Culinary Master & Store Assistant for MASTER GROCERY SHOP Pakistan. You advise Pakistani families on dry fruits (Irani Mamra Almonds, Gilgit Walnuts, Chilgoza, Ajwa Dates), fresh groceries (Kainat Basmati Rice, Bilona Desi Ghee, Organic Pulses), health benefits, recipes (Peshawari Kahwa, Badam Halwa, Dry Fruit Milkshake), and grocery storage tips. Use friendly tone, occasional respectful Urdu words (Assalamu Alaikum, Shukriya, Badam, Akhrot), and keep responses under 130 words.',
        },
      });

      res.json({ reply: response.text });
    } catch (err: any) {
      console.error('Gemini AI Assistant Error:', err?.message || err);
      res.json({
        reply: `Irani Mamra Badam, Gilgit Kagzi Walnuts, and Madinah Ajwa Dates are rich sources of Vitamin E, Omega-3s, and iron. Include them in your daily diet for boosted immunity and lasting energy!`,
      });
    }
  });

  // Dynamic SEO Metadata & JSON-LD Schemas Endpoint
  app.get('/api/seo', (req, res) => {
    res.json({
      organizationSchema: {
        '@context': 'https://schema.org',
        '@type': 'GroceryStore',
        name: 'MASTER GROCERY SHOP',
        url: process.env.APP_URL || 'https://mastergrocery.pk',
        logo: `${process.env.APP_URL || ''}/logo.png`,
        description: 'Pakistan premier online grocery and dry fruit store delivering fresh daily essentials, Irani Mamra almonds, Gilgit walnuts & organic desi ghee across Pakistan.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Regal Chowk',
          addressLocality: 'Sheikhupura',
          addressRegion: 'Punjab',
          postalCode: '39350',
          addressCountry: 'PK',
        },
        telephone: '+92-327-9408969',
        paymentAccepted: 'Cash, Easypaisa, JazzCash, Bank Transfer, Visa, Mastercard',
        priceRange: '₨₨',
      },
      targetKeywords: [
        'Buy Dry Fruits Online Pakistan',
        'Premium Dry Fruits Pakistan',
        'Grocery Store Pakistan',
        'Online Grocery Delivery Pakistan',
        'Irani Mamra Almonds Price Pakistan',
        'Gilgit Walnuts Online Pakistan',
        'Super Kernel Basmati Rice Lahore Karachi Islamabad',
      ],
    });
  });

  // Vite Integration in Dev / Static Serving in Prod
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MASTER GROCERY SHOP Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
