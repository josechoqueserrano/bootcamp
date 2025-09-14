# 1.2 Configuración inicial de proyecto

## 🎯 Objetivo
Aprender a crear y configurar un proyecto en GitLab desde cero, incluyendo configuraciones básicas y buenas prácticas.

## 📋 Prerrequisitos
- Cuenta en GitLab (gitlab.com o instancia propia)
- Git instalado localmente
- Editor de código (VS Code, Sublime, etc.)

## 🚀 Paso 1: Crear proyecto en GitLab

### Opción A: Desde la interfaz web

1. **Accede a GitLab**
   ```
   https://gitlab.com
   ```

2. **Crear nuevo proyecto**
   - Clic en "New project"
   - Selecciona "Create blank project"

3. **Configuración del proyecto**
   ```
   Project name: mi-primer-proyecto-cicd
   Project slug: mi-primer-proyecto-cicd
   Visibility: Private (recomendado para empezar)
   Initialize with README: ✅
   ```

### Opción B: Desde línea de comandos

```bash
# Crear directorio local
mkdir mi-primer-proyecto-cicd
cd mi-primer-proyecto-cicd

# Inicializar repositorio
git init
git remote add origin https://gitlab.com/tu-usuario/mi-primer-proyecto-cicd.git

# Crear archivo README
echo "# Mi Primer Proyecto CI/CD" > README.md
git add README.md
git commit -m "Initial commit"
git push -u origin main
```

## 🔧 Paso 2: Configuración básica del proyecto

### Configuración de perfil
```bash
# Configurar nombre y email globalmente
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"

# O específicamente para este proyecto
git config user.name "Tu Nombre"
git config user.email "tu.email@ejemplo.com"
```

### Configurar SSH (recomendado)

1. **Generar clave SSH**
   ```bash
   ssh-keygen -t ed25519 -C "tu.email@ejemplo.com"
   # Presiona Enter para usar la ubicación por defecto
   # Opcionalmente añade una passphrase
   ```

2. **Añadir clave a GitLab**
   ```bash
   # Copiar clave pública
   cat ~/.ssh/id_ed25519.pub
   
   # En GitLab: Settings > SSH Keys > Pegar la clave
   ```

3. **Probar conexión**
   ```bash
   ssh -T git@gitlab.com
   ```

## 📁 Paso 3: Estructura del proyecto

### Estructura básica recomendada
```
mi-primer-proyecto-cicd/
├── .gitignore
├── README.md
├── src/
│   ├── index.js
│   └── utils/
├── tests/
│   └── index.test.js
├── docs/
│   └── deployment.md
└── scripts/
    ├── build.sh
    └── deploy.sh
```

### Crear estructura
```bash
# Crear directorios
mkdir -p src/utils tests docs scripts

# Crear archivos básicos
touch src/index.js
touch tests/index.test.js
touch docs/deployment.md
touch scripts/build.sh
touch scripts/deploy.sh

# Hacer scripts ejecutables
chmod +x scripts/*.sh
```

## 📝 Paso 4: Configurar .gitignore

```bash
# Crear .gitignore apropiado para Node.js
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
*.min.js
*.min.css

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Coverage reports
coverage/

# Temporary files
tmp/
temp/
EOF
```

## ⚙️ Paso 5: Configuración del proyecto en GitLab

### Configuraciones de seguridad

1. **Acceso a GitLab**
   - Ve a Settings > General
   - Configura "Visibility, project features, permissions"

2. **Configuraciones recomendadas**
   ```
   Issues: ✅ Enabled
   Repository: ✅ Enabled
   Merge Requests: ✅ Enabled
   CI/CD: ✅ Enabled
   Wiki: ✅ Enabled (opcional)
   Snippets: ❌ Disabled (para empezar)
   Pages: ❌ Disabled (por ahora)
   ```

### Configurar protección de ramas

1. **Ir a Settings > Repository > Protected branches**
2. **Proteger rama main/master**
   ```
   Branch: main
   Allowed to merge: Maintainers
   Allowed to push: No one
   Force push: ❌ Disabled
   Code owner approval: ✅ Enabled (si tienes CODEOWNERS)
   ```

### Variables de entorno

