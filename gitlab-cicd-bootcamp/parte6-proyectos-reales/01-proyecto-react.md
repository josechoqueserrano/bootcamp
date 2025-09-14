# 6.1 Proyecto React con despliegue

## 🎯 Objetivo
Implementar un pipeline CI/CD completo para una aplicación React, desde build hasta despliegue en producción.

## 🚀 Aplicación React de ejemplo

### Estructura del proyecto
```
react-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Calculator.js
│   │   └── Footer.js
│   ├── hooks/
│   │   └── useCalculator.js
│   ├── utils/
│   │   └── mathUtils.js
│   ├── __tests__/
│   │   ├── components/
│   │   └── utils/
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
├── .gitlab-ci.yml
├── Dockerfile
└── nginx.conf
```

## 📦 Configuración del proyecto

### package.json
```json
{
  "name": "react-cicd-example",
  "version": "1.0.0",
  "description": "Aplicación React para demostrar GitLab CI/CD",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.33.0",
    "prettier": "^3.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --coverage --ci --testResultsProcessor=jest-sonar-reporter",
    "test:watch": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src/ --ext .js,.jsx",
    "lint:fix": "eslint src/ --ext .js,.jsx --fix",
    "format": "prettier --write src/**/*.{js,jsx,css}",
    "analyze": "npm run build && npx source-map-explorer 'build/static/js/*.js'"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!src/index.js",
      "!src/reportWebVitals.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## 🏗️ Pipeline CI/CD para React

### .gitlab-ci.yml completo
```yaml
# GitLab CI/CD Pipeline para aplicación React
image: node:16

stages:
  - install
  - lint
  - test
  - security
  - build
  - package
  - deploy
  - performance

# Variables globales
variables:
  NODE_ENV: "production"
  NPM_CONFIG_CACHE: ".npm"
  DOCKER_REGISTRY: "$CI_REGISTRY"
  DOCKER_IMAGE: "$CI_REGISTRY_IMAGE"

# Cache para node_modules
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .npm/

# ============================================================================
# INSTALL STAGE - Instalación de dependencias
# ============================================================================

install_dependencies:
  stage: install
  script:
    - npm ci --cache .npm --prefer-offline
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour
  rules:
    - if: $CI_COMMIT_BRANCH
    - if: $CI_COMMIT_TAG

# ============================================================================
# LINT STAGE - Análisis de código
# ============================================================================

lint_code:
  stage: lint
  script:
    - npm run lint
  dependencies:
    - install_dependencies
  artifacts:
    reports:
      junit: eslint-report.xml
  rules:
    - if: $CI_COMMIT_BRANCH
    - if: $CI_COMMIT_TAG

format_check:
  stage: lint
  script:
    - npx prettier --check src/**/*.{js,jsx,css}
  dependencies:
    - install_dependencies
  allow_failure: true
  rules:
    - if: $CI_COMMIT_BRANCH
    - if: $CI_COMMIT_TAG

# ============================================================================
# TEST STAGE - Pruebas automatizadas
# ============================================================================

unit_tests:
  stage: test
  script:
    - npm run test -- --coverage --ci --testResultsProcessor=jest-sonar-reporter
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    paths:
      - coverage/
    expire_in: 1 week
  dependencies:
    - install_dependencies
  rules:
    - if: $CI_COMMIT_BRANCH
    - if: $CI_COMMIT_TAG

# E2E tests con Cypress
e2e_tests:
  stage: test
  image: cypress/browsers:node16.14.2-slim-chrome103-ff102
  script:
    - npm run build
    - npm start &
    - npx wait-on http://localhost:3000
    - npx cypress run --browser chrome
  artifacts:
    when: always
    paths:
      - cypress/videos/
      - cypress/screenshots/
    reports:
      junit: cypress/results/junit.xml
  dependencies:
    - install_dependencies
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_COMMIT_BRANCH == "develop"

# ============================================================================
# SECURITY STAGE - Análisis de seguridad
# ============================================================================

