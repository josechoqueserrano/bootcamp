# 🚀 Guía de Inicio Rápido - GitLab CI/CD

Esta guía te permitirá configurar tu primer pipeline CI/CD en GitLab en menos de 30 minutos.

## ⚡ Setup en 5 pasos

### 1. 📝 Crear proyecto en GitLab (2 minutos)

```bash
# Opción A: Clonar proyecto existente
git clone https://gitlab.com/tu-usuario/tu-proyecto.git
cd tu-proyecto

# Opción B: Crear proyecto nuevo
mkdir mi-proyecto-cicd
cd mi-proyecto-cicd
git init
git remote add origin https://gitlab.com/tu-usuario/mi-proyecto-cicd.git
```

### 2. 📦 Configurar aplicación básica (5 minutos)

#### Para Node.js:
```bash
# Crear package.json
npm init -y

# Instalar dependencias básicas
npm install express
npm install --save-dev jest

# Crear estructura básica
mkdir src tests
echo 'console.log("Hello GitLab CI/CD!");' > src/index.js
echo 'test("básico", () => expect(1+1).toBe(2));' > tests/basic.test.js
```

#### Para React:
```bash
# Crear aplicación React
npx create-react-app .
npm test -- --coverage --ci
```

### 3. 🔧 Crear .gitlab-ci.yml (10 minutos)

```yaml
# .gitlab-ci.yml - Pipeline básico
stages:
  - test
  - build
  - deploy

# Variables
variables:
  NODE_VERSION: "16"

# Tests
test_job:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm test
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'

# Build
build_job:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/  # o build/ para React
    expire_in: 1 hour
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

# Deploy simple
deploy_job:
  stage: deploy
  script:
    - echo "Deploying to production..."
    - echo "App deployed at https://mi-app.com"
  environment:
    name: production
    url: https://mi-app.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
```

### 4. 🚀 Primer commit y push (3 minutos)

```bash
# Añadir archivos
git add .
git commit -m "ci: initial GitLab CI/CD setup"
git push -u origin main
```

### 5. ✅ Verificar pipeline (5 minutos)

1. Ve a tu proyecto en GitLab
2. Navega a **CI/CD > Pipelines**
3. Observa tu primer pipeline ejecutándose
4. Revisa los logs de cada job

## 🎯 Templates listos para usar

### Template Node.js Express API

```yaml
# .gitlab-ci.yml para API Node.js
image: node:16

stages:
  - install
  - lint
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

install:
  stage: install
  script:
    - npm ci
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour

lint:
  stage: lint
  script:
    - npm run lint
  dependencies:
    - install

test:
  stage: test
  script:
    - npm test
  dependencies:
    - install
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
  dependencies:
    - install
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy_staging:
  stage: deploy
  script:
    - echo "Deploy to staging"
  environment:
    name: staging
    url: https://staging-api.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy_production:
  stage: deploy
  script:
    - echo "Deploy to production"
  environment:
    name: production
    url: https://api.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
```

### Template React SPA

```yaml
# .gitlab-ci.yml para aplicación React
image: node:16

stages:
  - install
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

variables:
  REACT_APP_VERSION: $CI_COMMIT_SHORT_SHA

install:
  stage: install
  script:
    - npm ci
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour

test:
  stage: test
  script:
    - npm test -- --coverage --ci
  dependencies:
    - install
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - build/
    expire_in: 1 week
  dependencies:
    - install
  rules:
    - if: $CI_COMMIT_BRANCH

deploy_netlify:
  stage: deploy
  image: node:16
  script:
    - npm install -g netlify-cli
    - netlify deploy --prod --dir=build --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH_TOKEN
  dependencies:
    - build
  environment:
    name: production
    url: https://mi-app.netlify.app
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

### Template Docker + Kubernetes

```yaml
# .gitlab-ci.yml con Docker y Kubernetes
image: docker:latest

services:
  - docker:dind

stages:
  - build
  - test
  - package
  - deploy

variables:
  DOCKER_REGISTRY: $CI_REGISTRY
  IMAGE_NAME: $CI_REGISTRY_IMAGE

build:
  stage: build
  script:
    - docker build -t $IMAGE_NAME:$CI_COMMIT_SHA .
    - echo "IMAGE_TAG=$CI_COMMIT_SHA" >> build.env
  artifacts:
    reports:
      dotenv: build.env

