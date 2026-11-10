# Sistema visual GoPixel — kit de recursos

**Regla:** 80% producto moderno y 20% pixel art. Recursos artísticos en sprites; textos e interfaces modernas legibles.

## Paleta

| Token | Dark | Light | Uso |
|---|---|---|---|
| Fondo | `#081523` | `#F0F8FC` | Canvas |
| Superficie | `#102236` | `#FFFFFF` | Cards |
| Raised | `#142B40` | `#ECF7FD` | Inputs |
| Texto | `#EDF8FF` | `#102638` | Lectura |
| Primario Go | `#00ADD8` | `#00ADD8` | Identidad |
| Accento Go claro | `#54DAF2` | azul oscuro legible | Acción |
| Senior | `#F7C55C` | `#F7C55C` | Coronas / distintivos |
| Correcto | `#38CF9D` | igual | Tests correctos |
| Error | `#FF687E` | igual | Error |

Todos los tokens operativos están en `src/styles/app.css`. Senior Mode **no es un tema nuevo**: mantiene claro/oscuro y suma acentos dorados discretos.

## Recursos

- 12 poses PNG RGBA individuales + sprite sheet original en `public/assets/gophers/`.
- 29 símbolos pixel editables SVG y PNG en `public/assets/icons/`.
- 6 badges SVG y PNG en `public/assets/badges/`.
- 3 paisajes pixelados SVG y PNG, tableros conceptuales PNG en `public/assets/backgrounds/`.
- `public/assets/ASSET-ATLAS.png` = hoja de inspección rápida.

### Atribución y marca

Gopher original por **Renee French** (CC BY 4.0, https://go.dev/brand). GoPixel es independiente y no se presenta como oficial. Conservar créditos en footer, acerca de y repositorio.

### Accesibilidad

No aplicar pixel font a párrafos ni editor. Sprite image-rendering pixelated, texto como texto nativo. Focus visible, contraste AA, tamaños táctiles ≥44px, respectar `prefers-reduced-motion`, y alt descriptivo para ilustraciones que expliquen un concepto.