security_audit:
  stage: security
  script:
    - npm audit --audit-level=moderate
  dependencies:
    - install_dependencies
  allow_failure: true
  rules:
    - if: $CI_COMMIT_BRANCH
    - if: $CI_COMMIT_TAG

dependency_scanning:
  stage: security
  image: alpine:latest
  before_script:
    - apk add --no-cache npm
  script:
    - npm install -g audit-ci
    - audit-ci --moderate
  allow_failure: true
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

# ============================================================================
# BUILD STAGE - Construcción de la aplicación
# ============================================================================

build_application:
  stage: build
  variables:
    REACT_APP_VERSION: "$CI_COMMIT_SHORT_SHA"
    REACT_APP_BUILD_DATE: "$CI_PIPELINE_CREATED_AT"
    REACT_APP_API_URL: "$API_URL"
  script:
    - echo "Building React application..."
    - npm run build
    - echo "Build size analysis:"
    - du -sh build/
    - ls -la build/static/js/
  artifacts:
    name: "react-build-$CI_COMMIT_SHORT_SHA"
    paths:
      - build/
    expire_in: 1 week
    reports:
      dotenv: build.env
  dependencies:
    - install_dependencies
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_COMMIT_BRANCH == "develop"
    - if: $CI_COMMIT_TAG

# Bundle size analysis
analyze_bundle:
  stage: build
  script:
    - npm run analyze
  artifacts:
    paths:
      - bundle-analysis/
  dependencies:
    - build_application
  when: manual
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

# ============================================================================
# PACKAGE STAGE - Creación de imagen Docker
# ============================================================================

build_docker_image:
  stage: package
  image: docker:latest
  services:
    - docker:dind
  variables:
    DOCKER_HOST: tcp://docker:2376
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
  script:
    - |
      # Multi-stage build optimizado
      docker build \
        --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
        --build-arg VCS_REF=$CI_COMMIT_SHA \
        --build-arg VERSION=$CI_COMMIT_SHORT_SHA \
        -t $DOCKER_IMAGE:$CI_COMMIT_SHA \
        -t $DOCKER_IMAGE:latest \
        .
      
      # Push images
      docker push $DOCKER_IMAGE:$CI_COMMIT_SHA
      docker push $DOCKER_IMAGE:latest
      
      # Image security scan
      docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
        aquasec/trivy image $DOCKER_IMAGE:$CI_COMMIT_SHA
  dependencies:
    - build_application
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_COMMIT_BRANCH == "develop"
    - if: $CI_COMMIT_TAG

# ============================================================================
# DEPLOY STAGE - Despliegue por ambientes
# ============================================================================

# Deploy a staging
deploy_staging:
  stage: deploy
  image: alpine/helm:latest
  variables:
    KUBE_NAMESPACE: "staging"
    REPLICAS: "2"
    DOMAIN: "staging-$CI_PROJECT_NAME.example.com"
  before_script:
    - kubectl config use-context $KUBE_CONTEXT_STAGING
  script:
    - |
      helm upgrade --install $CI_PROJECT_NAME ./helm-chart \
        --namespace $KUBE_NAMESPACE \
        --create-namespace \
        --set image.repository=$DOCKER_IMAGE \
        --set image.tag=$CI_COMMIT_SHA \
        --set replicaCount=$REPLICAS \
        --set ingress.hosts[0].host=$DOMAIN \
        --set ingress.hosts[0].paths[0].path="/" \
        --set ingress.hosts[0].paths[0].pathType="Prefix" \
        --set env.NODE_ENV="staging" \
        --set env.API_URL="$STAGING_API_URL" \
        --wait --timeout=300s
      
      echo "Staging deployment completed"
      echo "URL: https://$DOMAIN"
  environment:
    name: staging
    url: https://staging-$CI_PROJECT_NAME.example.com
    kubernetes:
      namespace: staging
  dependencies:
    - build_docker_image
  rules:
    - if: $CI_COMMIT_BRANCH == "develop"

