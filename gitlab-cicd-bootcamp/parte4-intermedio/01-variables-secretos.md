# 4.1 Variables y secretos

## 🎯 Objetivo
Aprender a manejar variables de entorno, secretos y configuraciones en GitLab CI/CD de forma segura y eficiente.

## 🔐 Tipos de variables en GitLab

### 1. Variables predefinidas
GitLab proporciona automáticamente más de 100 variables:

```yaml
print_variables:
  script:
    - echo "Proyecto: $CI_PROJECT_NAME"
    - echo "Branch: $CI_COMMIT_BRANCH"
    - echo "Commit: $CI_COMMIT_SHA"
    - echo "Usuario: $GITLAB_USER_NAME"
    - echo "Pipeline ID: $CI_PIPELINE_ID"
    - echo "Job ID: $CI_JOB_ID"
    - echo "Registry: $CI_REGISTRY"
```

### 2. Variables personalizadas
Definidas en diferentes niveles de alcance:

#### En .gitlab-ci.yml (públicas)
```yaml
variables:
  NODE_VERSION: "16"
  APP_NAME: "mi-aplicacion"
  BUILD_ENV: "production"

build_job:
  script:
    - echo "Building $APP_NAME with Node.js $NODE_VERSION"
```

#### Variables a nivel de proyecto
```bash
# Settings > CI/CD > Variables
DATABASE_URL: "postgresql://localhost:5432/mydb"
API_KEY: "secret_key_value"  # Marcada como protected/masked
```

## 🌍 Niveles de alcance

### Prioridad de variables (mayor a menor)
1. **Job level** - Variables definidas en el job específico
2. **Pipeline level** - Variables definidas para todo el pipeline
3. **Project level** - Variables del proyecto
4. **Group level** - Variables del grupo
5. **Instance level** - Variables de la instancia GitLab

### Ejemplo de jerarquía
```yaml
# Variables globales del pipeline
variables:
  ENVIRONMENT: "development"
  NODE_VERSION: "16"

# Variables específicas del job
deploy_job:
  variables:
    ENVIRONMENT: "production"  # Sobrescribe la global
    DEPLOY_REGION: "us-west-2"
  script:
    - echo "Deploying to $ENVIRONMENT in $DEPLOY_REGION"
    - echo "Using Node.js $NODE_VERSION"
```

## 🔒 Variables protegidas y enmascaradas

### Variables protegidas
Solo disponibles en ramas/tags protegidos:

```yaml
# Esta variable solo estará disponible en rama 'main'
deploy_production:
  script:
    - echo "Deploy key: $PRODUCTION_DEPLOY_KEY"
  only:
    - main
```

### Variables enmascaradas
Se ocultan en los logs del job:

```yaml
test_api:
  script:
    - curl -H "Authorization: Bearer $SECRET_TOKEN" api.example.com
    # $SECRET_TOKEN aparecerá como [MASKED] en los logs
```

### Configuración en GitLab UI
```
Settings > CI/CD > Variables

Variable: API_SECRET_KEY
Value: sk_live_123456789abcdef
Type: Variable
Environment scope: *
Flags:
  ☑ Protect variable (solo en ramas protegidas)
  ☑ Mask variable (ocultar en logs)
  ☐ Expand variable reference
```

## 📂 Variables por entorno

### Scope de entornos
```yaml
# Variables específicas por entorno
variables:
  DATABASE_HOST: "localhost"  # Por defecto

# En Settings > CI/CD > Variables:
# DATABASE_HOST: "dev-db.example.com" (scope: develop)
# DATABASE_HOST: "prod-db.example.com" (scope: production)

deploy_dev:
  environment:
    name: develop
  script:
    - echo "Connecting to $DATABASE_HOST"  # dev-db.example.com

deploy_prod:
  environment:
    name: production
  script:
    - echo "Connecting to $DATABASE_HOST"  # prod-db.example.com
```

### Configuración avanzada de scope
```yaml
# Variables con scope específico
development_deploy:
  variables:
    API_URL: "https://dev-api.example.com"
    LOG_LEVEL: "debug"
  environment:
    name: develop
  script:
    - ./deploy.sh $API_URL

production_deploy:
  variables:
    API_URL: "https://api.example.com"
    LOG_LEVEL: "error"
  environment:
    name: production
  script:
    - ./deploy.sh $API_URL
```

## 🧩 Interpolación de variables

### Sintaxis de GitLab
```yaml
variables:
  PROJECT_NAME: "mi-app"
  VERSION: "1.0.0"
  DOCKER_IMAGE: "$CI_REGISTRY_IMAGE/$PROJECT_NAME:$VERSION"
  FULL_IMAGE_NAME: "${CI_REGISTRY_IMAGE}/${PROJECT_NAME}:${VERSION}"

build_docker:
  script:
    - docker build -t $DOCKER_IMAGE .
    - docker push $FULL_IMAGE_NAME
```

