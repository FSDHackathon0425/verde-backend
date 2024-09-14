Este proyecto es el backend para una aplicación de reservas de menús en un restaurante a través de un bot de Telegram. El backend está desarrollado en Node.js y utiliza MongoDB como base de datos.

Encontraréis toda la [información sobre el bot de telegram aquí](https://github.com/yagop/node-telegram-bot-api/tree/master)

## Requisitos

- Node.js (v14.x o superior)
- MongoDB
- Credenciales del bot de Telegram

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local:

### 1. Clonar el repositorio

```bash
git clone <URL_del_repositorio>
cd <nombre_del_directorio>
```

### 2. Instalar dependencias

Instala las dependencias necesarias ejecutando el siguiente comando:

```bash
npm install
```

### 3. Crear archivo .env

Debes crear un archivo .env en la raíz del proyecto con las credenciales de tu bot de Telegram y la conexión a MongoDB. Aquí tienes un ejemplo de cómo debería verse:

```bash
TELEGRAM_BOT_TOKEN_1="AAAAA"
TELEGRAM_BOT_TOKEN="BBBBB"
MONGODB_URI="mongodb://localhost:27017/nombre_de_tu_base_de_datos"
```

Asegúrate de reemplazar los valores de ejemplo con las credenciales reales de tu bot y la URL de conexión a MongoDB.

### 4. Conectar con MongoDB

Dentro de tu código, deberás asegurarte de conectar MongoDB utilizando la URI especificada en el archivo .env. Un ejemplo básico de conexión puede verse así:

```javascript
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conexión exitosa a MongoDB"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));
```

### 5. Desarrollo del backend

El backend debe estar diseñado para manejar las siguientes funcionalidades:

- Recepción de mensajes y comandos del bot de Telegram.
- Gestión de reservas de menús.
- Almacenamiento de datos de usuarios y reservas en MongoDB.
