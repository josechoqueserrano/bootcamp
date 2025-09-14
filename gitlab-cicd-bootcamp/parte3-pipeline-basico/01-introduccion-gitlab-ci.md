# 3.1 Introducción a .gitlab-ci.yml

## 🎯 Objetivo
Entender la estructura y sintaxis del archivo `.gitlab-ci.yml`, el corazón de GitLab CI/CD.

## 📄 ¿Qué es .gitlab-ci.yml?

El archivo `.gitlab-ci.yml` es un archivo YAML que define la estructura de tu pipeline CI/CD. Debe estar ubicado en la raíz de tu repositorio y contiene todas las instrucciones para que GitLab Runner ejecute tus jobs.

### Características principales
- **Formato YAML**: Sintaxis limpia y legible
- **Ubicación**: Raíz del repositorio
- **Versionado**: Se versiona junto con tu código
- **Ejecución**: Se ejecuta automáticamente en eventos de Git

## 🏗️ Estructura básica

### Ejemplo mínimo
```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build_job:
  stage: build
  script:
    - echo "Building the application..."

test_job:
  stage: test
  script:
    - echo "Running tests..."

deploy_job:
  stage: deploy
  script:
    - echo "Deploying application..."
```

## 📋 Componentes principales

### 1. Stages (Etapas)
Define el orden de ejecución de las fases del pipeline.

```yaml
stages:
  - prepare     # Preparación
  - build       # Construcción
  - test        # Pruebas
  - security    # Análisis de seguridad
  - deploy      # Despliegue
  - cleanup     # Limpieza
```

#### Stages por defecto
Si no defines stages, GitLab usa estos por defecto:
```yaml
stages:
  - .pre
  - build
  - test
  - deploy
  - .post
```

### 2. Jobs (Trabajos)
Unidades individuales de ejecución dentro de un stage.

```yaml
compile_app:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/

unit_tests:
  stage: test
  script:
    - npm run test:unit
  coverage: '/Coverage: \d+\.\d+%/'
```

### 3. Scripts
Comandos que se ejecutan en el job.

```yaml
my_job:
  script:
    - echo "Comando 1"
    - echo "Comando 2"
    - |
      echo "Script multilínea"
      for i in {1..3}; do
        echo "Iteración $i"
      done
```

## 🔧 Palabras clave principales

### Variables
```yaml
variables:
  NODE_VERSION: "16"
  APP_NAME: "mi-aplicacion"
  DATABASE_URL: "postgresql://localhost:5432/mydb"

build_job:
  script:
    - echo "Building $APP_NAME with Node.js $NODE_VERSION"
```

### Image (Imagen Docker)
```yaml
# Global para todos los jobs
image: node:16

# Específica para un job
build_job:
  image: node:16-alpine
  script:
    - npm install
```

### Before_script y After_script
```yaml
# Ejecutado antes de cada job
before_script:
  - apt-get update -qq
  - apt-get install -y git

# Para job específico
my_job:
  before_script:
    - echo "Preparando entorno específico"
  script:
    - echo "Ejecutando job principal"
  after_script:
    - echo "Limpiando después del job"
```

### Cache
```yaml
# Cache global
cache:
  paths:
    - node_modules/
    - .npm/

# Cache específico por job
build_job:
  cache:
    key: "$CI_COMMIT_REF_SLUG"
    paths:
      - node_modules/
  script:
    - npm ci
```

### Artifacts
```yaml
build_job:
  script:
    - npm run build
  artifacts:
    name: "build-$CI_COMMIT_SHORT_SHA"
    paths:
      - dist/
      - build/
    expire_in: 1 week
    reports:
      junit: test-results.xml
```

## 🎛️ Configuración de jobs

### Tags
```yaml
# Job que requiere runner específico
deploy_production:
  stage: deploy
  tags:
    - production
    - docker
  script:
    - ./deploy.sh
```

### Only/Except (Reglas clásicas)
```yaml
# Solo en rama main
deploy_job:
  stage: deploy
  script:
    - ./deploy.sh
  only:
    - main

# Excepto en ramas feature
test_job:
  stage: test
  script:
    - npm test
  except:
    - /^feature\/.*$/
```

