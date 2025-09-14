const express = require('express');
const calculator = require('./calculator');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Aplicación Node.js para GitLab CI/CD',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

app.post('/calculate', (req, res) => {
  try {
    const { operation, a, b } = req.body;
    
    if (!operation || a === undefined || b === undefined) {
      return res.status(400).json({ 
        error: 'Se requieren operation, a y b' 
      });
    }

    let result;
    switch (operation) {
      case 'add':
        result = calculator.add(a, b);
        break;
      case 'subtract':
        result = calculator.subtract(a, b);
        break;
      case 'multiply':
        result = calculator.multiply(a, b);
        break;
      case 'divide':
        result = calculator.divide(a, b);
        break;
      default:
        return res.status(400).json({ 
          error: 'Operación no válida. Use: add, subtract, multiply, divide' 
        });
    }

    logger.info(`Calculation: ${a} ${operation} ${b} = ${result}`);
    res.json({ result });
  } catch (error) {
    logger.error('Error in calculation:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Servidor corriendo en puerto ${PORT}`);
  });
}

module.exports = app;