# Events Section - Film Reel Projector

A cinematic events section featuring a 3D film reel projector and frame-by-frame viewing experience.

## Features

- **3D Projector Model**: Interactive Three.js projector (supports custom `.glb` models)
- **Film Reel Selection**: Click reels to load them into the projector
- **Frame-by-Frame Viewing**: Navigate through event memories like a film strip
- **Cinematic Effects**: Film grain, scanlines, projector beam, and vintage styling
- **Keyboard Controls**: Arrow keys, Space, and Escape for navigation
- **Autoplay Slideshow**: Optional automatic frame progression
- **Details Panel**: Expandable event information

## Installation

### 1. Copy Files

Copy all files from the `events` folder to your `src/events/` directory:

```
src/events/
├── EventsPage.jsx       # Main page component
├── ProjectorModel.jsx   # 3D projector viewer
├── FrameViewer.jsx      # Frame-by-frame viewer
├── eventsData.jsx       # Event data
└── page.jsx            # Route wrapper
```

### 2. Add Route

Update your `App.jsx` to include the events route:

```jsx
import EventsPage from './events/EventsPage'

// Inside your Routes component:
<Route path="/events" element={<EventsPage />} />
```

### 3. Add Your 3D Projector Model

1. Export your 3D projector model as a `.glb` file
2. Place it in your `public/models/` directory as `projector.glb`
3. Ensure the model is optimized (use Draco compression if possible)

If you don't have a model yet, the component includes a **fallback placeholder** that will render automatically.

### 4. Add Event Images

Place your event photos in the `public/events/` directory:

```
public/events/
├── aiaa2024/
│   ├── poster-session.jpg
│   ├── presentation.jpg
│   └── group.jpg
├── of-workshop/
│   ├── certificate.jpg
│   └── screenshot.jpg
└── ... (other events)
```

## Configuration

### Adding New Events

Edit `eventsData.jsx` to add your events:

```jsx
{
  id: 'your-event-id',
  title: 'Event Title',
  year: '2024',
  location: 'City, Country',
  dates: { start: 'Jan 1, 2024', end: 'Jan 3, 2024' },
  summary: 'Brief event description',
  color: '#2a5d84', // Reel color
  highlights: [
    'Key point 1',
    'Key point 2',
    'Key point 3'
  ],
  frames: [
    { type: 'title', text: 'Event Title' },
    { type: 'image', src: '/events/path/image.jpg', caption: 'Caption' },
    { type: 'summary', text: 'Final thoughts...' }
  ]
}
```

### Frame Types

**Title Frame**: Opening title card
```jsx
{ type: 'title', text: 'Your Title' }
```

**Image Frame**: Photo with optional caption
```jsx
{ 
  type: 'image', 
  src: '/path/to/image.jpg', 
  caption: 'Optional caption' 
}
```

**Summary Frame**: Closing summary with highlights
```jsx
{ type: 'summary', text: 'Your summary text' }
```

### Customizing the Projector Model

In `ProjectorModel.jsx`, update the model path:

```jsx
loader.load(
  '/models/your-projector-model.glb', // Your model path
  (gltf) => {
    // ... model loading code
  }
)
```

You can also adjust the camera position, lighting, and rotation speed:

```jsx
// Camera position
camera.position.set(3, 2, 4) // x, y, z

// Auto-rotate speed
controls.autoRotateSpeed = 1 // Adjust rotation speed

// Projector light intensity
const projectorLight = new THREE.SpotLight(0xffd700, 0)
// Changes to 2 when projector is on
```

## Keyboard Controls

- **←/→ Arrow Keys**: Navigate frames
- **Space**: Play/Pause slideshow
- **Escape**: Close projection
- **i Button**: Toggle event details

## Performance Tips

1. **Optimize Images**: 
   - Use WebP/AVIF format
   - Keep images under 500KB
   - Resize to 1920px max width

2. **Optimize 3D Model**:
   - Use Draco compression
   - Limit triangles to <50K
   - Bake textures
   - Single material if possible

3. **Lazy Loading**:
   - ProjectorModel and FrameViewer are lazy-loaded
   - Only loaded when needed

## Styling

The section uses:
- **Film grain effect**: Subtle texture overlay
- **Scanlines**: Horizontal lines for CRT effect
- **Projector beam**: Animated light cone
- **Vintage colors**: Sepia tones and warm palette
- **Special Elite font**: Retro typewriter aesthetic

Colors can be customized in the style sections of each component.

## Accessibility

- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus management
- ✅ Screen reader support
- ✅ Escape key to close
- ✅ Visible focus indicators

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile: iOS Safari 14+, Chrome Android 90+

## Troubleshooting

### Model Not Loading

1. Check console for errors
2. Verify model path is correct
3. Ensure model is valid `.glb` format
4. Try with the placeholder first (it auto-loads if model fails)

### Images Not Showing

1. Check image paths in `eventsData.jsx`
2. Verify images exist in `public/events/`
3. Check browser console for 404 errors
4. Add fallback handling with `onError` prop

### Performance Issues

1. Reduce image sizes
2. Simplify 3D model (lower poly count)
3. Disable autoRotate: `controls.autoRotate = false`
4. Reduce number of frames per event

## Example Event Structure

```jsx
{
  id: 'conference-2024',
  title: 'Tech Conference 2024',
  year: '2024',
  location: 'San Francisco, CA',
  dates: { start: 'Mar 15, 2024', end: 'Mar 17, 2024' },
  summary: 'Annual technology conference with industry leaders.',
  color: '#2a5d84',
  highlights: [
    'Keynote speaker presentation',
    'Award for best paper',
    'Networking with 200+ attendees'
  ],
  frames: [
    { 
      type: 'title', 
      text: 'Tech Conference 2024' 
    },
    { 
      type: 'image', 
      src: '/events/conf2024/keynote.jpg', 
      caption: 'Presenting keynote on AI innovations' 
    },
    { 
      type: 'image', 
      src: '/events/conf2024/award.jpg', 
      caption: 'Receiving Best Paper Award' 
    },
    { 
      type: 'image', 
      src: '/events/conf2024/networking.jpg', 
      caption: 'Evening networking reception' 
    },
    { 
      type: 'summary', 
      text: 'An incredible experience sharing research and connecting with the community. Looking forward to next year!' 
    }
  ]
}
```

## Credits

- Three.js for 3D rendering
- React for UI components
- Film grain and scanline effects inspired by classic cinema

## License

Free to use and modify for your portfolio.

---

**Need help?** Check the comments in each component for additional guidance, or refer to the original design document at `events-idea.md`.
