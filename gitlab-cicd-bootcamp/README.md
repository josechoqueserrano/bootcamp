# GitLab CI/CD Bootcamp 🚀

¡Bienvenido al bootcamp completo de GitLab CI/CD! Este curso te llevará desde los conceptos más básicos hasta técnicas avanzadas de implementación de CI/CD.

## 🚀 ¿Nuevo en GitLab CI/CD? 
**[¡Comienza aquí con la Guía de Inicio Rápido!](./QUICK_START.md)** ⚡

## 📋 Índice del Bootcamp

### 🌱 Parte 1: Fundamentos de GitLab
- [1.1 Introducción a GitLab](./parte1-fundamentos/01-introduccion-gitlab.md) - ¿Qué es GitLab y por qué usarlo?
- [1.2 Configuración inicial de proyecto](./parte1-fundamentos/02-setup-proyecto.md) - Setup completo paso a paso
- [1.3 Operaciones básicas con Git](./parte1-fundamentos/03-git-basico.md) - Git workflow para CI/CD

### 🏃‍♂️ Parte 2: GitLab Runner
- [2.1 ¿Qué es GitLab Runner?](./parte2-runner/01-que-es-runner.md) - Conceptos y arquitectura
- [2.2 Instalación de GitLab Runner](./parte2-runner/02-instalacion-runner.md) - Instalación en diferentes SO
- [2.3 Configuración de ejecutores](./parte2-runner/03-configuracion-ejecutores.md) - Docker, Shell, Kubernetes
- [2.4 Tipos de ejecutores](./parte2-runner/04-tipos-ejecutores.md) - Shared, Group, Project runners

### 🔧 Parte 3: Pipeline Básico CI/CD
- [3.1 Introducción a .gitlab-ci.yml](./parte3-pipeline-basico/01-introduccion-gitlab-ci.md) - Sintaxis y estructura
- [3.2 Tu primer pipeline](./parte3-pipeline-basico/02-primer-pipeline.md) - Pipeline paso a paso
- [3.3 Stages y Jobs básicos](./parte3-pipeline-basico/03-stages-jobs.md) - Organización de pipelines
- [3.4 Ejemplo práctico con Node.js](./parte3-pipeline-basico/04-ejemplo-nodejs.md) - Caso real completo

### ⚙️ Parte 4: CI/CD Intermedio
- [4.1 Variables y secretos](./parte4-intermedio/01-variables-secretos.md) - Gestión segura de configuración
- [4.2 Caché y artefactos](./parte4-intermedio/02-cache-artefactos.md) - Optimización de builds
- [4.3 Condicionales y reglas](./parte4-intermedio/03-condicionales-reglas.md) - Control de flujo avanzado
- [4.4 Paralelización de jobs](./parte4-intermedio/04-paralelizacion.md) - Aceleración de pipelines

### 🚀 Parte 5: CI/CD Avanzado
- [5.1 Multi-ambiente (dev, staging, prod)](./parte5-avanzado/01-multi-ambiente.md) - Estrategias de despliegue
- [5.2 Integración con Docker](./parte5-avanzado/02-docker-integration.md) - Containerización completa
- [5.3 Seguridad y escaneo](./parte5-avanzado/03-seguridad-escaneo.md) - SAST, DAST, dependency scanning
- [5.4 Monitoreo y optimización](./parte5-avanzado/04-monitoreo-optimizacion.md) - Métricas y performance

### 💼 Parte 6: Proyectos Reales
- [6.1 Proyecto React con despliegue](./parte6-proyectos-reales/01-proyecto-react.md) - SPA completa con CI/CD
- [6.2 API Node.js con testing](./parte6-proyectos-reales/02-api-nodejs.md) - Backend con testing completo
- [6.3 Aplicación Full-Stack](./parte6-proyectos-reales/03-fullstack-app.md) - Frontend + Backend + BD

### 📚 Recursos Adicionales
- [🚀 Guía de Inicio Rápido](./QUICK_START.md) - Setup en 30 minutos
- [💡 Ejemplos Prácticos](./ejemplos/) - Código listo para usar
- [🔧 Troubleshooting](./TROUBLESHOOTING.md) - Solución de problemas comunes
- [📖 Glosario](./GLOSARIO.md) - Términos y conceptos

## 🎯 ¿Qué vas a aprender?

Al finalizar este bootcamp, serás capaz de:

- ✅ **Configurar GitLab Runner** en diferentes entornos (local, cloud, Kubernetes)
- ✅ **Crear pipelines CI/CD** desde básicos hasta enterprise-level
- ✅ **Implementar despliegues automáticos** en múltiples ambientes con estrategias avanzadas
- ✅ **Integrar pruebas automatizadas** (unitarias, integración, E2E, performance)
- ✅ **Manejar secretos y configuraciones** de forma segura
- ✅ **Optimizar pipelines** para máximo rendimiento y eficiencia
- ✅ **Implementar estrategias de seguridad** (SAST, DAST, dependency scanning)
- ✅ **Monitorear y optimizar** aplicaciones en producción
- ✅ **Trabajar con Docker y Kubernetes** para containerización y orquestación
- ✅ **Aplicar GitOps** y metodologías DevOps modernas

## 🛠️ Tecnologías y herramientas cubiertas

### Lenguajes y frameworks
- **JavaScript/Node.js** - APIs REST, microservicios
- **React** - Aplicaciones SPA modernas  
- **Python** - Scripts de automatización
- **Shell/Bash** - Automatización de sistemas

### Herramientas DevOps
- **GitLab CI/CD** - Plataforma principal
- **Docker** - Containerización
- **Kubernetes** - Orquestación de contenedores
- **Helm** - Gestión de aplicaciones K8s
- **Nginx** - Servidor web y proxy

### Testing y calidad
- **Jest** - Testing unitario JavaScript
- **Cypress** - Testing E2E
- **ESLint/Prettier** - Linting y formateo
- **SonarQube** - Análisis de calidad de código
- **Lighthouse** - Auditorías de performance

### Monitoreo y observabilidad
- **Prometheus** - Métricas
- **Grafana** - Dashboards
- **Jaeger** - Distributed tracing
- **ELK Stack** - Logging centralizado

## 🛠️ Requisitos y preparación

### Conocimientos previos
- **Git básico** - commits, branches, merge requests
- **Línea de comandos** - navegación, comandos básicos
- **Desarrollo web básico** - HTML, JavaScript, conceptos de backend
- **Opcional:** Docker, Kubernetes (se explican desde cero)

### Herramientas necesarias
- **GitLab account** - gitlab.com o instancia propia
- **Editor de código** - VS Code, Sublime, etc.
- **Terminal/Shell** - Bash, PowerShell, etc.
- **Docker** (para ejemplos avanzados)
- **Node.js 16+** (para ejemplos de JavaScript)

### Configuración inicial recomendada
```bash
# Verificar herramientas instaladas
git --version          # Debe ser 2.0+
node --version         # Debe ser 16+
docker --version       # Debe ser 20+
kubectl version        # Opcional, para Kubernetes
```

## 🚀 ¿Cómo usar este bootcamp?

### 📚 **Para principiantes**
1. **Comienza con la [Guía de Inicio Rápido](./QUICK_START.md)** para tu primer pipeline
2. **Sigue el orden secuencial** de las partes 1-6
3. **Practica cada ejemplo** antes de continuar
4. **Completa todos los ejercicios** para reforzar el aprendizaje