1. **Ir a Settings > CI/CD > Variables**
2. **Añadir variables básicas**
   ```
   NODE_ENV: production (Protected: ✅, Masked: ❌)
   APP_VERSION: 1.0.0 (Protected: ❌, Masked: ❌)
   ```

## 📋 Paso 6: README.md profesional

```markdown
# Mi Primer Proyecto CI/CD

Descripción breve del proyecto y su propósito.

## 🚀 Inicio rápido

### Prerrequisitos
- Node.js 16+
- npm o yarn

### Instalación
\`\`\`bash
git clone https://gitlab.com/tu-usuario/mi-primer-proyecto-cicd.git
cd mi-primer-proyecto-cicd
npm install
\`\`\`

### Desarrollo
\`\`\`bash
npm start
\`\`\`

### Testing
\`\`\`bash
npm test
\`\`\`

## 🏗️ CI/CD Pipeline

Este proyecto utiliza GitLab CI/CD para:
- ✅ Linting automático
- ✅ Testing unitario
- ✅ Build de producción
- ✅ Despliegue automático

## 📝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (\`git checkout -b feature/nueva-funcionalidad\`)
3. Commit tus cambios (\`git commit -m 'Añadir nueva funcionalidad'\`)
4. Push a la rama (\`git push origin feature/nueva-funcionalidad\`)
5. Abre un Merge Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
```

## 🔄 Paso 7: Primer commit organizado

```bash
# Añadir todos los archivos
git add .

# Commit con mensaje descriptivo
git commit -m "feat: configuración inicial del proyecto

- Estructura de directorios básica
- Configuración de .gitignore para Node.js
- README.md con documentación inicial
- Scripts básicos de build y deploy"

# Push al repositorio
git push origin main
```

## ✅ Verificación de configuración

### Checklist de configuración completa

- [ ] Proyecto creado en GitLab
- [ ] SSH configurado y funcionando
- [ ] Estructura de directorios creada
- [ ] .gitignore configurado apropiadamente
- [ ] README.md documentado
- [ ] Protección de rama main activada
- [ ] Variables de entorno básicas configuradas
- [ ] Primer commit realizado

### Comandos de verificación

```bash
# Verificar configuración de Git
git config --list

# Verificar remote
git remote -v

# Verificar estado del repositorio
git status

# Verificar historial
git log --oneline

# Verificar conexión SSH
ssh -T git@gitlab.com
```

## 🎯 Ejercicio práctico

### Objetivo
Crear tu propio proyecto siguiendo todos los pasos.

### Tarea
1. Crea un proyecto llamado "bootcamp-gitlab-[tu-nombre]"
2. Configura la estructura de directorios
3. Añade un archivo `package.json` básico
4. Crea un script simple en `src/index.js`
5. Añade un test básico en `tests/index.test.js`
6. Haz commit y push de todos los cambios

### package.json ejemplo
```json
{
  "name": "bootcamp-gitlab-proyecto",
  "version": "1.0.0",
  "description": "Proyecto de práctica para bootcamp GitLab CI/CD",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "test": "node tests/index.test.js",
    "build": "./scripts/build.sh"
  },
  "keywords": ["gitlab", "cicd", "bootcamp"],
  "author": "Tu Nombre",
  "license": "MIT"
}
```

## 🐛 Solución de problemas comunes

### Error de autenticación
```bash
# Si tienes problemas con HTTPS
git remote set-url origin git@gitlab.com:tu-usuario/mi-primer-proyecto-cicd.git
```

### Problemas con SSH
```bash
# Verificar que el agente SSH esté corriendo
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### Rama main vs master
```bash
# Si tu repositorio usa 'master' en lugar de 'main'
git branch -m master main
git push -u origin main
```

---

**Anterior:** [1.1 Introducción a GitLab](./01-introduccion-gitlab.md)  
**Siguiente:** [1.3 Operaciones básicas con Git](./03-git-basico.md)

## 📚 Recursos adicionales

- [GitLab Project Settings](https://docs.gitlab.com/ee/user/project/settings/)
- [SSH Keys en GitLab](https://docs.gitlab.com/ee/ssh/)
- [GitLab Flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html)