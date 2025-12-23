# Klincov.it Website

Professionelle Business-Website für Digital Transformation & Power Platform Consulting.

## Projektübersicht

| Eigenschaft | Wert |
|-------------|------|
| **Typ** | Statische Website (kein Build erforderlich) |
| **Stack** | HTML5, CSS3, Vanilla JavaScript |
| **Fonts** | Playfair Display, DM Sans (Google Fonts) |
| **Form-Backend** | Formspree |
| **Buchungssystem** | Microsoft Booking |

---

## Projektstruktur

```
klincovit-website/
├── index.html              # Hauptseite (Hero, Services, Testimonials, Contact)
├── aboutme.html            # Über-mich Seite
├── README.md               # Diese Dokumentation
│
├── css/
│   ├── style.css           # Hauptstylesheet (3260 Zeilen)
│   └── hero-mobile.css     # Mobile Hero-Animationen
│
├── js/
│   └── main.js             # Alle JavaScript-Funktionalitäten
│
├── img/                    # Bilder und Icons
│   ├── paut.svg            # Power Automate Logo
│   ├── papps.svg           # Power Apps Logo
│   ├── cop.svg             # Copilot Studio Logo
│   ├── bi.svg              # Power BI Logo
│   ├── profil.png          # Profilbild
│   └── *.jpg               # Kundenfotos
│
├── error/                  # Fehlerseiten
│   ├── 404-file-not-found.html
│   ├── 403-forbidden.html
│   ├── 401-authorization.html
│   └── 500-internal-server-error.html
│
└── stats/                  # Website Analytics (Webalizer)
```

---

## Schnellstart

### Lokale Entwicklung

```bash
# Option 1: Python HTTP Server
python3 -m http.server 8080

# Option 2: Node.js
npx http-server

# Option 3: Direkt im Browser öffnen
open index.html
```

Die Website ist unter `http://localhost:8080` erreichbar.

### Deployment

Die Website wird via SFTP deployed (VS Code SFTP Extension). Die Konfiguration liegt in `.vscode/sftp.json` (nicht im Git).

---

## Konfigurierbare Parameter

### 1. Farben (CSS-Variablen)

Alle Farben sind in `css/style.css` im `:root`-Selektor definiert und können zentral angepasst werden.

#### Hintergrundfarben

```css
/* Warm/Hero Bereich */
--bg-warm: #f9f7f3;
--bg-cream: #f3efe7;
--bg-soft: #eae5d9;
--white: #ffffff;

/* Dark Mode */
--bg-dark: #08090b;
--bg-dark-secondary: #0d0e11;
--bg-dark-elevated: #131519;
--bg-dark-card: #101214;

/* Light Mode */
--bg-light: #f4f1eb;
--bg-light-secondary: #eeebe6;
--bg-light-elevated: #faf8f5;
--bg-light-card: #ffffff;
```

**Beispiel - Dunkleren Hintergrund:**
```css
:root {
    --bg-dark: #000000;           /* Komplett schwarz statt #08090b */
    --bg-dark-secondary: #0a0a0a;
}
```

#### Akzentfarben (Gold-Schema)

```css
--accent-gold: #c9a227;           /* Haupt-Goldton */
--accent-gold-rich: #b8931f;      /* Dunkleres Gold */
--accent-gold-light: #dbb84a;     /* Helleres Gold */
--accent-gold-dark: #a8871f;      /* Dunkelstes Gold */
--accent-gold-muted: #d4b85c;     /* Gedämpftes Gold */

/* Glow-Effekte */
--accent-gold-soft: rgba(201, 162, 39, 0.1);
--accent-gold-glow: rgba(201, 162, 39, 0.2);
--accent-gold-glow-medium: rgba(201, 162, 39, 0.12);
--accent-gold-glow-light: rgba(201, 162, 39, 0.08);
```

**Beispiel - Blaues Farbschema:**
```css
:root {
    --accent-gold: #2196F3;
    --accent-gold-rich: #1976D2;
    --accent-gold-light: #64B5F6;
    --accent-gold-dark: #0D47A1;
    --accent-gold-glow: rgba(33, 150, 243, 0.2);
}
```

#### Textfarben

```css
/* Auf dunklem Hintergrund */
--text-on-dark: #f5f5f5;
--text-on-dark-secondary: #a8a8a8;
--text-on-dark-muted: #6b6b6b;

/* Auf hellem Hintergrund */
--text-on-light: #1a1a1a;
--text-on-light-secondary: #4a4a4a;
--text-on-light-muted: #7a7a7a;

/* Warm/Hero Bereich */
--text-dark: #2c2a26;
--text-medium: #5a564d;
--text-muted: #8a857a;
```

#### Borders

```css
/* Dark Mode Borders */
--border-dark-subtle: rgba(255, 255, 255, 0.06);
--border-dark-medium: rgba(255, 255, 255, 0.12);
--border-dark-gold: rgba(201, 162, 39, 0.3);

/* Light Mode Borders */
--border-light-subtle: rgba(0, 0, 0, 0.06);
--border-light-medium: rgba(0, 0, 0, 0.1);
--border-light-gold: rgba(201, 162, 39, 0.35);
```

