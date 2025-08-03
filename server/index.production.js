'use strict';
const __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
      if (k2 === undefined) {
        k2 = k;
      }
      let desc = Object.getOwnPropertyDescriptor(m, k);
      if (
        !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
      ) {
        desc = {
          enumerable: true,
          get() {
            return m[k];
          }
        };
      }
      Object.defineProperty(o, k2, desc);
    }
    : function (o, m, k, k2) {
      if (k2 === undefined) {
        k2 = k;
      }
      o[k2] = m[k];
    });
const __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
      Object.defineProperty(o, 'default', { enumerable: true, value: v });
    }
    : function (o, v) {
      o['default'] = v;
    });
const __importStar =
  (this && this.__importStar) ||
  (function () {
    let ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          const ar = [];
          for (const k in o) {
            if (Object.prototype.hasOwnProperty.call(o, k)) {
              ar[ar.length] = k;
            }
          }
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) {
        return mod;
      }
      const result = {};
      if (mod != null) {
        for (let k = ownKeys(mod), i = 0; i < k.length; i++) {
          if (k[i] !== 'default') {
            __createBinding(result, mod, k[i]);
          }
        }
      }
      __setModuleDefault(result, mod);
      return result;
    };
  })();
const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require('express'));
const path_1 = __importDefault(require('path'));
const dotenv_1 = __importDefault(require('dotenv'));
const http_1 = require('http');
const cors_1 = __importDefault(require('cors'));
// Load environment variables
dotenv_1.default.config({ quiet: true });
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
exports.server = server;
const PORT = process.env.PORT || 3001;
// Middleware
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// CORS configuration
app.use(
  (0, cors_1.default)({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
  })
);
// Serve static files from the React app in production
const clientPath = path_1.default.join(__dirname, '../client');
app.use(express_1.default.static(clientPath));
// Serve media files from output directory
const outputPath = path_1.default.join(__dirname, '../output');
app.use('/output', express_1.default.static(outputPath));
// Serve fonts
const fontsPath = path_1.default.join(clientPath, 'fonts');
app.use('/fonts', express_1.default.static(fontsPath));
// Serve assets (sounds, etc.)
const assetsPath = path_1.default.join(__dirname, '../assets');
app.use('/assets', express_1.default.static(assetsPath));
// Import and initialize the main server routes and socket.io
Promise.resolve()
  .then(() => __importStar(require('./index')))
  .then(serverModule => {
    if (serverModule.initializeServer) {
      serverModule.initializeServer(app, server);
    }
    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    // MUST be registered AFTER API routes
    app.use((req, res) => {
      // Skip API routes
      if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.sendFile(path_1.default.join(clientPath, 'index.html'));
    });
    // Start server after everything is loaded
    server.listen(PORT, () => {
      // Clear console for clean startup
      // console.clear(); // Commented out due to linter restrictions
      // ASCII art and branding
      console.warn(
        '\x1b[36m%s\x1b[0m',
        `
    ███████╗ █████╗  ██████╗██████╗ ██╗     ███████╗███████╗███████╗
    ██╔════╝██╔══██╗██╔════╝╚════██╗██║     ██╔════╝██╔════╝██╔════╝
    █████╗  ███████║██║      █████╔╝██║     █████╗  ███████╗███████╗
    ██╔══╝  ██╔══██║██║      ╚═══██╗██║     ██╔══╝  ╚════██║╚════██║
    ██║     ██║  ██║╚██████╗██████╔╝███████╗███████╗███████║███████║
    ╚═╝     ╚═╝  ╚═╝ ╚═════╝╚═════╝ ╚══════╝╚══════╝╚══════╝╚══════╝
    `
      );
      console.warn(
        '\x1b[35m%s\x1b[0m',
        '                    By Ken Kai does AI'
      );
      console.warn(
        '\x1b[90m%s\x1b[0m',
        '    ═══════════════════════════════════════════════════════════\n'
      );
      // Server info with colors
      console.warn('    \x1b[32m✓\x1b[0m Server Status: \x1b[32mONLINE\x1b[0m');
      console.warn(`    \x1b[32m✓\x1b[0m Port: \x1b[33m${PORT}\x1b[0m`);
      console.warn(
        `    \x1b[32m✓\x1b[0m Environment: \x1b[33m${process.env.NODE_ENV || 'production'}\x1b[0m\n`
      );
      // Clickable URL with styling
      const url = `http://localhost:${PORT}`;
      console.warn('    \x1b[36m🌐 Access your application at:\x1b[0m\n');
      console.warn(`    \x1b[1m\x1b[4m\x1b[36m${url}\x1b[0m\n`);
      // Additional info
      console.warn('    \x1b[90mPress Ctrl+C to stop the server\x1b[0m');
      console.warn(
        '\x1b[90m    ═══════════════════════════════════════════════════════════\x1b[0m\n'
      );
    });
  })
  .catch(error => {
    console.error('Failed to load server module:', error);
    process.exit(1);
  });
