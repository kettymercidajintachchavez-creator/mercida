"use strict";
// ========== DATOS Y REGLAS (no usan document) ==========
const CLAVE = "et505_kardex_v1"; // una sola clave: materiales y movimientos juntos
const $ = id => document.getElementById(id);

function estadoInicial() {
  return {
    materiales: [
      { id: "MAT-001", nombre: "Cartulinas", activo: true },
      { id: "MAT-002", nombre: "Papelotes", activo: true },
      { id: "MAT-003", nombre: "Plumones", activo: true }
    ],
    movimientos: [],
    sigMat: 4, // contadores: un ID eliminado nunca se reutiliza
    sigMov: 1
  };
}
function guardarEstado(e) {
  try { localStorage.setItem(CLAVE, JSON.stringify(e)); return true; } catch (err) { return false; }
}
function cargarEstado() {
  try {
    const texto = localStorage.getItem(CLAVE);
    if (texto === null) { const e = estadoInicial(); guardarEstado(e); return e; }
    const e = JSON.parse(texto);
    if (!e || !Array.isArray(e.materiales) || !Array.isArray(e.movimientos)) throw new Error("formato");
    return e;
  } catch (err) {
    return estadoInicial();
  }
}
let estado = cargarEstado();
let seleccionadoId = null;