---

### 2. Layout-Parameter

```css
--section-padding: clamp(5rem, 12vw, 9rem);  /* Vertikaler Abstand zwischen Sektionen */
--container-max: 1200px;                      /* Maximale Container-Breite */
```

**Beispiel - Breiteres Layout:**
```css
:root {
    --container-max: 1400px;
    --section-padding: clamp(4rem, 10vw, 8rem);
}
```

---

### 3. Typografie

```css
--font-display: 'Playfair Display', Georgia, serif;  /* Überschriften */
--font-body: 'DM Sans', system-ui, sans-serif;       /* Fließtext */
```

**Beispiel - Andere Schriftart:**
```css
:root {
    --font-display: 'Merriweather', Georgia, serif;
    --font-body: 'Inter', system-ui, sans-serif;
}
```

---

### 4. Animation-Timing

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);   /* Smooth deceleration */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);  /* Standard easing */
```

---

### 5. Mobile Hero-Animationen

In `css/hero-mobile.css` können die Timing-Werte der mobilen Animationen angepasst werden:

```css
:root {
    --center-reveal-duration: 0.8s;   /* Dauer der Zentrum-Enthüllung */
    --pulse-duration: 1.2s;           /* Dauer des Pulse-Effekts */
    --pulse-delay: 0.2s;              /* Verzögerung vor Pulse */
    --cards-start: 0.8s;              /* Start der Karten-Animation */
    --content-start: 1.5s;            /* Start des Content-Einblendens */
}
```

**Beispiel - Schnellere Animationen:**
```css
:root {
    --center-reveal-duration: 0.5s;
    --pulse-duration: 0.8s;
    --cards-start: 0.5s;
    --content-start: 1.0s;
}
```

---

### 6. JavaScript CONFIG-Objekt

In `js/main.js` (Zeile 9-43) befindet sich das zentrale Konfigurationsobjekt:

```javascript
const CONFIG = {
    // ========== Animation Timing (Millisekunden) ==========
    CARD_INIT_DELAY: 2000,              // Verzögerung vor Karten-Initialisierung
    MOBILE_MENU_CLOSE_DELAY: 300,       // Delay beim Schließen des Mobile-Menüs
    COUNTER_ANIMATION_DURATION: 1500,   // Dauer der Zähler-Animation
    COUNTER_ANIMATION_DURATION_LONG: 1800,
    COUNTER_STAGGER_DELAY: 200,         // Verzögerung zwischen Zählern
    COUNTER_CLEANUP_DELAY: 2000,
    RESIZE_DEBOUNCE: 100,               // Debounce für Resize-Events
    FORM_SUBMIT_DELAY: 300,

    // ========== Hero Scroll-Animation ==========
    HERO_ANIMATION_END_RATIO: 0.80,     // Bei 80% Hero-Höhe endet Animation
    MAX_SPREAD_X: 200,                  // Max horizontale Spreizung (px)
    MAX_SPREAD_Y: 40,                   // Max vertikale Spreizung (px)
    MAX_OPACITY_LOSS: 0.1,              // Max Opacity-Verlust (0-1)
    SCROLL_HINT_THRESHOLD: 50,          // Scroll-Hint verschwindet nach X px
    NAV_SCROLL_THRESHOLD: 100,          // Nav-Hintergrund erscheint nach X px

    // ========== Intersection Observer ==========
    REVEAL_THRESHOLD: 0.1,              // 10% sichtbar = Animation starten
    REVEAL_ROOT_MARGIN: '0px 0px -80px 0px',
    SECTION_ROOT_MARGIN: '-45% 0px -45% 0px',
    ROI_THRESHOLD: 0.3,
    TIMELINE_SCROLL_START_RATIO: 0.6,
    TIMELINE_TRIGGER_RATIO: 0.55,
    TIMELINE_ACTIVE_OFFSET: 100,

    // ========== Challenge Items Animation ==========
    CHALLENGE_ITEM_DELAY: 160,          // Delay zwischen Items (ms)
    CHALLENGE_ITEM_INITIAL_DELAY: 60,   // Initiales Delay (ms)

    // ========== Magnetic Button Effect ==========
    MAGNETIC_FACTOR: 0.1                // Stärke des Magnet-Effekts
};
```

#### Beispiele für Anpassungen:

**Langsamere Scroll-Animation:**
```javascript
const CONFIG = {
    HERO_ANIMATION_END_RATIO: 0.60,  // Animation endet früher
    MAX_SPREAD_X: 300,               // Größere horizontale Bewegung
    MAX_SPREAD_Y: 80,                // Größere vertikale Bewegung
    // ...
};
```

**Schnellere Zähler-Animation:**
```javascript
const CONFIG = {
    COUNTER_ANIMATION_DURATION: 800,       // Schneller
    COUNTER_ANIMATION_DURATION_LONG: 1000,
    COUNTER_STAGGER_DELAY: 100,            // Kürzerer Abstand
    // ...
};
```

**Stärkerer Magnetic Button Effekt:**
```javascript
const CONFIG = {
    MAGNETIC_FACTOR: 0.2  // Doppelt so stark (Standard: 0.1)
};
```

---

### 7. Hero-Karten Position & Größe

Die Hero-Karten werden in `css/style.css` positioniert:

```css
.hero__card {
    position: absolute;
    width: 80px;          /* Breite der Karten */
    height: 80px;         /* Höhe der Karten */
    /* ... */
}

