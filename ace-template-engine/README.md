# Ace Template Engine

A powerful canvas-based template engine built with React and Material-UI, featuring drag-and-drop functionality, rich component library, and professional templates.

## Features

- 🎨 **Visual Canvas Editor**: Drag-and-drop interface for creating designs
- 🧩 **Rich Component Library**: Pre-built components including text, buttons, images, forms, and more
- 📐 **Precise Controls**: Position, resize, and style elements with precision
- 🎯 **Material-UI Design**: Modern and consistent design system
- 📱 **Responsive Templates**: Professional templates for various use cases
- 💾 **Project Management**: Save, load, and organize your projects
- 🔄 **Undo/Redo**: Full history management for all actions
- 📤 **Export Options**: Export projects as JSON or other formats
- 🏗️ **Template Gallery**: Browse and use pre-made templates

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ace-template-engine
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout/         # Layout components
├── pages/              # Main application pages
│   ├── HomePage/       # Dashboard and welcome page
│   ├── CanvasEditor/   # Main canvas editor
│   ├── TemplateGallery/ # Template browsing
│   └── ProjectManager/ # Project management
├── stores/             # Zustand state management
├── theme/              # Material-UI theme configuration
├── styles/             # Global styles
└── utils/              # Utility functions
```

## Components

### Canvas Editor
The main editor interface includes:
- **Component Panel**: Drag-and-drop component library
- **Canvas Area**: Visual editing workspace with grid and rulers
- **Properties Panel**: Detailed property editing for selected elements
- **Toolbar**: Quick actions like save, undo/redo, zoom controls

### Available Components
- **Basic**: Text, Button, Image, Container
- **Forms**: Input, Checkbox, Radio, Select
- **Media**: Video, Audio
- **Data**: Charts, Tables
- **Advanced**: Maps, Calendar

## Templates

The template gallery includes:
- Landing pages
- Email newsletters
- Dashboards
- E-commerce showcases
- Contact forms
- And more...

## State Management

Built with Zustand for efficient state management:
- Canvas elements and selection
- Project data and metadata
- Undo/redo history
- Template loading

## Styling

- Material-UI v5 for component library
- Custom theme with consistent design tokens
- Responsive design principles
- CSS-in-JS with emotion

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI team for the excellent component library
- React team for the amazing framework
- All contributors and template designers