### ⚡ **Para desarrolladores con experiencia**
1. **Revisa la [Guía de Inicio Rápido](./QUICK_START.md)** para setup básico
2. **Ve directo a temas específicos** según tus necesidades
3. **Usa los [templates listos](./QUICK_START.md#-templates-listos-para-usar)** como punto de partida
4. **Adapta los [ejemplos avanzados](./ejemplos/)** a tu stack tecnológico

### 🎯 **Para equipos y empresas**
1. **Implementa gradualmente** comenzando con proyectos piloto
2. **Establece estándares** basados en las mejores prácticas del bootcamp
3. **Forma a tu equipo** usando el contenido como material de training
4. **Personaliza los templates** para tu infraestructura específica

### 💡 **Metodología de aprendizaje**
- **Teoría + Práctica:** Cada concepto incluye ejemplos ejecutables
- **Progresión gradual:** De básico a avanzado, construyendo conocimiento
- **Casos reales:** Ejemplos basados en aplicaciones del mundo real
- **Troubleshooting:** Soluciones a problemas comunes
- **Best practices:** Estándares de la industria y experiencias reales

## 📁 Estructura del bootcamp

```
gitlab-cicd-bootcamp/
├── 🚀 QUICK_START.md                    # Inicio rápido (30 min)
├── 📖 README.md                         # Este archivo
├── 🔧 TROUBLESHOOTING.md               # Solución de problemas
├── 📚 GLOSARIO.md                      # Términos y conceptos
│
├── 📂 parte1-fundamentos/              # Conceptos básicos
│   ├── 01-introduccion-gitlab.md
│   ├── 02-setup-proyecto.md
│   └── 03-git-basico.md
│
├── 📂 parte2-runner/                   # GitLab Runner
│   ├── 01-que-es-runner.md
│   ├── 02-instalacion-runner.md
│   ├── 03-configuracion-ejecutores.md
│   └── 04-tipos-ejecutores.md
│
├── 📂 parte3-pipeline-basico/          # CI/CD básico
│   ├── 01-introduccion-gitlab-ci.md
│   ├── 02-primer-pipeline.md
│   ├── 03-stages-jobs.md
│   └── 04-ejemplo-nodejs.md
│
├── 📂 parte4-intermedio/               # CI/CD intermedio
│   ├── 01-variables-secretos.md
│   ├── 02-cache-artefactos.md
│   ├── 03-condicionales-reglas.md
│   └── 04-paralelizacion.md
│
├── 📂 parte5-avanzado/                 # CI/CD avanzado
│   ├── 01-multi-ambiente.md
│   ├── 02-docker-integration.md
│   ├── 03-seguridad-escaneo.md
│   └── 04-monitoreo-optimizacion.md
│
├── 📂 parte6-proyectos-reales/         # Casos de uso reales
│   ├── 01-proyecto-react.md
│   ├── 02-api-nodejs.md
│   └── 03-fullstack-app.md
│
└── 📂 ejemplos/                        # Código ejecutable
    ├── 📁 node-app/                    # API Node.js completa
    │   ├── src/                        # Código fuente
    │   ├── tests/                      # Tests unitarios + integración
    │   ├── .gitlab-ci.yml              # Pipeline completo
    │   ├── Dockerfile                  # Container optimizado
    │   └── package.json                # Dependencias y scripts
    ├── 📁 react-app/                   # SPA React completa
    └── 📁 fullstack-app/               # App completa F+B+BD
```

### 🎨 **Iconografía del bootcamp**
- 🚀 Inicio rápido y setup
- 🎯 Objetivos y ejercicios prácticos
- 💡 Tips y mejores prácticas
- ⚠️ Advertencias importantes
- 🔧 Configuración técnica
- 📊 Métricas y monitoreo
- 🔐 Seguridad
- 🐛 Debugging y troubleshooting

## 🎓 Certificación y próximos pasos

### ✅ **Checklist de competencias**
Al completar el bootcamp, deberías poder:

**Nivel Básico:**
- [ ] Crear y configurar un proyecto GitLab desde cero
- [ ] Escribir un `.gitlab-ci.yml` funcional con múltiples stages
- [ ] Configurar variables y secretos correctamente
- [ ] Implementar tests automatizados en el pipeline
- [ ] Desplegar una aplicación simple

**Nivel Intermedio:**
- [ ] Configurar GitLab Runner en diferentes entornos
- [ ] Optimizar pipelines con cache y artifacts
- [ ] Implementar pipelines condicionales y reglas avanzadas
- [ ] Configurar despliegues multi-ambiente
- [ ] Integrar análisis de seguridad básico

**Nivel Avanzado:**
- [ ] Diseñar arquitecturas CI/CD escalables
- [ ] Implementar estrategias de despliegue blue-green/canary
- [ ] Configurar monitoreo y observabilidad completa
- [ ] Automatizar compliance y security scanning
- [ ] Mentorizar equipos en adopción de CI/CD

### 🚀 **Proyectos finales sugeridos**
1. **Portfolio personal** con CI/CD completo
2. **API microservicio** con testing y monitoring
3. **Aplicación full-stack** con múltiples ambientes
4. **Infrastructure as Code** para tu stack tecnológico

### 📚 **Recursos para continuar aprendizando**
- **Certificación GitLab:** [GitLab Certified CI/CD Specialist](https://about.gitlab.com/learn/)
- **Comunidad:** [GitLab Forum](https://forum.gitlab.com/)
- **Documentación avanzada:** [GitLab Docs](https://docs.gitlab.com/)
- **Blog técnico:** [GitLab Blog](https://about.gitlab.com/blog/)

---

**¡Comencemos el viaje hacia la maestría en GitLab CI/CD!** 🎉