### Variables con valores por defecto
```yaml
variables:
  NODE_VERSION: "${NODE_VERSION:-16}"  # Usa 16 si no está definida
  ENVIRONMENT: "${CI_COMMIT_BRANCH:-development}"

build_job:
  script:
    - echo "Using Node.js $NODE_VERSION"
    - echo "Environment: $ENVIRONMENT"
```

## 🗂️ Archivos de variables

### Tipo File
Para archivos de configuración o certificados:

```yaml
# En Settings > CI/CD > Variables
# Variable: SSH_PRIVATE_KEY
# Type: File
# Value: [contenido de la clave privada]

deploy_job:
  script:
    - chmod 600 $SSH_PRIVATE_KEY
    - ssh -i $SSH_PRIVATE_KEY user@server "deploy.sh"
```

### Variables desde archivo
```yaml
# Cargar variables desde archivo
load_config:
  script:
    - cat config.env  # Archivo con formato KEY=value
    - source config.env
    - echo "Database: $DATABASE_URL"
  artifacts:
    reports:
      dotenv: config.env  # Hace disponibles las vars para jobs siguientes
```

## 🔐 Gestión de secretos

### Mejores prácticas para secretos

#### ✅ Correcto
```yaml
# Variables protegidas y enmascaradas
deploy_production:
  script:
    - kubectl create secret generic app-secrets 
      --from-literal=db-password="$DB_PASSWORD"
      --from-literal=api-key="$API_SECRET"
  only:
    - main
  when: manual
```

#### ❌ Incorrecto
```yaml
# NUNCA hagas esto
deploy_job:
  variables:
    SECRET_KEY: "sk_live_123456789"  # Secreto visible en código
  script:
    - echo "Secret: $SECRET_KEY"    # Secreto visible en logs
```

### Rotación de secretos
```yaml
# Job para actualizar secretos
rotate_secrets:
  stage: maintenance
  script:
    - ./rotate-api-keys.sh
    - ./update-database-passwords.sh
  when: manual
  allow_failure: false
  only:
    variables:
      - $ROTATE_SECRETS == "true"
```

## 🌐 Variables dinámicas

### Generar variables en runtime
```yaml
prepare_env:
  script:
    - export BUILD_TIMESTAMP=$(date +%s)
    - export COMMIT_MESSAGE="$(git log -1 --pretty=%B)"
    - echo "BUILD_TIMESTAMP=$BUILD_TIMESTAMP" >> build.env
    - echo "COMMIT_MESSAGE=$COMMIT_MESSAGE" >> build.env
  artifacts:
    reports:
      dotenv: build.env

use_dynamic_vars:
  script:
    - echo "Build timestamp: $BUILD_TIMESTAMP"
    - echo "Commit message: $COMMIT_MESSAGE"
  dependencies:
    - prepare_env
```

### Variables condicionales
```yaml
variables:
  DEPLOY_STRATEGY: 
    value: "blue-green"
    description: "Deployment strategy (blue-green, rolling, recreate)"

set_deployment_vars:
  script:
    - |
      if [ "$DEPLOY_STRATEGY" = "blue-green" ]; then
        echo "DEPLOYMENT_SLOTS=2" >> deploy.env
        echo "DEPLOYMENT_TIMEOUT=300" >> deploy.env
      elif [ "$DEPLOY_STRATEGY" = "rolling" ]; then
        echo "DEPLOYMENT_SLOTS=1" >> deploy.env
        echo "DEPLOYMENT_TIMEOUT=600" >> deploy.env
      fi
  artifacts:
    reports:
      dotenv: deploy.env
```

## 🧪 Testing con variables

### Variables de test
```yaml
variables:
  TEST_DATABASE_URL: "postgresql://test:test@localhost:5432/test_db"
  TEST_API_URL: "http://localhost:3001"

unit_tests:
  services:
    - postgres:13
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: test
    POSTGRES_PASSWORD: test
  script:
    - npm run test
  coverage: '/Coverage: \d+\.\d+%/'
```

### Mock de variables en desarrollo
```yaml
# Para desarrollo local sin acceso a secretos de producción
test_with_mocks:
  variables:
    API_KEY: "mock_api_key_for_testing"
    DATABASE_URL: "postgresql://localhost:5432/test_db"
  script:
    - npm run test:with-mocks
  only:
    - merge_requests
```

## 📊 Monitoreo de variables

### Logging seguro de variables
```yaml
debug_environment:
  script:
    - echo "=== Environment Information ==="
    - echo "Node version: $(node --version)"
    - echo "Environment: $ENVIRONMENT"
    - echo "Database host: ${DATABASE_HOST:0:10}..." # Solo primeros 10 chars
    - echo "API URL: $API_URL"
    # NO imprimir secretos
  when: manual
```

### Validación de variables requeridas
```yaml
validate_config:
  script:
    - |
      check_var() {
        if [ -z "${!1}" ]; then
          echo "Error: Variable $1 is required but not set"
          exit 1
        fi
      }
      
      check_var "DATABASE_URL"
      check_var "API_SECRET_KEY"
      check_var "ENVIRONMENT"
      
      echo "All required variables are set"
```

