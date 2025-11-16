# Prototipo 3D Interactivo - Sonido y Manos

Prototipo interactivo en 3D creado con p5.js que reacciona a:
- 🎤 **Intensidad del sonido** del micrófono
- ✋ **Movimientos de las manos** detectados por la cámara

## Características

### Respuesta al Sonido
- El tamaño de las esferas aumenta/disminuye según la intensidad del audio
- Los colores de los objetos cambian dinámicamente
- Las partículas se mueven más rápido con más sonido
- Los anillos orbitales se expanden con el sonido

### Respuesta a las Manos
- La posición de tu mano controla la posición de los objetos en 3D
- La orientación de la mano controla la rotación de la escena
- Las partículas son atraídas hacia la posición de tu mano
- Profundidad estimada por el tamaño de la mano

## Instrucciones de Uso

1. **Abrir el archivo**: Simplemente abre `index.html` en un navegador moderno (Chrome, Firefox, Edge)

2. **Permisos necesarios**:
   - Permitir acceso a la **cámara** cuando el navegador lo solicite
   - Permitir acceso al **micrófono** cuando el navegador lo solicite

3. **Activar el sistema**:
   - Haz **clic en cualquier parte de la pantalla** para iniciar el audio
   - Verás el mensaje "✓ Sistema activo" cuando esté listo

4. **Interactuar**:
   - **Haz sonidos** (habla, aplaude, música) para ver cambiar el tamaño y colores
   - **Mueve tu mano** frente a la cámara para controlar la posición y rotación
   - Mueve la mano en diferentes direcciones para explorar el espacio 3D

## Tecnologías Utilizadas

- **p5.js** - Framework de visualización creativa
- **p5.sound** - Captura y análisis de audio
- **ml5.js** - Detección de manos usando machine learning (modelo Handpose)

## Elementos Visuales

- **Esfera central**: Cambia de tamaño con el sonido
- **8 esferas orbitales**: Orbitan alrededor con colores dinámicos
- **Anillos**: Dos anillos perpendiculares que se expanden con el sonido
- **50 partículas**: Flotan y son atraídas por tu mano
- **Indicador de mano**: Esfera verde que muestra dónde detecta tu mano

## Servidor Local (Opcional)

Si prefieres usar un servidor local:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server
```

Luego abre `http://localhost:8000` en tu navegador.

## Notas

- Funciona mejor con buena iluminación para la detección de manos
- El rendimiento puede variar según tu hardware
- Compatible con navegadores modernos (Chrome recomendado)

## Controles en Pantalla

En la esquina superior izquierda verás:
- Nivel de sonido actual (en porcentaje)
- Número de manos detectadas
- Estado del sistema