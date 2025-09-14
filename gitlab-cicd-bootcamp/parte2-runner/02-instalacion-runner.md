# 2.2 Instalación de GitLab Runner

## 🎯 Objetivo
Aprender a instalar GitLab Runner en diferentes sistemas operativos y configurarlo correctamente para tu primer pipeline.

## 📋 Prerrequisitos

### Sistemas soportados
- Linux (Ubuntu, Debian, CentOS, RHEL, SLES)
- macOS
- Windows
- Docker
- Kubernetes

### Requisitos mínimos
- CPU: 1 core
- RAM: 512 MB
- Almacenamiento: 100 MB libre
- Red: Acceso HTTPS a tu instancia de GitLab

## 🐧 Instalación en Linux

### Ubuntu/Debian
```bash
# 1. Añadir repositorio oficial de GitLab
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash

# 2. Instalar GitLab Runner
sudo apt-get install gitlab-runner

# 3. Verificar instalación
gitlab-runner --version
sudo gitlab-runner status
```

### CentOS/RHEL/Fedora
```bash
# 1. Añadir repositorio oficial
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh" | sudo bash

# 2. Instalar GitLab Runner
sudo yum install gitlab-runner     # CentOS 7/RHEL 7
sudo dnf install gitlab-runner     # CentOS 8+/Fedora

# 3. Verificar instalación
gitlab-runner --version
sudo systemctl status gitlab-runner
```

### Instalación manual (cualquier Linux)
```bash
# 1. Descargar binario
sudo curl -L --output /usr/local/bin/gitlab-runner "https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64"

# 2. Dar permisos de ejecución
sudo chmod +x /usr/local/bin/gitlab-runner

# 3. Crear usuario para GitLab Runner
sudo useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash

# 4. Instalar y ejecutar como servicio
sudo gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner
sudo gitlab-runner start

# 5. Verificar instalación
gitlab-runner --version
```

## 🍎 Instalación en macOS

### Método 1: Binario directo
```bash
# 1. Descargar binario
sudo curl --output /usr/local/bin/gitlab-runner "https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-darwin-amd64"

# 2. Dar permisos de ejecución
sudo chmod +x /usr/local/bin/gitlab-runner

# 3. Registrar el runner (veremos esto más adelante)
cd ~
gitlab-runner install
gitlab-runner start
```

### Método 2: Homebrew
```bash
# 1. Instalar GitLab Runner
brew install gitlab-runner

# 2. Iniciar como servicio
brew services start gitlab-runner

# 3. Verificar instalación
gitlab-runner --version
```

## 🪟 Instalación en Windows

### PowerShell (Administrador)
```powershell
# 1. Crear directorio para GitLab Runner
New-Item -Path "C:\GitLab-Runner" -ItemType Directory

# 2. Descargar binario
Invoke-WebRequest -Uri "https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-windows-amd64.exe" -OutFile "C:\GitLab-Runner\gitlab-runner.exe"

# 3. Navegar al directorio
cd C:\GitLab-Runner

# 4. Registrar runner (veremos detalles después)
.\gitlab-runner.exe install
.\gitlab-runner.exe start
```

### Chocolatey
```powershell
# 1. Instalar GitLab Runner
choco install gitlab-runner

# 2. Verificar instalación
gitlab-runner --version
```

## 🐳 Instalación con Docker

### Método recomendado para desarrollo
```bash
# 1. Crear volumen para configuración
docker volume create gitlab-runner-config

# 2. Ejecutar container de GitLab Runner
docker run -d --name gitlab-runner --restart always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v gitlab-runner-config:/etc/gitlab-runner \
  gitlab/gitlab-runner:latest

# 3. Verificar que está corriendo
docker ps | grep gitlab-runner
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  gitlab-runner:
    image: gitlab/gitlab-runner:latest
    container_name: gitlab-runner
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - gitlab-runner-config:/etc/gitlab-runner
    environment:
      - DOCKER_HOST=unix:///var/run/docker.sock

volumes:
  gitlab-runner-config:
```

```bash
# Ejecutar
docker-compose up -d

# Verificar
docker-compose ps
```

## ☸️ Instalación en Kubernetes

