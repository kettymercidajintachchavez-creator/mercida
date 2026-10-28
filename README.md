# Planificador Educativo de Mercida

## Autor y propósito
Autora: Ketty Mercida Jintach Chávez. Asignatura ET505, Unidad II, Semana 7 (trabajo individual). Universidad Nacional Intercultural Fabiola Salazar Leguía de Bagua, ciclo V, semestre 2026-II.

El Planificador Educativo de Mercida es una aplicación web sencilla que ayuda a organizar y validar un pedido de materiales para una actividad escolar. Calcula el total en céntimos, comprueba que el pedido cumpla las reglas y que no supere el presupuesto, y muestra el saldo. Es solo una simulación: no realiza compras ni envíos.

## Actividad educativa
Lectura y elaboración de carteles educativos en un aula de primaria de la I.E. 17338 de Listra. Materiales de ejemplo: cartulinas, papelotes, plumones y hojas de colores.

## Presupuesto elegido y justificación
Presupuesto: S/ 180.00, configurado en app.js como limites.presupuestoCentimos = 18000 (céntimos) y mostrado igual en index.html.

Lo elegí para organizar los gastos de la actividad de lectura y carteles y controlar el uso de los materiales: permite comprar varios materiales distintos sin exceder el monto previsto y deja ver el saldo disponible después de cada pedido. Cumple las condiciones del curso: es distinto de S/ 150, está entre S/ 50 y S/ 300 y es múltiplo de S/ 10.

## Requisitos para ejecutarlo
- Un navegador: Google Chrome (también funciona en Edge).
- Los cuatro archivos juntos en la misma carpeta: index.html, styles.css, app.js y README.md.
- No necesita internet, ni instalar paquetes, ni servidor.

## Pasos para abrir index.html en Chrome
1. Extraiga la carpeta (no trabaje dentro del ZIP) y compruebe que los cuatro archivos están juntos.
2. Haga doble clic en index.html, o clic derecho > Abrir con > Google Chrome.
3. Si edita app.js, guarde con Ctrl + S y recargue la página con Ctrl + R.

## Responsabilidades de cada archivo
- index.html: pantalla, título, encabezado, actividad educativa, presupuesto visible, campos y botones.
- styles.css: apariencia; los errores se muestran en rojo y los resultados válidos en verde.
- app.js: objeto limites (presupuesto, cantidad y precio máximos), calcularTotal y validarPedido (sin acceso a la pantalla), y después la lectura de datos y las acciones de los botones.
- README.md: propósito, ejecución, personalización, pruebas y ayuda recibida.

## Cambios funcionales realizados
En app.js:
- TODO 1, calcularTotal(pedido): devuelve pedido.cantidad * Math.round(pedido.precio * 100), es decir, el total en céntimos enteros.
- TODO 2, validarPedido(pedido): al final de la función, si el total supera limites.presupuestoCentimos devuelve "El total supera el presupuesto."; si no, devuelve "" (sin error). Se conservaron las comprobaciones de material, cantidad (entero de 1 a 30) y precio (de 0.01 a 50, con hasta dos decimales).
- TODO 3, botón Comprobar pedido: const error = validarPedido(pedido). Así Comprobar pedido y Confirmar simulación usan la misma validación.
- limites.presupuestoCentimos cambió de 15000 a 18000.

En index.html: título de la pestaña y encabezado «Planificador Educativo de Mercida»; descripción de la actividad de lectura y carteles; presupuesto visible S/ 180.00; ejemplo «cartulinas» en el campo de material; la sección con los TODO se cambió por «Presupuesto y reglas».

No se eliminó ninguna función original. Un pedido inválido no borra ni reemplaza el último pedido válido, y Limpiar sigue funcionando.

## Pruebas (presupuesto S/ 180.00)
Cada caso se probó con Comprobar pedido y con Confirmar simulación.

| N.° | Objetivo | Datos de entrada | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| 1 | Pedido válido y cálculo exacto | cartulinas, 10, S/ 5.00 | Total S/ 50.00; saldo S/ 130.00 | Comprobar: «Pedido válido». Confirmar: ficha con total S/ 50.00 y saldo S/ 130.00. |
| 2 | Pedido inválido | (a) material vacío; (b) cantidad 2.5 | Se rechaza con error en rojo | (a) Error rojo: «Escriba un material de al menos 3 caracteres.» (b) Error rojo: «Cantidad: entero entre 1 y 30.» En ambos botones. |
| 3 | Total igual al presupuesto | 10, S/ 18.00 | Total S/ 180.00; saldo S/ 0.00; se acepta | Se acepta: ficha con total S/ 180.00 y saldo S/ 0.00. |
| 4 | Total que supera el presupuesto | 10, S/ 18.01 | Total S/ 180.10; se rechaza con error en rojo | Error rojo «El total supera el presupuesto.» con total intentado S/ 180.10 y exceso S/ 0.10, en ambos botones. |
| 5 | Conservación y limpieza | Confirmar uno válido, intentar uno inválido, pulsar Limpiar | La ficha válida se conserva; Limpiar la borra | La ficha (S/ 50.00 / S/ 130.00) se conservó tras el error; al pulsar Limpiar desapareció y volvió el texto «Todavía no ha confirmado un pedido.» |

