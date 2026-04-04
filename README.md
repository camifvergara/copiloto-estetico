# Copiloto Estético 360° — Landing Page

## Instrucciones para desplegar (5 minutos)

### Opción 1: Vercel (RECOMENDADA — la más fácil)

1. **Sube este proyecto a GitHub:**
   - Ve a [github.com/new](https://github.com/new) y crea un repositorio nuevo llamado `copiloto-estetico`
   - Sube todos los archivos de esta carpeta al repositorio

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub
   - Haz clic en "Add New Project"
   - Selecciona el repositorio `copiloto-estetico`
   - Vercel detecta automáticamente que es Vite + React
   - Haz clic en "Deploy"
   - ¡En 60 segundos tienes tu web online!

3. **Dominio personalizado (opcional):**
   - En Vercel → Settings → Domains
   - Puedes añadir `copiloto360.com` o el dominio que prefieras

### Opción 2: Sin GitHub (Vercel CLI)

```bash
# Instala Vercel CLI
npm install -g vercel

# Desde la carpeta del proyecto
cd copiloto-web
npm install
vercel

# Sigue las instrucciones en pantalla
# En ~60 segundos tienes URL pública
```

### Opción 3: Desarrollo local

```bash
cd copiloto-web
npm install
npm run dev
# Abre http://localhost:5173
```

## Estructura del proyecto

```
copiloto-web/
├── index.html          ← HTML principal + SEO meta tags
├── package.json        ← Dependencias
├── vite.config.js      ← Configuración de Vite
├── README.md           ← Este archivo
└── src/
    ├── main.jsx        ← Punto de entrada
    └── App.jsx         ← Toda la landing page
```

## Para modificar contenido

Todo el contenido está en `src/App.jsx`. Busca las secciones por sus IDs:
- Hero → busca `"hero"`
- Problema → busca `"problema"`  
- Solución → busca `"solucion"`
- Cómo funciona → busca `"como"`
- Validación → busca `"validacion"`
- Acceso → busca `"acceso"`

## Paleta de colores

| Color | Hex | Uso |
|-------|-----|-----|
| Navy oscuro | `#0A1929` | Background |
| Navy | `#0D2137` | Textos oscuros |
| Teal | `#028090` | Acentos secundarios |
| Mint | `#02C39A` | Acentos principales, CTAs |
| Blanco crema | `#E0EAF0` | Texto principal |

## Próximos pasos sugeridos

1. Conectar el formulario de email a un servicio real (Mailchimp, ConvertKit, o Google Sheets)
2. Añadir Google Analytics o Plausible para tracking
3. Configurar dominio personalizado en Vercel
4. Compartir con los early adopters de la lista de emails de Promoestética