/* Position jeder Karte */
.hero__card:nth-child(1) { top: 15%; left: 8%; }
.hero__card:nth-child(2) { top: 8%; right: 15%; }
.hero__card:nth-child(3) { bottom: 25%; left: 5%; }
.hero__card:nth-child(4) { bottom: 15%; right: 8%; }
```

**Beispiel - Größere Karten:**
```css
.hero__card {
    width: 100px;
    height: 100px;
}
```

**Beispiel - Andere Positionen:**
```css
.hero__card:nth-child(1) { top: 20%; left: 15%; }  /* Weiter zur Mitte */
.hero__card:nth-child(2) { top: 10%; right: 20%; }
```

---

### 8. Formspree Integration

Der Formspree-Endpoint ist in `js/main.js` (Zeile ~612):

```javascript
const response = await fetch('https://formspree.io/f/xojaqqlw', {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
});
```

**Eigenen Endpoint verwenden:**
1. Erstelle ein Formspree-Konto auf [formspree.io](https://formspree.io)
2. Erstelle ein neues Formular
3. Ersetze `xojaqqlw` durch deine Form-ID

---

### 9. Microsoft Booking Links

Die Booking-Links befinden sich in `index.html` in den CTA-Buttons:

```html
<a href="https://outlook.office365.com/book/..." class="btn btn--primary">
    Termin buchen
</a>
```

**Eigenen Booking-Link einsetzen:**
1. Suche in `index.html` nach `outlook.office365.com/book`
2. Ersetze die URL durch deinen eigenen Microsoft Booking Link

---

### 10. Counter/Statistiken

Die Statistik-Zähler verwenden Data-Attribute:

```html
<!-- Bereich-Zähler (z.B. 50-200) -->
<span class="counter-num" data-counter="range" data-start="50" data-end="200"></span>

<!-- Einzelwert-Zähler -->
<span class="counter-num" data-counter="single" data-value="150"></span>
```

**Parameter:**
| Attribut | Beschreibung |
|----------|--------------|
| `data-counter="range"` | Zählt von Start bis End |
| `data-counter="single"` | Zeigt einen einzelnen Wert |
| `data-start` | Startwert (nur bei range) |
| `data-end` | Endwert (nur bei range) |
| `data-value` | Wert (nur bei single) |

---

## Features

### Navigation
- **Animated Pill Navigation** - Dynamische Breiten-Anpassung
- **Mobile Hamburger Menu** - Mit Overlay und Touch-Support
- **Scroll-Detection** - Aktiver Nav-Link folgt der aktuellen Sektion

### Hero Section
- **Floating Cards** - Scroll-basierte Spreizung & Opacity
- **Desktop vs Mobile** - Separate Layouts
- **Scroll Hint** - Verschwindet nach kurzem Scroll

### Animationen
- **Intersection Observer** - Reveal-Effekte beim Scrollen
- **Counter Animation** - Animierte Statistik-Zahlen
- **Timeline Progress** - Scroll-gesteuerte Fortschrittsanzeige

### Micro-Interactions
- **Button Ripple Effect** - Click-Animation
- **Magnetic Buttons** - Folgen der Mausbewegung
- **Easter Egg** - Escape-Button (flieht vor dem Cursor)

### Forms
- **Pain-Point Form** - Formspree Integration
- **LocalStorage Backup** - Offline-Speicherung der Submissions

---

## Browser-Kompatibilität

Die Website nutzt moderne Browser-APIs:
- Intersection Observer API
- CSS Custom Properties (Variables)
- CSS Grid & Flexbox
- ES6+ JavaScript

**Unterstützte Browser:**
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

## Dateien im Detail

| Datei | Zeilen | Beschreibung |
|-------|--------|--------------|
| `index.html` | ~1077 | Hauptseite mit allen Sektionen |
| `aboutme.html` | ~1927 | Über-mich Seite (inlined CSS) |
| `css/style.css` | ~3260 | Haupt-Stylesheet |
| `css/hero-mobile.css` | ~654 | Mobile Hero-Animationen |
| `js/main.js` | ~743 | Alle JS-Funktionalitäten |

---

## Git-Workflow

```bash
# Änderungen prüfen
git status

# Änderungen committen
git add .
git commit -m "Beschreibung der Änderung"

# Push zum Remote
git push origin main
```

### Ignorierte Dateien (.gitignore)
- `.vscode/sftp.json` - SFTP Credentials
- `.claude/` - Claude Code Einstellungen
- `node_modules/`
- `Notes/`, `Backup/`
- `*.doc`, `*.docx`, `*.pdf`

---

## Lizenz

Alle Rechte vorbehalten. Diese Website ist Eigentum von Slavko Klincov / Klincov.it.
