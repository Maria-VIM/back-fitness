Fitness App (UI + Backend)

Единый Docker-сборщик для фронтенда и бэкенда фитнес-приложения. Позволяет развернуть всё окружение одной командой.

## 📋 Требования
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (обычно идёт в комплекте)

## 🚀 Быстрый старт

### 1. Подготовка структуры
Убедитесь, что папки расположены так:
📁 ваш-проект/
├── docker-compose.yml
├── ui-fitness/
│ ├── Dockerfile
│ ├── nginx.conf
│ └── ...
└── back-fitness/
├── Dockerfile
└── ...

text


## 1.2. Добавить файл docker-compose.yml в корень
version: '3.8'

services:
backend:
build:
context: ./back-fitness
dockerfile: Dockerfile
container_name: fitness-backend
ports:
- "8000:8000"
env_file:
- ./back-fitness/.env
depends_on:
- db
networks:
- fitness-net
restart: unless-stopped

frontend:
build:
context: ./ui-fitness
dockerfile: Dockerfile
container_name: fitness-frontend
ports:
- "80:80"
depends_on:
- backend
networks:
- fitness-net
restart: unless-stopped

db:
image: postgres:15-alpine
container_name: fitness-db
environment:
POSTGRES_DB: fitness_db
POSTGRES_USER: admin
POSTGRES_PASSWORD: secret_password
volumes:
- pgdata:/var/lib/postgresql/data
networks:
- fitness-net
restart: unless-stopped

networks:
fitness-net:
driver: bridge

volumes:
pgdata:


### 2. Настройка переменных окружения
Создайте файлы `.env` в соответствующих папках (примеры ниже):

**`back-fitness/.env`**
```env
DATABASE_URL=postgresql://admin:secret_password@db:5432/fitness_db
SECRET_KEY=your-super-secret-key
DEBUG=false
ui-fitness/.env (если нужно для сборки)

env

VITE_API_URL=http://localhost:8000
3. Запуск
Bash

# Сборка и запуск в фоне
docker-compose up --build -d

# Просмотр логов в реальном времени
docker-compose logs -f

# Остановка и очистка контейнеров
docker-compose down
4. Доступ к приложению
Компонент	Адрес
Фронтенд	http://localhost
Бэкенд API	http://localhost:8000
Swagger UI	http://localhost:8000/docs (FastAPI)
База данных	localhost:5432 (только из сети Docker)