### Usando Helm Chart
```bash
# 1. Añadir repositorio de Helm
helm repo add gitlab https://charts.gitlab.io

# 2. Actualizar repositorios
helm repo update

# 3. Instalar GitLab Runner
helm install gitlab-runner gitlab/gitlab-runner \
  --set gitlabUrl=https://gitlab.com/ \
  --set runnerRegistrationToken=YOUR_TOKEN \
  --set rbac.create=true
```

### Manifest de Kubernetes
```yaml
# gitlab-runner.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gitlab-runner
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gitlab-runner
  template:
    metadata:
      labels:
        app: gitlab-runner
    spec:
      containers:
      - name: gitlab-runner
        image: gitlab/gitlab-runner:latest
        volumeMounts:
        - name: config
          mountPath: /etc/gitlab-runner
        - name: docker-sock
          mountPath: /var/run/docker.sock
      volumes:
      - name: config
        configMap:
          name: gitlab-runner-config
      - name: docker-sock
        hostPath:
          path: /var/run/docker.sock
```

## 🔧 Configuración inicial

### Obtener Registration Token

#### Para Project Runner
1. Ve a tu proyecto en GitLab
2. Settings > CI/CD
3. Expand "Runners"
4. Copia el Registration token

#### Para Group Runner
1. Ve a tu grupo en GitLab
2. Settings > CI/CD
3. Expand "Runners"
4. Copia el Registration token

### Registro básico del Runner
```bash
# Registro interactivo
sudo gitlab-runner register

# O registro no interactivo
sudo gitlab-runner register \
  --non-interactive \
  --url "https://gitlab.com/" \
  --registration-token "PROJECT_TOKEN" \
  --executor "docker" \
  --docker-image alpine:latest \
  --description "Mi primer runner" \
  --tag-list "docker,linux" \
  --run-untagged="true" \
  --locked="false" \
  --access-level="not_protected"
```

### Parámetros del registro explicados

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `--url` | URL de GitLab instance | `https://gitlab.com/` |
| `--registration-token` | Token de registro del proyecto/grupo | `glrt-xxxxxxxxxxxx` |
| `--executor` | Tipo de ejecutor | `docker`, `shell`, `kubernetes` |
| `--docker-image` | Imagen Docker por defecto | `alpine:latest`, `node:16` |
| `--description` | Descripción del runner | `"Servidor de producción"` |
| `--tag-list` | Tags para el runner | `"docker,linux,production"` |
| `--run-untagged` | Ejecutar jobs sin tags | `true` o `false` |
| `--locked` | Solo para este proyecto | `true` o `false` |

## 📁 Configuración avanzada

### Archivo config.toml
```toml
# /etc/gitlab-runner/config.toml (Linux)
# ~/.gitlab-runner/config.toml (macOS)
# C:\GitLab-Runner\config.toml (Windows)

concurrent = 1
check_interval = 0

[session_server]
  session_timeout = 1800

[[runners]]
  name = "Mi Docker Runner"
  url = "https://gitlab.com/"
  token = "TOKEN_DEL_RUNNER"
  executor = "docker"
  [runners.custom_build_dir]
  [runners.cache]
    [runners.cache.s3]
    [runners.cache.gcs]
    [runners.cache.azure]
  [runners.docker]
    tls_verify = false
    image = "alpine:latest"
    privileged = false
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    disable_cache = false
    volumes = ["/cache"]
    shm_size = 0
```

### Configuración específica por proyecto
```toml
[[runners]]
  name = "Node.js Runner"
  url = "https://gitlab.com/"
  token = "TOKEN"
  executor = "docker"
  [runners.docker]
    image = "node:16"
    volumes = ["/cache"]
    
[[runners]]
  name = "Python Runner"
  url = "https://gitlab.com/"
  token = "TOKEN"
  executor = "docker"
  [runners.docker]
    image = "python:3.9"
    volumes = ["/cache"]
```

## 🔍 Verificación de la instalación

### Comandos de verificación
```bash
# Estado del servicio
sudo gitlab-runner status

# Lista de runners registrados
sudo gitlab-runner list

# Verificar conectividad con GitLab
sudo gitlab-runner verify

# Logs del runner
sudo gitlab-runner run-single \
  --url "https://gitlab.com/" \
  --token "TOKEN"
```

### En Docker
```bash
# Verificar container
docker ps | grep gitlab-runner

# Ver logs
docker logs gitlab-runner

# Ejecutar comandos dentro del container
docker exec -it gitlab-runner gitlab-runner list
```

## 🚀 Primera prueba

