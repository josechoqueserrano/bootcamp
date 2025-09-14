# Ejemplo de aplicación Node.js para CI/CD

Esta es una aplicación de ejemplo para demostrar conceptos de GitLab CI/CD.

## Estructura del proyecto

```
node-app/
├── src/
│   ├── index.js
│   ├── calculator.js
│   └── utils/
│       └── logger.js
├── tests/
│   ├── calculator.test.js
│   └── integration.test.js
├── package.json
├── .gitignore
└── .gitlab-ci.yml
```

## Instalación

```bash
npm install
```

## Scripts disponibles

- `npm start` - Ejecutar la aplicación
- `npm test` - Ejecutar tests unitarios
- `npm run test:integration` - Ejecutar tests de integración
- `npm run lint` - Linter de código
- `npm run build` - Build de producción

## CI/CD

Este proyecto incluye configuración completa de GitLab CI/CD con:
- Linting automático
- Tests unitarios e integración
- Build de producción
- Despliegue automático