# Deploy a producción
deploy_production:
  stage: deploy
  image: alpine/helm:latest
  variables:
    KUBE_NAMESPACE: "production"
    REPLICAS: "5"
    DOMAIN: "$CI_PROJECT_NAME.example.com"
  before_script:
    - kubectl config use-context $KUBE_CONTEXT_PRODUCTION
  script:
    - |
      # Pre-deployment backup
      helm get values $CI_PROJECT_NAME -n $KUBE_NAMESPACE > backup-values.yaml || true
      
      # Blue-Green deployment strategy
      helm upgrade --install $CI_PROJECT_NAME ./helm-chart \
        --namespace $KUBE_NAMESPACE \
        --create-namespace \
        --set image.repository=$DOCKER_IMAGE \
        --set image.tag=$CI_COMMIT_SHA \
        --set replicaCount=$REPLICAS \
        --set ingress.hosts[0].host=$DOMAIN \
        --set ingress.hosts[0].paths[0].path="/" \
        --set ingress.hosts[0].paths[0].pathType="Prefix" \
        --set env.NODE_ENV="production" \
        --set env.API_URL="$PRODUCTION_API_URL" \
        --set resources.requests.cpu="100m" \
        --set resources.requests.memory="128Mi" \
        --set resources.limits.cpu="500m" \
        --set resources.limits.memory="512Mi" \
        --set autoscaling.enabled=true \
        --set autoscaling.minReplicas=3 \
        --set autoscaling.maxReplicas=10 \
        --wait --timeout=600s
      
      # Health check post-deployment
      sleep 30
      curl -f https://$DOMAIN/health || exit 1
      
      echo "Production deployment completed successfully"
      echo "URL: https://$DOMAIN"
  environment:
    name: production
    url: https://$CI_PROJECT_NAME.example.com
    kubernetes:
      namespace: production
  dependencies:
    - build_docker_image
    - deploy_staging  # Requiere staging exitoso
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
      allow_failure: false
    - if: $CI_COMMIT_TAG
      when: manual
      allow_failure: false
  artifacts:
    when: on_failure
    paths:
      - backup-values.yaml
    expire_in: 1 week

# ============================================================================
# PERFORMANCE STAGE - Pruebas de rendimiento
# ============================================================================

lighthouse_audit:
  stage: performance
  image: markhobson/node-chrome:latest
  script:
    - npm install -g lighthouse
    - lighthouse https://staging-$CI_PROJECT_NAME.example.com --output=html --output-path=lighthouse-report.html --chrome-flags="--headless --no-sandbox"
  artifacts:
    paths:
      - lighthouse-report.html
    expire_in: 1 week
  rules:
    - if: $CI_COMMIT_BRANCH == "develop"
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual

load_testing:
  stage: performance
  image: alpine:latest
  before_script:
    - apk add --no-cache curl apache2-utils
  script:
    - |
      echo "Running load tests against staging environment"
      ab -n 1000 -c 10 https://staging-$CI_PROJECT_NAME.example.com/ > load-test-results.txt
      cat load-test-results.txt
  artifacts:
    paths:
      - load-test-results.txt
    expire_in: 1 week
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual

# ============================================================================
# JOBS ESPECIALES
# ============================================================================

# Deploy review apps para merge requests
deploy_review:
  stage: deploy
  image: alpine/helm:latest
  variables:
    KUBE_NAMESPACE: "review-apps"
    REVIEW_DOMAIN: "review-$CI_MERGE_REQUEST_IID-$CI_PROJECT_NAME.example.com"
  script:
    - |
      helm upgrade --install review-$CI_MERGE_REQUEST_IID ./helm-chart \
        --namespace $KUBE_NAMESPACE \
        --create-namespace \
        --set image.repository=$DOCKER_IMAGE \
        --set image.tag=$CI_COMMIT_SHA \
        --set replicaCount=1 \
        --set ingress.hosts[0].host=$REVIEW_DOMAIN \
        --set env.NODE_ENV="review" \
        --wait --timeout=300s
  environment:
    name: review/$CI_MERGE_REQUEST_IID
    url: https://review-$CI_MERGE_REQUEST_IID-$CI_PROJECT_NAME.example.com
    on_stop: stop_review
    auto_stop_in: 1 week
  dependencies:
    - build_docker_image
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

