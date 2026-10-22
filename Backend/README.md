# TP #2 – Red Social
**Materia:** Programación IV (UTN Avellaneda – Tecnicatura Universitaria en Programación)
**Nivel:** 4º Cuatrimestre
**Tipo de examen:** Trabajo Práctico – corresponde al Segundo Parcial
**Modalidad de corrección:** por sprint, de una semana cada uno.

> **Alcance actual:** Sprints #1 a #4. El Sprint #5 (Recuperatorio) y el Sprint #6 (Final) quedan fuera por ahora y se agregarán más adelante.

> Este documento es la fuente de verdad del proyecto. Claude Code debe leerlo al inicio de cada sesión, revisar la sección **"0. Estado actual"** y continuar desde **"Próximo paso"**. Al terminar cada tarea, actualizar los checkboxes de la sección 0 y de los sprints.

---

## 0. Estado actual (ACTUALIZAR EN CADA SESIÓN)

**Fecha de última actualización:** 2026-10-22
**Sprint en curso:** Sprint #1 – Base, registro y login (front completo, falta deploy)
**Último día de trabajo completado:** Front del Sprint #1: proyecto Angular con sistema de diseño propio (SCSS, sin librerías UI), `AuthService` + `ModalService` (modales propios, sin `alert()`), guards de rutas (`authGuard`/`guestGuard`), componentes **Login** y **Registro** (reactive forms con validaciones acordes al back, selector de perfil usuario/administrador), esqueletos de **Publicaciones** y **MiPerfil** (contenido completo queda para Sprint #2), header de navegación y favicon propio (SVG). Se agregó el campo `perfil` al `RegistroDto`/`AuthService.registro()` del back (antes no lo aceptaba) y `app.enableCors()` en `main.ts` para que el front pueda consumir la API. Probado end-to-end con curl (registro con perfil administrador, login correcto/incorrecto, preflight CORS) y manualmente sirviendo `ng serve` + `nest start:dev`. Se decidió no incluir el campo `file` de imagen de perfil todavía (ver bloqueo ya existente sobre Supabase Storage).

### Resumen de progreso por sprint
| Sprint | Front | Back | Estado |
|---|---|---|---|
| #1 Registro/Login base | [x] | [x] | Completo salvo deploy en hosting (pendiente) |
| #2 Publicaciones y Mi Perfil | [ ] | [ ] | Sin iniciar |
| #3 Comentarios, JWT y sesión | [ ] | [ ] | Sin iniciar |
| #4 Admin, estadísticas, PWA, pipes/directivas | [ ] | [ ] | Sin iniciar |

### Próximo paso
Falta el **deploy en hosting** del front (y back si corresponde) para cerrar el Sprint #1 del todo. Después, arrancar Sprint #2 (Publicaciones y Mi Perfil reales) — ver sección 3.

### Bloqueos / decisiones pendientes
- **No se usa bcrypt** (no se vio en la cursada): el hash de contraseñas se hace con un servicio propio `PasswordHasher` implementado con el módulo nativo `node:crypto`.
- **No se usa Multer** (no se vio en la cursada): la subida de imágenes (perfil y publicaciones) se hará más adelante con **Supabase Storage**. Confirmado que esto **no es prioridad ahora**: el registro de usuarios se implementa sin campo de imagen por el momento (ni en el form del front ni en el DTO del back).

---

## 1. Descripción general

La "Red social" es una aplicación dividida en **dos proyectos** (frontend y backend). Los usuarios pueden hacer publicaciones, reaccionar ("Me gusta") y comentarlas. Cada usuario puede ver y editar su perfil. Solo se accede estando registrado y logueado.

### Stack obligatorio
1. Frontend: **Angular**.
2. Backend: **NestJS**.
3. Base de datos: **MongoDB**.
4. Autenticación: login y registro contra el servidor Nest propio, con **JWT**.