### Rules (Reglas modernas - recomendado)
```yaml
# Sintaxis moderna con rules
deploy_job:
  stage: deploy
  script:
    - ./deploy.sh
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_COMMIT_TAG'

test_job:
  stage: test
  script:
    - npm test
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == "main"'
```

### When
```yaml
# Ejecución condicional
cleanup_job:
  stage: cleanup
  script:
    - ./cleanup.sh
  when: always  # always, on_success, on_failure, manual, delayed

# Job manual
deploy_production:
  stage: deploy
  script:
    - ./deploy-prod.sh
  when: manual
  only:
    - main
```

## 🌐 Variables predefinidas

GitLab proporciona muchas variables automáticamente:

```yaml
print_info:
  script:
    - echo "Pipeline ID: $CI_PIPELINE_ID"
    - echo "Commit SHA: $CI_COMMIT_SHA"
    - echo "Branch: $CI_COMMIT_BRANCH" 
    - echo "Tag: $CI_COMMIT_TAG"
    - echo "Project: $CI_PROJECT_NAME"
    - echo "User: $GITLAB_USER_NAME"
```

### Variables más útiles
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `CI_COMMIT_SHA` | Hash del commit | `1ecfd275763eff1d6b4844ea3168962458c9f27a` |
| `CI_COMMIT_SHORT_SHA` | Hash corto | `1ecfd275` |
| `CI_COMMIT_BRANCH` | Nombre de la rama | `main`, `feature/login` |
| `CI_COMMIT_TAG` | Tag del commit | `v1.0.0` |
| `CI_PROJECT_NAME` | Nombre del proyecto | `mi-proyecto` |
| `CI_PIPELINE_ID` | ID del pipeline | `123456` |

## 📁 Ejemplo completo de Node.js

```yaml
# .gitlab-ci.yml para aplicación Node.js
stages:
  - install
  - lint
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "16"
  NPM_CONFIG_CACHE: ".npm"

# Cache global
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .npm/

# Instalación de dependencias
install_dependencies:
  stage: install
  image: node:$NODE_VERSION
  before_script:
    - node --version
    - npm --version
  script:
    - npm ci
  artifacts:
    paths:
      - node_modules/
    expire_in: 30 mins

# Linting del código
lint_code:
  stage: lint
  image: node:$NODE_VERSION
  script:
    - npm run lint
  dependencies:
    - install_dependencies

# Pruebas unitarias
unit_tests:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm run test:unit
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
  dependencies:
    - install_dependencies

# Pruebas de integración
integration_tests:
  stage: test
  image: node:$NODE_VERSION
  services:
    - postgres:13
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
  script:
    - npm run test:integration
  dependencies:
    - install_dependencies

# Build de la aplicación
build_app:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
  dependencies:
    - install_dependencies
  only:
    - main
    - develop

# Deploy a staging
deploy_staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache rsync openssh
  script:
    - echo "Deploying to staging..."
    - rsync -avz --delete dist/ user@staging-server:/var/www/app/
  environment:
    name: staging
    url: https://staging.miapp.com
  dependencies:
    - build_app
  only:
    - develop

# Deploy a producción (manual)
deploy_production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache rsync openssh
  script:
    - echo "Deploying to production..."
    - rsync -avz --delete dist/ user@prod-server:/var/www/app/
  environment:
    name: production
    url: https://miapp.com
  dependencies:
    - build_app
  when: manual
  only:
    - main
```

## 🔍 Validación del archivo

### Usando GitLab CI Lint
1. Ve a tu proyecto > CI/CD > Pipelines
2. Clic en "CI Lint"
3. Pega tu `.gitlab-ci.yml`
4. Clic en "Validate"

### Usando línea de comandos
```bash
# Si tienes gitlab-runner instalado
gitlab-runner exec docker test_job

# Validar sintaxis YAML
python -c "import yaml; yaml.load(open('.gitlab-ci.yml'), Loader=yaml.FullLoader)"
```

## 🚨 Errores comunes

### 1. Indentación incorrecta
```yaml
# ❌ Incorrecto
stages:
- build
- test

build_job:
stage: build  # Falta indentación
script:
  - echo "Building..."

# ✅ Correcto
stages:
  - build
  - test

build_job:
  stage: build
  script:
    - echo "Building..."
```