stop_review:
  stage: deploy
  image: alpine/helm:latest
  variables:
    KUBE_NAMESPACE: "review-apps"
    GIT_STRATEGY: none
  script:
    - helm uninstall review-$CI_MERGE_REQUEST_IID --namespace $KUBE_NAMESPACE
  environment:
    name: review/$CI_MERGE_REQUEST_IID
    action: stop
  when: manual
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

# Rollback production
rollback_production:
  stage: deploy
  image: alpine/helm:latest
  variables:
    KUBE_NAMESPACE: "production"
  script:
    - kubectl config use-context $KUBE_CONTEXT_PRODUCTION
    - helm rollback $CI_PROJECT_NAME -n $KUBE_NAMESPACE
    - kubectl rollout status deployment/$CI_PROJECT_NAME -n $KUBE_NAMESPACE
  environment:
    name: production
    action: stop
  when: manual
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

## 🐳 Dockerfile optimizado para React

```dockerfile
# Multi-stage build para React
FROM node:16-alpine AS builder

# Metadata
LABEL maintainer="GitLab CI/CD Bootcamp"
LABEL description="React application with optimized production build"

# Build arguments
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

# Labels para metadata
LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.name="react-cicd-example" \
      org.label-schema.description="React CI/CD Example" \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vcs-url="https://gitlab.com/example/react-app" \
      org.label-schema.version=$VERSION \
      org.label-schema.schema-version="1.0"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# ============================================================================
# Production stage
# ============================================================================
FROM nginx:alpine

# Install security updates
RUN apk --no-cache upgrade

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=builder /app/build /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001

# Change ownership
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Create nginx PID directory
RUN mkdir -p /var/run/nginx && \
    chown -R nginx:nginx /var/run/nginx

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

## ⚙️ Configuración Nginx

```nginx
# nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging format
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        application/atom+xml
        application/javascript
        application/json
        application/ld+json
        application/manifest+json
        application/rss+xml
        application/vnd.geo+json
        application/vnd.ms-fontobject
        application/x-font-ttf
        application/x-web-app-manifest+json
        application/xhtml+xml
        application/xml
        font/opentype
        image/bmp
        image/svg+xml
        image/x-icon
        text/cache-manifest
        text/css
        text/plain
        text/vcard
        text/vnd.rim.location.xloc
        text/vtt
        text/x-component
        text/x-cross-domain-policy;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    server {
        listen 8080;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html index.htm;

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Main application
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Static assets caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Error pages
        error_page 404 /index.html;
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
```

## 🎯 Ejercicio práctico

### Objetivo
Implementar pipeline completo para aplicación React.

### Pasos

1. **Crear aplicación React**
   ```bash
   npx create-react-app react-cicd-example
   cd react-cicd-example
   ```

2. **Configurar testing**
   ```bash
   npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event
   ```

3. **Añadir pipeline CI/CD**
   - Copiar `.gitlab-ci.yml` del ejemplo
   - Configurar variables en GitLab
   - Ajustar configuración según necesidades

4. **Configurar despliegue**
   - Crear Dockerfile
   - Configurar Kubernetes/Helm charts
   - Configurar dominios y certificados

5. **Testing y validación**
   - Ejecutar pipeline completo
   - Validar despliegues en cada ambiente
   - Verificar métricas de rendimiento

---

**Anterior:** [5.1 Multi-ambiente (dev, staging, prod)](../parte5-avanzado/01-multi-ambiente.md)  
**Siguiente:** [Guía de inicio rápido](../QUICK_START.md)

## 📚 Recursos adicionales

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress E2E Testing](https://docs.cypress.io/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)