### Reglas transversales
- **Status HTTP correctos**: 400 Bad Request, 401 Unauthorized, 201 Created, etc. Prohibido devolver 200 en errores o 400 en respuestas correctas.
- **Diseño trabajado y uniforme** en todas las pantallas. No HTML plano.
- **No usar `alert()`**: usar **modales**.
- Navegación entre pantallas.
- Mensajes e información clara y completa al mostrar mensajes o realizar acciones.
- Publicaciones: **título, mensaje e imagen opcional**; permiten "Me gusta" y comentarios.
- Solo se accede a la app estando registrado o logueado (guards de rutas).
- Bajas lógicas (no borrar físicamente publicaciones ni usuarios).

---

## 2. Modelo de datos sugerido (MongoDB)

- **Usuario**: nombre, apellido, correo (único), nombreUsuario (único), contraseña (hash), fechaNacimiento, descripcion, imagenPerfilUrl, perfil (`usuario` | `administrador`, default `usuario`), habilitado (bool, default true), fechaAlta.
- **Publicación**: titulo, mensaje, imagenUrl (opcional), usuario (ref), fecha, likes (array de userIds), eliminada (bool, baja lógica).
- **Comentario**: publicacion (ref), usuario (ref), mensaje, fecha, modificado (bool, default false), eliminado (bool).

> Es una sugerencia: ajustar si hace falta, y documentar cambios en la sección 0.

---

## 3. Sprints

### SPRINT #1 – Base, registro y login