Resultados reales: los resultados de la tabla se observaron al ejecutar index.html en un navegador basado en Chromium con ayuda de IA (prueba automatizada). Las capturas del informe corresponden a esa ejecución.

## Mi aporte personal
Completé los tres cambios TODO de app.js siguiendo la guía del profesor y personalicé el sistema con mi actividad de lectura y carteles, mis materiales y mi presupuesto de S/ 180.00 (18000 céntimos). Reemplacé la sección de TODO de index.html por una sección de presupuesto y reglas. Detecté que la plantilla rechaza materiales de menos de 3 caracteres y que quedan dos líneas de aviso de pendiente que ya no se usan; las conservé como indica la guía. Probé los cinco casos con ambos botones y comprobé que un pedido inválido no reemplaza el último pedido válido. Aprendí a trabajar con céntimos enteros y a separar el cálculo y la validación de la pantalla.

## Ayuda recibida
Utilicé asistencia de inteligencia artificial (Claude, de Anthropic) como apoyo para comprender, programar y revisar el proyecto. También usé la guía del profesor ET505 de la Semana 7 y la plantilla de MAXEDRA. Revisé, probé y puedo explicar el código entregado.

## Repositorio individual y GitHub Pages
Repositorio: [aún no publicado]
Sitio: [aún no publicado]

(Se completarán solo si se publican realmente.) Para publicar: crear un repositorio propio, subir los cuatro archivos en la raíz con Add file > Upload files, y activar Settings > Pages > Deploy from a branch > main > /(root). No suba contraseñas ni datos reales de alumnos.

## Entrega
Trabajo individual. En MAXEDRA se entrega un único PDF con el informe y las evidencias hasta el 17/10/2026 a las 20:00 (hora de Perú).


---

# Semana 9: ampliación con Kardex de materiales

## Qué se añadió
El planificador de la Semana 7 se conserva sin cambios en su lógica (`app.js`). Se añadió un módulo de kardex para registrar **entradas y salidas** de materiales ficticios:

- `kardex.html`: pantalla del kardex (materiales, búsqueda, movimientos, historial y exportación).
- `kardex.js`: reglas y pantalla del kardex; guarda los datos en `localStorage` con la clave `et505_kardex_v1`.
- `personalizacion.css`: paleta azul `rgb(30, 64, 175)`, etiqueta personalizada y estilos de tablas. Se carga después de `styles.css` y no elimina sus estilos.
- `index.html`: ahora carga `personalizacion.css`, tiene una etiqueta personalizada y un menú hacia el kardex.

El saldo físico (cantidades) y el presupuesto (soles) son datos distintos y no se mezclan.

## Reglas del kardex
- Existencia = total de entradas − total de salidas.
- Solo se aceptan cantidades enteras mayores que cero (se rechazan cero, negativos, decimales y campos vacíos).
- Una salida mayor que la existencia se rechaza y no cambia el saldo.
- Un material inactivo no recibe movimientos; al inactivarlo se conserva su historial.
- Solo se pueden eliminar materiales sin movimientos, y antes se pide confirmación.
- Cada material tiene un ID estable (MAT-001, MAT-002…) que nunca se reutiliza.

## Aviso sobre los datos
Los datos se guardan **solamente en el navegador y en el origen** de la aplicación (`localStorage`). No existe una base de datos compartida entre usuarios ni sincronización automática con Excel. Si se borran los datos del navegador, se pierden.

## Exportar a CSV
El botón «Exportar movimientos a CSV» descarga `kardex_movimientos.csv` (UTF-8 con BOM, para que Excel lea bien las tildes). Es una **copia** de los movimientos en ese momento, no una sincronización con Excel.

## Cómo ejecutarlo
Abra `index.html` con Chrome o publique la carpeta con GitHub Pages. Todos los archivos deben estar juntos en la raíz del repositorio. El informe en PDF se entrega en MAXEDRA y **no** se sube al repositorio.

## Publicación
Repositorio: [pegar aquí el enlace cuando esté publicado]
Sitio (GitHub Pages): [pegar aquí el enlace cuando esté publicado]