test:
  stage: test
  script:
    - docker run --rm $IMAGE_NAME:$CI_COMMIT_SHA npm test

package:
  stage: package
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
  script:
    - docker push $IMAGE_NAME:$CI_COMMIT_SHA
    - docker tag $IMAGE_NAME:$CI_COMMIT_SHA $IMAGE_NAME:latest
    - docker push $IMAGE_NAME:latest

deploy:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/mi-app mi-app=$IMAGE_NAME:$IMAGE_TAG
    - kubectl rollout status deployment/mi-app
  environment:
    name: production
    url: https://mi-app.k8s.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
```

## 🔧 Configuraciones básicas

### Variables necesarias por proyecto

#### Variables públicas (en .gitlab-ci.yml)
```yaml
variables:
  NODE_VERSION: "16"
  APP_NAME: "mi-aplicacion"
  DOCKER_REGISTRY: "$CI_REGISTRY"
```

#### Variables secretas (en GitLab UI)
```
Settings > CI/CD > Variables

Para APIs:
- DATABASE_URL (protected + masked)
- API_SECRET_KEY (protected + masked)
- JWT_SECRET (protected + masked)

Para despliegue:
- DEPLOY_TOKEN (protected + masked)
- KUBE_CONFIG (type: file, protected)
- SSH_PRIVATE_KEY (type: file, protected)

Para servicios externos:
- NETLIFY_AUTH_TOKEN (masked)
- AWS_ACCESS_KEY_ID (protected + masked)
- AWS_SECRET_ACCESS_KEY (protected + masked)
```

## 🐛 Solución de problemas comunes

### Pipeline no se ejecuta
```yaml
# Verificar que .gitlab-ci.yml esté en la raíz
# Validar sintaxis YAML en CI/CD > Pipelines > CI Lint

# Verificar reglas
rules:
  - if: $CI_COMMIT_BRANCH  # Se ejecuta en cualquier branch
  - if: $CI_COMMIT_TAG     # Se ejecuta en tags
```

### Job falla por dependencias
```yaml
# Asegurar cache correcto
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/

# Usar artifacts entre jobs
install_job:
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour

test_job:
  dependencies:
    - install_job
```

### Problemas de permisos
```yaml
# Para Docker
services:
  - docker:dind
variables:
  DOCKER_HOST: tcp://docker:2376
  DOCKER_TLS_CERTDIR: "/certs"

# Para archivos
before_script:
  - chmod +x scripts/deploy.sh
```

## 📊 Métricas básicas de éxito

### Tiempos objetivo por pipeline
- **Pequeño proyecto**: < 5 minutos
- **Proyecto mediano**: < 15 minutos  
- **Proyecto grande**: < 30 minutos

### Coverage objetivo
- **Mínimo**: 70%
- **Recomendado**: 80%+
- **Excelente**: 90%+

## 🎓 Próximos pasos

### Después de tu primer pipeline exitoso:

1. **Añadir más tests** ([Parte 3](./parte3-pipeline-basico/))
   - Tests unitarios
   - Tests de integración
   - Tests E2E

2. **Configurar ambientes** ([Parte 5](./parte5-avanzado/))
   - Development
   - Staging  
   - Production

3. **Optimizar pipeline** ([Parte 4](./parte4-intermedio/))
   - Cache inteligente
   - Jobs paralelos
   - Artifacts optimizados

4. **Seguridad** ([Parte 5](./parte5-avanzado/))
   - Dependency scanning
   - SAST/DAST
   - Container scanning

## 🆘 ¿Necesitas ayuda?

### Recursos de apoyo
- 📖 [Documentación completa del bootcamp](./README.md)
- 💬 [Comunidad GitLab](https://forum.gitlab.com/)
- 📺 [GitLab YouTube](https://www.youtube.com/c/GitLabUnfiltered)
- 🐦 [GitLab Twitter](https://twitter.com/gitlab)

### Comandos útiles para debugging
```bash
# Validar .gitlab-ci.yml localmente
gitlab-runner exec docker nombre_del_job

# Ver logs detallados
gitlab-runner --debug run

# Verificar sintaxis YAML
python -c "import yaml; yaml.load(open('.gitlab-ci.yml'), Loader=yaml.FullLoader)"
```

---

**¡Felicidades! 🎉 Has completado tu primera configuración de GitLab CI/CD.**

**Siguiente paso:** Explora los [ejemplos completos](./ejemplos/) para casos de uso más avanzados.