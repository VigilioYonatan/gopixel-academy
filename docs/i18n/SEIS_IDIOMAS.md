# Estrategia i18n — 6 idiomas

| Código | Nombre | Estado de UI | Catálogo de 62 módulos |
|---|---|---|---|
| `es` | Español | 84 etiquetas traducidas | Títulos y resúmenes |
| `en` | English | 84 etiquetas traducidas | Títulos y resúmenes |
| `ja` | 日本語 | 84 etiquetas traducidas | Títulos y resúmenes |
| `zh` | 简体中文 | 84 etiquetas traducidas | Títulos y resúmenes |
| `pt` | Português | 84 etiquetas traducidas | Títulos y resúmenes |
| `fr` | Français | 84 etiquetas traducidas | Títulos y resúmenes |

La configuración se conserva en `localStorage`. El selector del header cambia los textos sin recargar la página. Las denominaciones técnicas (funciones Go, nombres de paquetes, `go`, `int`) se conservan literalmente.

**Alcance real:** la UI y todos los títulos/resúmenes de catálogo están traducidos; los escenarios Senior están localizados (con detalle mayor en ES/EN), y las lecciones largas restantes no están escritas. NO afirmar que 54 cursos completos están disponibles en seis idiomas.

### Reglas para producción

- Añadir fallbacks sólo para claves ausentes, no para contenido completamente no traducido.
- No usar banderas como identidad de idioma obligatoria en contenidos (ES no siempre es 🇪🇸, PT no siempre 🇧🇷); el selector puede mostrar códigos neutros.
- CJK: font stack `system-ui`, `Noto Sans CJK` si está disponible, cortes naturales, no forzar fuentes pixel para lectura.
- Asegurar que cadenas francesas/portuguesas largas no desbordan botones en móviles.
- Pruebas por las 6 combinaciones locale/tema, incluyendo panel Senior y accesibilidad.
- No traducir ni modificar código Go al cambiar idioma.