### Crear pipeline de prueba
```yaml
# .gitlab-ci.yml
stages:
  - test

test_runner:
  stage: test
  script:
    - echo "¡Hola desde GitLab Runner!"
    - whoami
    - pwd
    - date
  tags:
    - docker  # Usar solo si configuraste tags
```

### Verificar ejecución
1. Haz commit del archivo `.gitlab-ci.yml`
2. Push al repositorio
3. Ve a CI/CD > Pipelines
4. Observa la ejecución del job

## 🛠️ Configuración de múltiples runners

### Para diferentes propósitos
```bash
# Runner para testing
gitlab-runner register \
  --non-interactive \
  --url "https://gitlab.com/" \
  --registration-token "TOKEN" \
  --executor "docker" \
  --docker-image "node:16" \
  --description "Testing Runner" \
  --tag-list "test,node,docker"

# Runner para deployment
gitlab-runner register \
  --non-interactive \
  --url "https://gitlab.com/" \
  --registration-token "TOKEN" \
  --executor "shell" \
  --description "Deployment Runner" \
  --tag-list "deploy,production" \
  --run-untagged="false"
```

### Configuración de concurrencia
```toml
# Aumentar número de jobs concurrentes
concurrent = 5

[[runners]]
  # ... configuración del runner
  limit = 2  # Este runner máximo 2 jobs simultáneos
```

## 🔐 Configuración de seguridad

### Permisos de usuario
```bash
# Añadir gitlab-runner a grupos necesarios
sudo usermod -aG docker gitlab-runner

# Para acceso a archivos específicos
sudo chown gitlab-runner:gitlab-runner /path/to/deployment/files
```

### Variables seguras
```bash
# No almacenar secrets en config.toml
# Usar GitLab CI Variables en su lugar
```

## 🎯 Ejercicio práctico

### Objetivo
Instalar y configurar tu primer GitLab Runner.

### Pasos

1. **Instalar GitLab Runner en tu sistema**
   ```bash
   # Sigue las instrucciones para tu OS específico
   # Ejemplo para Ubuntu:
   curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
   sudo apt-get install gitlab-runner
   ```

2. **Obtener token de registro**
   - Ve a tu proyecto en GitLab
   - Settings > CI/CD > Runners
   - Copia el registration token

3. **Registrar runner**
   ```bash
   sudo gitlab-runner register
   # URL: https://gitlab.com/
   # Token: [tu token]
   # Description: Mi Primer Runner
   # Tags: docker,test
   # Executor: docker
   # Default image: alpine:latest
   ```

4. **Crear pipeline de prueba**
   ```yaml
   # .gitlab-ci.yml
   test_installation:
     stage: test
     script:
       - echo "Runner instalado correctamente!"
       - cat /etc/os-release
       - docker --version || echo "Docker no disponible"
     tags:
       - docker
   ```

5. **Verificar funcionamiento**
   ```bash
   git add .gitlab-ci.yml
   git commit -m "ci: test runner installation"
   git push origin main
   ```

6. **Monitorear ejecución**
   - Ve a CI/CD > Pipelines
   - Observa el job ejecutándose
   - Revisa los logs

### Troubleshooting común

#### Runner no aparece online
```bash
# Verificar servicio
sudo gitlab-runner status

# Reiniciar servicio
sudo gitlab-runner restart

# Verificar conectividad
sudo gitlab-runner verify
```

#### Jobs quedan pendientes
```bash
# Verificar tags
# Asegúrate de que las tags del job coincidan con las del runner

# Ver runners disponibles
sudo gitlab-runner list
```

#### Problemas de permisos con Docker
```bash
# Añadir gitlab-runner al grupo docker
sudo usermod -aG docker gitlab-runner
sudo systemctl restart gitlab-runner
```

---

**Anterior:** [2.1 ¿Qué es GitLab Runner?](./01-que-es-runner.md)  
**Siguiente:** [2.3 Configuración de ejecutores](./03-configuracion-ejecutores.md)

## 📚 Recursos adicionales

- [GitLab Runner Installation](https://docs.gitlab.com/runner/install/)
- [GitLab Runner Registration](https://docs.gitlab.com/runner/register/)
- [GitLab Runner Configuration](https://docs.gitlab.com/runner/configuration/)
- [Troubleshooting Runners](https://docs.gitlab.com/runner/faq/)