**Front**
- [x] Crear proyecto Angular.
- [x] Pantallas: Registro, Login, Publicaciones, MiPerfil. _(Publicaciones y MiPerfil son esqueletos navegables; el contenido real es Sprint #2.)_
- [ ] Deploy en hosting.
- [x] Navegación entre componentes (sin límites de accesibilidad por ahora).
- [x] Favicon propio.
- [x] **Componente Login**
  - [x] Formulario con validaciones y mensajes acordes.
  - [x] Login por correo **o** nombre de usuario (el elegido debe ser único en la base de datos).
  - [x] Contraseña: mínimo 8 caracteres, una mayúscula y un número.
- [x] **Componente Registro**
  - [x] Formulario con validaciones y mensajes acordes.
  - [x] Campos: nombre, apellido, correo, nombre de usuario, contraseña, repetir contraseña, fecha de nacimiento, descripción breve.
  - [ ] Campo `file` para imagen de perfil. _(Diferido a propósito: ver bloqueo de Supabase Storage en la sección 0.)_
  - [x] Atributo `perfil`: por defecto "usuario", modificable a "administrador". _(Requirió agregar el campo al `RegistroDto`/`AuthService` del back, que no lo aceptaba.)_

**Back**
- [x] Crear proyecto NestJS.
- [x] Módulos: Publicaciones, Autenticación, Usuarios. _(Publicaciones: solo esquema + módulo creados, el controller/service es Sprint #2. Usuarios sigue siendo el módulo de prueba.)_
- [x] **Módulo Autenticación**
  - [x] Ruta registro (**POST** `/auth/registro`): recibe todos los datos, los valida (class-validator) y guarda en la BD.
    - [x] Contraseña hasheada con `PasswordHasher` propio (`node:crypto`, scrypt + salt), **no bcrypt**.
    - [ ] Imagen de perfil: pospuesta, se integrará más adelante con **Supabase Storage** (no Multer). No bloquea el registro por ahora.
  - [x] Ruta login (**POST** `/auth/login`): recibe usuario/correo y contraseña sin encriptar.
    - [x] Verifica la contraseña con `PasswordHasher` para confirmar el login.
    - [x] Devuelve todos los datos del usuario + JWT (expira a los 15 min).

> Probado manualmente: registro (201), registro duplicado por correo (409), password débil (400), login por correo y por nombre de usuario (200), login con contraseña incorrecta (401).

**Plan de trabajo diario sugerido**
| Día | Tareas |
|---|---|
| 1 | Crear proyectos Angular y Nest; conectar MongoDB; estructura de módulos; favicon; layout base y estilos globales. |
| 2 | Back: esquema Usuario, `POST /auth/registro` con validaciones (class-validator), hash de contraseña con `PasswordHasher` propio. Sin subida de imagen por ahora (se pospone a Supabase). |
| 3 | Back: `POST /auth/login` (usuario o correo), status codes correctos, manejo de errores. Probar con Postman/Thunder. |
| 4 | Front: pantalla Registro (reactive forms, validaciones, file input) y Login con modales de error/éxito. |
| 5 | Front: pantallas Publicaciones y MiPerfil (esqueleto), routing, navegación. Integración front↔back. |
| 6 | Deploy del front en hosting (y back si corresponde), revisión de checklist, correcciones. |

---

### SPRINT #2 – Publicaciones y Mi Perfil

**Front**
- [ ] **Página Publicaciones**
  - [ ] Listado ordenado por fecha por defecto.
  - [ ] Permitir ordenar por cantidad de "me gusta".
  - [ ] Traer cantidad limitada de publicaciones, con paginación.
  - [ ] Cada publicación es un **componente**.
  - [ ] Dar y quitar "me gusta" siempre que corresponda.
  - [ ] Poder eliminar mis propias publicaciones.
  - [ ] Crear publicación (título, mensaje, imagen opcional).
- [ ] **Componente Mi Perfil**
  - [ ] Mostrar todos los datos del usuario y su foto de perfil.
  - [ ] Mostrar mis últimas 3 publicaciones y sus comentarios.

**Back – Publicaciones controller**
- [ ] Alta, listado y baja lógica de publicaciones.
- [ ] **POST**: guardar publicación relacionada a un usuario (título, descripción, URL de imagen si tiene; la imagen debe guardarse).
- [ ] **DELETE**: baja lógica, solo por el creador o un administrador.
- [ ] **GET**: listar últimas publicaciones.
  - [ ] Parámetro de ordenamiento: por fecha / por cantidad de me gusta.
  - [ ] Filtrar posteos de un usuario particular.
  - [ ] Parámetros `offset` y `limit` para paginar.
- [ ] **POST** (like): un usuario da me gusta a una publicación; **un solo me gusta por usuario por publicación**.
- [ ] **DELETE** (like): eliminar me gusta, solo si el usuario lo había dado antes.

**Plan de trabajo diario sugerido**
| Día | Tareas |
|---|---|
| 1 | Back: esquema Publicación, `POST /publicaciones` con imagen, `GET` con orden/offset/limit/filtro por usuario. |
| 2 | Back: `DELETE` baja lógica (dueño o admin), likes (`POST`/`DELETE`) con regla de un like por usuario. |
| 3 | Front: componente Publicación, listado con orden y paginación, formulario de nueva publicación (modal). |
| 4 | Front: like/unlike, eliminar propia publicación (modal de confirmación). |
| 5 | Front: Mi Perfil (datos + foto + últimas 3 publicaciones con comentarios). Integración y pruebas. |
| 6 | Revisión de checklist y correcciones. |

---

### SPRINT #3 – Comentarios, JWT y manejo de sesión

**Front**
- [ ] **Página Publicación** (detalle)
  - [ ] Ver la publicación en grande con sus comentarios.
  - [ ] Permitir escribir comentarios.
  - [ ] Comentarios ordenados uno debajo del otro; primera carga limitada; botón **"cargar más"** que trae más sin quitar los anteriores.
  - [ ] El autor de un comentario puede editarlo; un comentario editado debe **anunciar que fue editado**.
- [ ] **Login y registro**: tomar el token devuelto y guardarlo localmente en el navegador (o usar cookies).
- [ ] **Página "Cargando"**
  - [ ] Al iniciar la app, mostrar pantalla de carga con spinner.
  - [ ] Validar el token contra la ruta `autorizar`: si es válido → redirigir a Publicaciones; si no → Login.
- [ ] **A nivel aplicación**
  - [ ] Al iniciar sesión, iniciar un contador de **10 minutos**. Al finalizar, mostrar **modal** avisando que quedan 5 minutos y preguntando si desea extender la sesión (el token vence a los 15 min). Si acepta, **refrescar el token**.
  - [ ] Si una petición devuelve **401**, redirigir al login para rehacer el token (interceptor HTTP).

**Back – Comentarios controller**
- [ ] Traer comentarios de una publicación, agregar y modificar.
- [ ] **POST**: agrega comentario a una publicación con el usuario y la fecha.
- [ ] **PUT**: modifica el mensaje y agrega `modificado: true`.
- [ ] **GET**: comentarios de una publicación, paginados, **más recientes primero**.

**Back – Módulo Autenticación**
- [ ] Login y registro generan **token JWT** con identidad del usuario (uuid/correo/nombre de usuario) y su **rol**.
- [ ] Token devuelto en la respuesta o por cookies.
- [ ] Token vence a los **15 minutos**.
- [ ] **POST `autorizar`**: valida que el token sea válido y no esté vencido. Devuelve **401** si hay error; si es válido, devuelve los datos del usuario.
- [ ] **POST `refrescar`**: valida token; devuelve nuevo token con la misma payload y vencimiento de 15 min.
- [ ] Proteger todas las rutas con guard JWT.

**Plan de trabajo diario sugerido**
| Día | Tareas |
|---|---|
| 1 | Back: JWT en login/registro (15 min), `JwtAuthGuard`, `POST /auth/autorizar` y `POST /auth/refrescar`. |
| 2 | Back: esquema Comentario, `POST`, `PUT` (modificado:true) y `GET` paginado (recientes primero). |
| 3 | Front: guardar token, servicio de auth, interceptor (agrega token + maneja 401), guard de rutas. |
| 4 | Front: pantalla "Cargando" con spinner + validación de token; contador de 10 min con modal de extender sesión + refresh. |
| 5 | Front: página Publicación (detalle), comentarios, "cargar más", edición con leyenda "editado". |
| 6 | Pruebas de punta a punta, revisión de checklist y correcciones. |

---

### SPRINT #4 – Administrador, estadísticas, PWA, pipes y directivas

**Front**
- [ ] **Páginas Publicación y Publicaciones**: si el usuario logueado es administrador, habilitar botones para dar de baja **cualquier** publicación (la publicación y sus comentarios dejan de estar disponibles).
- [ ] **Página dashboard/usuarios** (solo administradores)
  - [ ] Listado de usuarios.
  - [ ] Crear nuevos usuarios (mismos datos que el registro) con **dos radio buttons**: "usuario" / "administrador".
  - [ ] Alta y baja lógica (habilitar/deshabilitar). Un usuario deshabilitado **no puede ingresar** y es **notificado** al intentar el login.
  - [ ] Formulario de registro para nuevos usuarios.
- [ ] **Página dashboard/estadísticas** (gráficos de **tipos variados**: torta, barras, líneas, etc.)
  - [ ] Cantidad de publicaciones por usuario en un lapso de tiempo (lapso elegible).
  - [ ] Cantidad de comentarios realizados en un lapso de tiempo (lapso elegible).
  - [ ] Cantidad de comentarios en cada publicación en un lapso de tiempo (lapso elegible).
- [ ] **A nivel aplicación**
  - [ ] Implementar **PWA**.
  - [ ] **3 pipes PROPIAS**.
  - [ ] **3 directivas PROPIAS**.

**Back – Usuarios controller** (validar que el token sea de administrador)
- [ ] **GET**: listado de usuarios.
- [ ] **POST**: alta de nuevo usuario (define perfil administrador/usuario).
- [ ] **DELETE**: deshabilitar usuario (al intentar ingresar debe notificarse que no está autorizado).
- [ ] **POST**: alta lógica, rehabilita usuario previamente deshabilitado.
- [ ] Login: bloquear usuarios deshabilitados con status y mensaje claros (401/403).

**Back – Estadísticas controller** (validar token de administrador)
- [ ] Rutas **GET** necesarias para los tres gráficos, con filtro por rango de fechas.

**Plan de trabajo diario sugerido**
| Día | Tareas |
|---|---|
| 1 | Back: `RolesGuard` (admin), usuarios controller (GET/POST/DELETE/POST rehabilitar), bloqueo de login a deshabilitados. |
| 2 | Back: estadísticas controller (3 endpoints GET con `desde`/`hasta`, agregaciones de MongoDB). |
| 3 | Front: baja de cualquier publicación para admin (publicación y publicaciones); dashboard/usuarios (listado, alta con radios, habilitar/deshabilitar). |
| 4 | Front: dashboard/estadísticas con selector de fechas y 3 gráficos de tipos distintos (ej. Chart.js / ngx-charts). |
| 5 | Front: 3 pipes propias + 3 directivas propias (usarlas en la app). |
| 6 | Front: PWA (service worker, manifest, íconos). Revisión de checklist y correcciones. |

---

## 4. Rutas de API sugeridas (referencia)

| Método | Ruta | Descripción | Sprint |
|---|---|---|---|
| POST | `/auth/registro` | Registro (multipart con imagen) | 1 |
| POST | `/auth/login` | Login (usuario o correo) | 1 |
| POST | `/auth/autorizar` | Validar token, devuelve usuario | 3 |
| POST | `/auth/refrescar` | Nuevo token (15 min) | 3 |
| POST | `/publicaciones` | Crear publicación | 2 |
| GET | `/publicaciones?orden=&offset=&limit=&usuario=` | Listar | 2 |
| DELETE | `/publicaciones/:id` | Baja lógica | 2 |
| POST | `/publicaciones/:id/like` | Dar me gusta | 2 |
| DELETE | `/publicaciones/:id/like` | Quitar me gusta | 2 |
| GET | `/publicaciones/:id/comentarios?offset=&limit=` | Comentarios paginados | 3 |
| POST | `/publicaciones/:id/comentarios` | Comentar | 3 |
| PUT | `/comentarios/:id` | Editar (modificado: true) | 3 |
| GET | `/usuarios` | Listar (admin) | 4 |
| POST | `/usuarios` | Alta (admin) | 4 |
| DELETE | `/usuarios/:id` | Deshabilitar (admin) | 4 |
| POST | `/usuarios/:id/habilitar` | Rehabilitar (admin) | 4 |
| GET | `/estadisticas/...` | Gráficos (admin) | 4 |

> Los nombres de rutas son sugeridos; el enunciado solo fija métodos y comportamiento.

---

## 5. Criterios de calidad a verificar antes de cada entrega

- [ ] Status HTTP correctos en todos los endpoints.
- [ ] Sin `alert()`; todo con modales.
- [ ] Diseño uniforme en todas las pantallas.
- [ ] Validaciones y mensajes claros en formularios.
- [ ] Contraseñas encriptadas; JWT con vencimiento a 15 minutos.
- [ ] Rutas protegidas por guard (front) y por JWT/roles (back).
- [ ] Bajas lógicas (no se borra físicamente).
- [ ] Deploy en hosting funcionando.

---

## 6. Instrucciones para Claude Code

1. Al iniciar una sesión, leer este archivo completo y la sección **0. Estado actual**.
2. Si el estado está vacío, inspeccionar el repositorio (front y back) para determinar qué está hecho y completar la sección 0 antes de programar.
3. Trabajar siguiendo el **plan diario** del sprint en curso; no adelantar sprints sin acordarlo.
4. Al terminar cada tarea: marcar el checkbox correspondiente y actualizar **Próximo paso** y **Fecha de última actualización**.
5. Cada requisito del enunciado debe quedar implementado literalmente; ante ambigüedad, anotarla en "Bloqueos / decisiones pendientes" y consultar. 
 