### 2. Stage no definido
```yaml
# ❌ Incorrecto - stage 'compile' no está en la lista
stages:
  - build
  - test

compile_job:
  stage: compile  # Este stage no existe
  script:
    - make compile
```

### 3. Sintaxis YAML inválida
```yaml
# ❌ Incorrecto - comillas inconsistentes
variables:
  APP_NAME: "mi-app'  # Comilla de cierre incorrecta

# ✅ Correcto
variables:
  APP_NAME: "mi-app"
```

## 🎯 Ejercicio práctico

### Objetivo
Crear tu primer `.gitlab-ci.yml` funcional.

### Pasos

1. **Crear estructura básica**
   ```yaml
   # .gitlab-ci.yml
   stages:
     - prepare
     - test
     - build
   
   variables:
     PROJECT_NAME: "mi-primer-pipeline"
   
   before_script:
     - echo "Iniciando job en $PROJECT_NAME"
   ```

2. **Añadir job de preparación**
   ```yaml
   setup_env:
     stage: prepare
     script:
       - echo "Preparando entorno..."
       - date
       - whoami
       - pwd
   ```

3. **Añadir job de testing**
   ```yaml
   run_tests:
     stage: test
     script:
       - echo "Ejecutando tests..."
       - echo "✅ Test 1: OK"
       - echo "✅ Test 2: OK"
       - echo "✅ Test 3: OK"
   ```

4. **Añadir job de build**
   ```yaml
   build_project:
     stage: build
     script:
       - echo "Building $PROJECT_NAME..."
       - mkdir -p build
       - echo "Build completed on $(date)" > build/info.txt
     artifacts:
       paths:
         - build/
       expire_in: 1 hour
   ```

5. **Archivo completo**
   ```yaml
   stages:
     - prepare
     - test
     - build
   
   variables:
     PROJECT_NAME: "mi-primer-pipeline"
   
   before_script:
     - echo "Iniciando job en $PROJECT_NAME"
   
   setup_env:
     stage: prepare
     script:
       - echo "Preparando entorno..."
       - date
       - whoami
       - pwd
   
   run_tests:
     stage: test
     script:
       - echo "Ejecutando tests..."
       - echo "✅ Test 1: OK"
       - echo "✅ Test 2: OK"
       - echo "✅ Test 3: OK"
   
   build_project:
     stage: build
     script:
       - echo "Building $PROJECT_NAME..."
       - mkdir -p build
       - echo "Build completed on $(date)" > build/info.txt
     artifacts:
       paths:
         - build/
       expire_in: 1 hour
   ```

6. **Commit y verificación**
   ```bash
   git add .gitlab-ci.yml
   git commit -m "ci: add basic pipeline configuration"
   git push origin main
   ```

7. **Monitorear ejecución**
   - Ve a CI/CD > Pipelines
   - Observa la ejecución de cada stage
   - Revisa los logs de cada job
   - Descarga los artifacts generados

### Experimentos adicionales

1. **Añadir job que falla**
   ```yaml
   failing_job:
     stage: test
     script:
       - echo "Este job va a fallar..."
       - exit 1
     allow_failure: true
   ```

2. **Job manual**
   ```yaml
   manual_deploy:
     stage: build
     script:
       - echo "Deploy manual ejecutado"
     when: manual
   ```

3. **Job condicional**
   ```yaml
   conditional_job:
     stage: build
     script:
       - echo "Solo en rama main"
     rules:
       - if: '$CI_COMMIT_BRANCH == "main"'
   ```

---

**Anterior:** [2.2 Instalación de GitLab Runner](../parte2-runner/02-instalacion-runner.md)  
**Siguiente:** [3.2 Tu primer pipeline](./02-primer-pipeline.md)

## 📚 Recursos adicionales

- [GitLab CI/CD YAML syntax reference](https://docs.gitlab.com/ee/ci/yaml/)
- [GitLab CI/CD Variables](https://docs.gitlab.com/ee/ci/variables/)
- [GitLab CI Lint](https://docs.gitlab.com/ee/ci/lint.html)
- [YAML Tutorial](https://yaml.org/spec/1.2/spec.html)