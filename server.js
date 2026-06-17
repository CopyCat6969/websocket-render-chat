const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const usuarios = new Map();

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Servidor funcionando" });
});

function obtenerUsuariosPorSala(sala) {
  return Array.from(usuarios.values()).filter(u => u.sala === sala);
}

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  socket.on("registrarUsuario", (data) => {
    const salaAsignada = data.sala || "general";
    
    const usuario = {
      id: socket.id,
      nombre: data.nombre || "Anónimo",
      sala: salaAsignada
    };

    usuarios.set(socket.id, usuario);
    socket.join(salaAsignada);

    io.to(salaAsignada).emit("usuariosActualizados", obtenerUsuariosPorSala(salaAsignada));
    io.to(salaAsignada).emit("mensajeSistema", `${usuario.nombre} se conectó a la sala ${salaAsignada.toUpperCase()}`);
  });

  socket.on("mensajeSala", (data) => {
    const usuario = usuarios.get(socket.id);
    if (usuario) {
      io.to(usuario.sala).emit("mensajeSala", {
        usuario: data.usuario,
        mensaje: data.mensaje,
        hora: new Date().toLocaleTimeString()
      });
    }
  });

  socket.on("mensajePrivado", (data) => {
    io.to(data.destinoId).emit("mensajePrivado", {
      usuario: data.usuario,
      mensaje: data.mensaje,
      hora: new Date().toLocaleTimeString()
    });
  });

  socket.on("disconnect", () => {
    const usuario = usuarios.get(socket.id);
    usuarios.delete(socket.id);

    if (usuario) {
      io.to(usuario.sala).emit("usuariosActualizados", obtenerUsuariosPorSala(usuario.sala));
      io.to(usuario.sala).emit("mensajeSistema", `${usuario.nombre} se desconectó`);
    }

    console.log("Usuario desconectado:", socket.id);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});