const rellenar = (n, largo) => String(n).padStart(largo, "0");
function normalizar(t) { return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(); }
function buscarMaterial(id) { return estado.materiales.find(m => m.id === id); }
function movimientosDe(id) { return estado.movimientos.filter(x => x.materialId === id); }
function existencia(id) {
  return movimientosDe(id).reduce((s, x) => s + (x.tipo === "entrada" ? x.cantidad : -x.cantidad), 0);
}
function ahora() {
  const d = new Date(), p = n => rellenar(n, 2);
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
}
// Devuelve {ok, valor} o {ok:false, error}. Solo acepta texto con dígitos: rechaza vacío, 0, negativos y decimales.
function validarCantidad(texto) {
  const t = String(texto).trim();
  if (t === "") return { ok: false, error: "Escriba una cantidad." };
  if (!/^\d+$/.test(t)) return { ok: false, error: "La cantidad debe ser un número entero positivo, sin signo ni decimales." };
  const n = Number(t);
  if (!Number.isSafeInteger(n) || n < 1) return { ok: false, error: "La cantidad debe ser mayor que cero." };
  return { ok: true, valor: n };
}
function validarNombre(nombre, idIgnorar) {
  const n = nombre.trim();
  if (n.length < 3) return "Escriba un nombre de al menos 3 caracteres.";
  if (estado.materiales.some(m => m.id !== idIgnorar && normalizar(m.nombre) === normalizar(n))) return "Ya existe un material con ese nombre.";
  return "";
}
function agregarMaterial(nombre) {
  const error = validarNombre(nombre, null);
  if (error) return { ok: false, msg: error };
  const m = { id: "MAT-" + rellenar(estado.sigMat, 3), nombre: nombre.trim(), activo: true };
  const copia = JSON.stringify(estado);
  estado.materiales.push(m); estado.sigMat++;
  if (!guardarEstado(estado)) { estado = JSON.parse(copia); return { ok: false, msg: "No se pudo guardar en el navegador." }; }
  return { ok: true, msg: "Material agregado: " + m.id + " · " + m.nombre + ".", id: m.id };
}
function registrarMovimiento(idMaterial, tipo, textoCantidad) {
  const m = buscarMaterial(idMaterial);
  if (!m) return { ok: false, msg: "ERROR: seleccione un material válido." };
  if (!m.activo) return { ok: false, msg: "ERROR: el material " + m.nombre + " está inactivo y no puede recibir movimientos." };
  if (tipo !== "entrada" && tipo !== "salida") return { ok: false, msg: "ERROR: tipo de movimiento no válido." };
  const c = validarCantidad(textoCantidad);
  if (!c.ok) return { ok: false, msg: "ERROR: " + c.error };
  const actual = existencia(idMaterial);
  if (tipo === "salida" && c.valor > actual)
    return { ok: false, msg: "ERROR: salida rechazada. Pidió " + c.valor + " y solo hay " + actual + " de " + m.nombre + ". No se registró el movimiento." };
  const saldo = tipo === "entrada" ? actual + c.valor : actual - c.valor;
  const mov = { id: "MOV-" + rellenar(estado.sigMov, 4), materialId: idMaterial, fecha: ahora(), tipo: tipo, cantidad: c.valor, saldo: saldo };
  const copia = JSON.stringify(estado);
  estado.movimientos.push(mov); estado.sigMov++;
  if (!guardarEstado(estado)) { estado = JSON.parse(copia); return { ok: false, msg: "ERROR: no se pudo guardar en el navegador." }; }
  return { ok: true, msg: "Movimiento registrado: " + tipo + " de " + c.valor + " · " + m.nombre + ". Existencia actual: " + saldo + "." };
}
function buscarCoincidencias(texto) {
  const q = normalizar(texto);
  return estado.materiales.filter(m => normalizar(m.nombre).includes(q) || normalizar(m.id).includes(q));
}
function renombrarMaterial(id, nombre) {
  const m = buscarMaterial(id);
  if (!m) return { ok: false, msg: "ERROR: seleccione primero un material con Buscar." };
  const error = validarNombre(nombre, id);
  if (error) return { ok: false, msg: "ERROR: " + error };
  const copia = JSON.stringify(estado);
  m.nombre = nombre.trim();
  if (!guardarEstado(estado)) { estado = JSON.parse(copia); return { ok: false, msg: "ERROR: no se pudo guardar en el navegador." }; }
  return { ok: true, msg: "Nombre actualizado: " + m.id + " ahora se llama " + m.nombre + "." };
}
function cambiarEstado(id, activo) {
  const m = buscarMaterial(id);
  if (!m) return { ok: false, msg: "ERROR: material no encontrado." };
  m.activo = activo;
  if (!guardarEstado(estado)) { m.activo = !activo; return { ok: false, msg: "ERROR: no se pudo guardar en el navegador." }; }
  return { ok: true, msg: m.nombre + (activo ? " fue activado." : " fue inactivado. Sus movimientos se conservan.") };
}
function eliminarMaterial(id) {
  const m = buscarMaterial(id);
  if (!m) return { ok: false, msg: "ERROR: material no encontrado." };
  if (movimientosDe(id).length > 0)
    return { ok: false, msg: "ERROR: " + m.nombre + " tiene movimientos y no se puede eliminar. Puede inactivarlo." };
  const copia = JSON.stringify(estado);
  estado.materiales = estado.materiales.filter(x => x.id !== id);
  if (!guardarEstado(estado)) { estado = JSON.parse(copia); return { ok: false, msg: "ERROR: no se pudo guardar en el navegador." }; }
  return { ok: true, msg: "Material eliminado: " + m.nombre + "." };
}
// CSV: comillas dobles para campos con coma, comilla o salto de línea; evita fórmulas de Excel.
function celdaCsv(valor) {
  let t = String(valor);
  if (/^[=+\-@\t\r]/.test(t)) t = "'" + t;
  return /[",\r\n;]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
}
function construirCsv() {
  const filas = [["ID del movimiento", "ID del material", "Nombre del material", "Fecha", "Tipo de movimiento", "Cantidad", "Saldo resultante"]];
  estado.movimientos.forEach(x => {
    const m = buscarMaterial(x.materialId);
    filas.push([x.id, x.materialId, m ? m.nombre : "(material eliminado)", x.fecha, x.tipo, x.cantidad, x.saldo]);
  });
  return "\uFEFF" + filas.map(f => f.map(celdaCsv).join(",")).join("\r\n") + "\r\n"; // BOM para que Excel lea las tildes
}

// ========== PANTALLA ==========
function mostrarMensaje(texto, tipo) {
  const el = $("mensaje");
  el.textContent = texto; el.className = tipo;
  if (tipo === "error") el.focus();
}
function resultado(r) { mostrarMensaje(r.msg, r.ok ? "exito" : "error"); return r.ok; }
function celda(fila, texto) { const td = document.createElement("td"); td.textContent = texto; fila.appendChild(td); return td; }
function boton(texto, accion, id) {
  const b = document.createElement("button"); b.type = "button"; b.textContent = texto;
  b.dataset.accion = accion; b.dataset.id = id; b.className = "peq"; return b;
}
function dibujar() {
  const cuerpo = $("tablaMateriales"); cuerpo.textContent = "";
  estado.materiales.forEach(m => {
    const f = document.createElement("tr"); if (!m.activo) f.className = "inactivo";
    celda(f, m.id); celda(f, m.nombre); celda(f, m.activo ? "Activo" : "Inactivo"); celda(f, String(existencia(m.id)));
    const td = document.createElement("td");
    td.appendChild(boton(m.activo ? "Inactivar" : "Activar", "estado", m.id));
    td.appendChild(boton("Eliminar", "eliminar", m.id));
    f.appendChild(td); cuerpo.appendChild(f);
  });
  if (estado.materiales.length === 0) { const f = document.createElement("tr"); const td = celda(f, "No hay materiales registrados."); td.colSpan = 5; cuerpo.appendChild(f); }

  const sel = $("movMaterial"); const previo = sel.value; sel.textContent = "";
  estado.materiales.forEach(m => {
    const o = document.createElement("option"); o.value = m.id;
    o.textContent = m.id + " · " + m.nombre + (m.activo ? "" : " (inactivo)"); sel.appendChild(o);
  });
  if (previo && buscarMaterial(previo)) sel.value = previo;

  const hist = $("tablaMovimientos"); hist.textContent = "";
  estado.movimientos.slice().reverse().forEach(x => {
    const m = buscarMaterial(x.materialId); const f = document.createElement("tr");
    celda(f, x.id); celda(f, x.fecha); celda(f, m ? m.nombre : "(eliminado)"); celda(f, x.tipo === "entrada" ? "Entrada" : "Salida");
    celda(f, String(x.cantidad)); celda(f, String(x.saldo)); hist.appendChild(f);
  });
  if (estado.movimientos.length === 0) { const f = document.createElement("tr"); const td = celda(f, "Todavía no hay movimientos."); td.colSpan = 6; hist.appendChild(f); }
  dibujarSeleccion();
}
function dibujarSeleccion() {
  const m = seleccionadoId ? buscarMaterial(seleccionadoId) : null;
  if (!m) { seleccionadoId = null; $("editarNombre").value = ""; $("editarNombre").disabled = true; $("seleccion").textContent = "Ningún material seleccionado."; return; }
  $("editarNombre").disabled = false; $("seleccion").textContent = "Material seleccionado: " + m.id + " · " + m.nombre;
}
$("btnAgregar").addEventListener("click", () => {
  const r = agregarMaterial($("nuevoNombre").value);
  if (resultado(r)) $("nuevoNombre").value = "";
  dibujar();
});
$("btnBuscar").addEventListener("click", () => {
  const texto = $("busqueda").value;
  const lista = $("resultados"); lista.textContent = "";
  if (texto.trim() === "") { mostrarMensaje("ERROR: escriba un nombre o un código para buscar. No se cambió ningún dato.", "error"); return; }
  const hallados = buscarCoincidencias(texto);
  if (hallados.length === 0) {
    seleccionadoId = null; dibujarSeleccion();
    mostrarMensaje("ERROR: no se encontraron materiales con «" + texto.trim() + "». No hay ningún material seleccionado.", "error"); return;
  }
  hallados.forEach(m => {
    const li = document.createElement("li"); li.textContent = m.id + " · " + m.nombre + " ";
    li.appendChild(boton("Seleccionar", "seleccionar", m.id)); lista.appendChild(li);
  });
  mostrarMensaje("Se encontraron " + hallados.length + " material(es). Pulse Seleccionar para editar uno.", "exito");
});
$("btnEditar").addEventListener("click", () => { resultado(renombrarMaterial(seleccionadoId, $("editarNombre").value)); dibujar(); });
$("btnMover").addEventListener("click", () => {
  const r = registrarMovimiento($("movMaterial").value, $("movTipo").value, $("movCantidad").value);
  if (resultado(r)) $("movCantidad").value = "";
  dibujar();
});
document.addEventListener("click", ev => {
  const b = ev.target.closest("button[data-accion]"); if (!b) return;
  const id = b.dataset.id, accion = b.dataset.accion;
  if (accion === "seleccionar") {
    seleccionadoId = id; const m = buscarMaterial(id); $("editarNombre").value = m.nombre; dibujarSeleccion();
    mostrarMensaje("Seleccionó " + m.id + " · " + m.nombre + ". Escriba el nuevo nombre y guárdelo.", "exito");
  } else if (accion === "estado") {
    const m = buscarMaterial(id); resultado(cambiarEstado(id, !m.activo)); dibujar();
  } else if (accion === "eliminar") {
    const m = buscarMaterial(id);
    if (movimientosDe(id).length > 0) { resultado(eliminarMaterial(id)); return; }
    if (!window.confirm("¿Eliminar definitivamente el material «" + m.nombre + "»?")) { mostrarMensaje("Eliminación cancelada. El material se conserva sin cambios.", "exito"); return; }
    resultado(eliminarMaterial(id)); dibujar();
  }
});
$("btnCsv").addEventListener("click", () => {
  if (estado.movimientos.length === 0) { mostrarMensaje("ERROR: todavía no hay movimientos para exportar.", "error"); return; }
  const blob = new Blob([construirCsv()], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "kardex_movimientos.csv";
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  mostrarMensaje("Se exportaron " + estado.movimientos.length + " movimientos a kardex_movimientos.csv (copia para Excel).", "exito");
});
dibujar();