## 🎯 Ejemplo práctico completo

```yaml
# .gitlab-ci.yml con gestión completa de variables
stages:
  - validate
  - build
  - test
  - deploy

variables:
  # Variables públicas
  NODE_VERSION: "16"
  APP_NAME: "my-awesome-app"
  DOCKER_REGISTRY: "$CI_REGISTRY"
  
  # Variables por defecto
  ENVIRONMENT: "${CI_COMMIT_BRANCH}"
  LOG_LEVEL: "${LOG_LEVEL:-info}"

# Validar configuración
validate_environment:
  stage: validate
  script:
    - |
      echo "=== Validating environment variables ==="
      
      # Variables requeridas
      required_vars=("DATABASE_URL" "API_SECRET_KEY" "SMTP_PASSWORD")
      
      for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
          echo "❌ Error: $var is required for deployment"
          exit 1
        else
          echo "✅ $var is set"
        fi
      done
      
      echo "✅ All variables validated successfully"
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_COMMIT_BRANCH == "develop"

# Build con variables
build_application:
  stage: build
  image: node:$NODE_VERSION
  variables:
    NODE_ENV: "production"
  before_script:
    - echo "Building $APP_NAME version $CI_COMMIT_SHORT_SHA"
  script:
    - npm ci
    - npm run build
    - echo "BUILD_VERSION=$CI_COMMIT_SHORT_SHA" >> build.env
    - echo "BUILD_DATE=$(date -Iseconds)" >> build.env
  artifacts:
    paths:
      - dist/
    reports:
      dotenv: build.env
    expire_in: 1 hour

# Tests con configuración específica
test_application:
  stage: test
  image: node:$NODE_VERSION
  services:
    - postgres:13
    - redis:6
  variables:
    # Variables específicas para testing
    NODE_ENV: "test"
    DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/test_db"
    REDIS_URL: "redis://redis:6379/0"
    LOG_LEVEL: "debug"
  script:
    - npm run test:all
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'

# Deploy con variables por entorno
.deploy_template: &deploy_template
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl jq
    - echo "Deploying $APP_NAME to $ENVIRONMENT"
    - echo "Build version: $BUILD_VERSION"
  script:
    - ./scripts/deploy.sh
  dependencies:
    - build_application

deploy_staging:
  <<: *deploy_template
  variables:
    ENVIRONMENT: "staging"
    REPLICAS: "2"
    RESOURCES_LIMIT: "0.5"
  environment:
    name: staging
    url: https://staging-$APP_NAME.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "develop"

deploy_production:
  <<: *deploy_template
  variables:
    ENVIRONMENT: "production"
    REPLICAS: "5"
    RESOURCES_LIMIT: "2.0"
  environment:
    name: production
    url: https://$APP_NAME.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
  allow_failure: false
```

## 🎯 Ejercicio práctico

### Objetivo
Configurar variables en diferentes niveles y practicar con secretos.

### Pasos

1. **Configurar variables en GitLab UI**
   ```
   Settings > CI/CD > Variables
   
   Variables a crear:
   - APP_VERSION: "1.0.0" (no protegida)
   - DATABASE_URL: "postgresql://..." (protegida)
   - API_SECRET: "secret123" (protegida + enmascarada)
   - SSH_PRIVATE_KEY: [contenido] (tipo: File)
   ```

2. **Crear pipeline que use las variables**
   ```yaml
   # .gitlab-ci.yml
   stages:
     - validate
     - deploy
   
   variables:
     APP_NAME: "bootcamp-app"
     ENVIRONMENT: "${CI_COMMIT_BRANCH}"
   
   validate_vars:
     stage: validate
     script:
       - echo "App: $APP_NAME"
       - echo "Version: $APP_VERSION"
       - echo "Environment: $ENVIRONMENT"
       - echo "Database host: ${DATABASE_URL:0:10}..."
       - echo "SSH key file: $SSH_PRIVATE_KEY"
   
   deploy_app:
     stage: deploy
     script:
       - echo "Deploying $APP_NAME v$APP_VERSION"
       - echo "Connecting to database..."
       - echo "Using SSH key for deployment"
     rules:
       - if: $CI_COMMIT_BRANCH == "main"
   ```

3. **Experimentar con scope**
   - Crear variables con scope específico para diferentes ramas
   - Observar cómo cambian los valores según el contexto

---

**Anterior:** [3.2 Tu primer pipeline](../parte3-pipeline-basico/02-primer-pipeline.md)  
**Siguiente:** [4.2 Caché y artefactos](./02-cache-artefactos.md)

## 📚 Recursos adicionales

- [GitLab CI/CD Variables](https://docs.gitlab.com/ee/ci/variables/)
- [Predefined Variables](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)
- [Variable Security](https://docs.gitlab.com/ee/ci/variables/#mask-a-cicd-variable)