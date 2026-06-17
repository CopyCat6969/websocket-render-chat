## WebSockets + Socket.IO + Render
Proyecto sencillo sobre un chat a tiempo real ejecutado localmente y por medio de render.

## Capturas del funcionamiento:

**Tres usuarios en una misma sala más un mensaje privado, visto desde ususario PepeBootellas:**
<img width="1920" height="1032" alt="image" src="https://github.com/user-attachments/assets/2b81e597-011f-448b-a048-268ecec6d163" />

**Vista de Ana:**
<img width="1920" height="1032" alt="image" src="https://github.com/user-attachments/assets/0a3e8b65-e16f-4e6a-90d0-1a686532a133" />

**Vista de Pedro, quien no ve el mensaje privado entre Ana y Pepe:**
<img width="1920" height="1032" alt="image" src="https://github.com/user-attachments/assets/5df88e19-55e0-45ac-b0ff-5596405c9551" />

---

**Breve explicación de qué evento se envía desde el cliente y qué evento responde desde el servidor:**
Cuando el usuario interactúa con la app, el navegador le avisa al servidor enviando eventos específicos como `registrarUsuario` (para entrar a una sala), `mensajeSala` (para el chat grupal) o `mensajePrivado` (para un usuario concreto). También se dispara de forma automática el evento `disconnect` si el usuario cierra la pestaña.

Por su parte, el servidor recibe estos avisos, procesa los datos y responde en tiempo real distribuyendo la información a quienes corresponda. Lo hace devolviendo eventos como `usuariosActualizados` (para refrescar la lista de conectados), `mensajeSistema` (para avisar quién entra o sale) y retransmitiendo los propios `mensajeSala` o `mensajePrivado` directamente a las pantallas de los destinatarios.
