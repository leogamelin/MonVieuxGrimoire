// On charge le module dotenv pour accéder aux variables d'environnement du fichier .env
const dotenv = require("dotenv");
dotenv.config();

// On charge le module http de Node.js pour pouvoir créer un serveur
const http = require("http");

// On charge mon application Express depuis le fichier app.js
const app = require("./app"); 

const normalizePort = (val) => {
  // On convertis la valeur du port en un entier
  const port = parseInt(val, 10);

  // Si la valeur n'est pas un nombre, on la renvoie directement
  if (isNaN(port)) {
    return val;
  }

  // Si le port est un nombre positif, on le renvoie
  if (port >= 0) {
    return port;
  }

  // Sinon, on renvoie false
  return false;
};

// On définis le port sur lequel mon serveur va écouter. Si une variable d'environnement PORT est définie, on l'utilise. Sinon, j'utilise le port 3000 par défaut.
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
  // Si l'erreur ne provient pas de l'écoute du serveur, on la renvoie
  if (error.syscall !== "listen") {
    throw error;
  }

  // On détermine le type d'adresse sur lequel le serveur écoute
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port: " + port;

  // On gère les erreurs spécifiques
  switch (error.code) {
    case "EACCES":
      console.error(bind + " nécessite des privilèges élevés.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " est déjà utilisé.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// On crée le serveur en utilisant mon application Express
const server = http.createServer(app);

// On définis comment gérer les erreurs du serveur
server.on("error", errorHandler);

// On définis ce qu'il faut faire une fois que le serveur est en écoute
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Écoute sur " + bind);
});

// On démarre le serveur pour qu'il écoute sur le port défini
server.listen(port);
