const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ImtiazKicks E-Commerce API',
      version: '1.0.0',
      description: 'Complete API documentation for ImtiazKicks footwear e-commerce platform',
      contact: {
        name: 'Imtiaz Adar',
        email: 'imtiazadarofficial@gmail.com'
      },
      license: {
        name: 'Imtiaz Adar',
        url: 'https://linkedin.com/in/imtiaz-ahmed-adar'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.imtiazkicks.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token with format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'Full name' },
            email: { type: 'string', format: 'email', description: 'Email address' },
            balance: { type: 'number', description: 'Account balance in BDT' },
            role: { type: 'string', enum: ['user', 'admin'], description: 'User role' },
            createdAt: { type: 'string', format: 'date-time', description: 'Account creation date' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Product ID' },
            name: { type: 'string', description: 'Product name' },
            brand: { type: 'string', description: 'Brand name' },
            price: { type: 'number', description: 'Price in BDT' },
            category: { type: 'string', enum: ['Running', 'Basketball', 'Casual', 'Training', 'Lifestyle'] },
            sizes: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  size: { type: 'number' },
                  quantity: { type: 'number' }
                }
              }
            },
            colors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  hexCode: { type: 'string' }
                }
              }
            },
            description: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            rating: { type: 'number' },
            numReviews: { type: 'number' },
            inStock: { type: 'boolean' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            user: { type: 'string', description: 'User ID' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { type: 'string' },
                  name: { type: 'string' },
                  price: { type: 'number' },
                  size: { type: 'number' },
                  color: { type: 'string' },
                  quantity: { type: 'number' }
                }
              }
            },
            totalAmount: { type: 'number' },
            paymentStatus: { type: 'string', enum: ['pending', 'completed', 'failed'] },
            orderStatus: { type: 'string', enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            user: { type: 'string' },
            type: { type: 'string', enum: ['deposit', 'payment'] },
            amount: { type: 'number' },
            order: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'completed', 'failed'] },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints' },
      { name: 'Products', description: 'Product management endpoints' },
      { name: 'Orders', description: 'Order management endpoints' },
      { name: 'Users', description: 'User profile and balance management' },
      { name: 'Admin', description: 'Administrator exclusive endpoints' }
    ]
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;