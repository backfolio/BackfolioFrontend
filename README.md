# Backfolio Frontend

A modern, AI-powered financial platform built with React, Vite, and TypeScript. Features a stunning Xtract-inspired design system with intelligent portfolio analysis capabilities.

## 🎨 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (Lightning-fast HMR)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Deployment**: Azure Web App
- **Infrastructure**: Azure Bicep (IaC)

## 🚀 Features

- 🎨 **Xtract-Inspired Design**: Modern, AI-focused aesthetic with glass morphism
- 🔬 **Portfolio Backtesting**: Advanced historical analysis with AI insights
- 🤖 **AI-Powered Interface**: Intelligent features with gradient designs
- 🔐 **Secure Authentication**: Protected routes with elegant login flow
- � **Professional Analytics**: Financial data visualization with modern styling
- 📱 **Fully Responsive**: Optimized for all device sizes
- ⚡ **Lightning Fast**: Vite-powered with smooth animations
- ☁️ **Azure Ready**: Optimized for cloud deployment

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Azure CLI (for deployment)
- Azure subscription (for cloud deployment)

## 🛠️ Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
BackfolioFrontend/
├── .github/
│   └── workflows/
│       └── azure-deploy.yml      # GitHub Actions CI/CD
├── infra/
│   ├── main.bicep                # Azure infrastructure definition
│   └── main.parameters.json      # Bicep parameters
├── public/
│   ├── web.config                # IIS configuration for Azure
│   ├── staticwebapp.config.json  # Static Web App config
│   └── vite.svg                  # Favicon
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx    # Route protection component
│   ├── context/
│   │   └── AuthContext.tsx       # Authentication context
│   ├── pages/
│   │   ├── Dashboard.tsx         # Protected dashboard
│   │   ├── LandingPage.tsx       # Public landing page
│   │   └── LoginPage.tsx         # Login/Signup page
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # App entry point
│   └── index.css                 # Global styles
├── deploy.sh                     # Deployment script
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite configuration
└── tailwind.config.js            # Tailwind CSS config
```

## ☁️ Azure Deployment

### Option 1: Using the Deployment Script (Recommended)

1. **Login to Azure**:
   ```bash
   az login
   ```

2. **Make the script executable**:
   ```bash
   chmod +x deploy.sh
   ```

3. **Run the deployment**:
   ```bash
   ./deploy.sh
   ```

The script will:
- Build your application
- Create Azure resources (Resource Group, App Service Plan, Web App)
- Preview changes before deploying
- Deploy your app to Azure
- Provide you with the app URL

### Option 2: Manual Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Login to Azure**:
   ```bash
   az login
   ```

3. **Create Resource Group**:
   ```bash
   az group create --name rg-backfolio --location eastus
   ```

4. **Deploy Infrastructure**:
   ```bash
   az deployment group create \
     --resource-group rg-backfolio \
     --template-file ./infra/main.bicep \
     --parameters ./infra/main.parameters.json
   ```

5. **Get the Web App name from deployment output**:
   ```bash
   WEB_APP_NAME=$(az deployment group show \
     --resource-group rg-backfolio \
     --name main \
     --query properties.outputs.webAppName.value \
     --output tsv)
   ```

6. **Deploy the application**:
   ```bash
   cd dist
   zip -r ../deploy.zip .
   cd ..
   az webapp deployment source config-zip \
     --resource-group rg-backfolio \
     --name $WEB_APP_NAME \
     --src deploy.zip
   ```

### Option 3: CI/CD with GitHub Actions

1. **Get the publish profile from Azure Portal**:
   - Go to your Web App in Azure Portal
   - Click on "Get publish profile" and download the file

2. **Add GitHub Secrets**:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `AZURE_WEBAPP_NAME`: Your web app name
     - `AZURE_WEBAPP_PUBLISH_PROFILE`: Contents of the publish profile file

3. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy to Azure"
   git push origin main
   ```

The GitHub Actions workflow will automatically build and deploy your app!

## 🔧 Configuration

### Environment-specific Settings

Edit `infra/main.parameters.json` to customize:
- **location**: Azure region (e.g., "eastus", "westus2")
- **environment**: "dev", "staging", or "prod"
- **appServicePlanSku**: Pricing tier

### Bicep Infrastructure

The `infra/main.bicep` file defines:
- App Service Plan (Linux-based)
- Web App with Node.js 20 runtime
- System-assigned Managed Identity
- HTTPS-only enforcement
- Security headers
- CORS configuration

## 🔐 Authentication

Currently using **mock authentication** for demonstration. In production, integrate with:

### Recommended: Azure AD B2C

1. **Create Azure AD B2C tenant**
2. **Install MSAL library**:
   ```bash
   npm install @azure/msal-browser @azure/msal-react
   ```
3. **Update `AuthContext.tsx`** with MSAL configuration
4. **Configure redirect URIs** in Azure AD B2C

### Alternative Options
- Azure AD (for organizational accounts)
- Auth0
- Firebase Authentication
- Custom backend API

## 🎨 Design System

Built with **Xtract-Inspired Design System** using Tailwind CSS:

### Visual Features
- **Modern Color Palette**: Sky blue gradients with AI purple accents
- **Glass Morphism**: Frosted glass effects with backdrop blur
- **Smooth Animations**: 300ms cubic-bezier transitions
- **Enhanced Typography**: Inter font with gradient text support
- **Professional Cards**: Elevated shadows with rounded corners

### Component Library
- **Glass Cards**: Backdrop blur with subtle borders
- **Gradient Buttons**: Primary actions with hover effects  
- **AI Components**: Purple gradient treatments for smart features
- **Modern Navigation**: Wider sidebar with animated icons
- **Status Indicators**: Color-coded feedback systems

### Layout System
- **Generous Spacing**: 20px base grid for breathing room
- **Flexible Grid**: Responsive design with consistent gaps
- **Visual Hierarchy**: Clear content organization
- **Interactive States**: Hover, focus, and loading animations

See [XTRACT_DESIGN_TRANSFORMATION.md](./XTRACT_DESIGN_TRANSFORMATION.md) for complete design documentation.

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🌐 Routing

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page | Public |
| `/login` | Login/Signup page | Public |
| `/login?mode=signup` | Signup mode | Public |
| `/dashboard` | User dashboard | Protected |

## 🔒 Security Features

- HTTPS-only enforcement
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- CORS configuration
- Client-side route protection
- TLS 1.2 minimum
- FTP disabled

## 🚦 What's Next?

Now that your infrastructure is set up, you can:

1. **Integrate Real Authentication**
   - Set up Azure AD B2C
   - Implement OAuth flows
   - Add password reset functionality

2. **Add Features**
   - User profile management
   - Dashboard functionality
   - API integration

3. **Enhance UI**
   - Add animations (Framer Motion)
   - Implement dark mode
   - Add loading states

4. **Monitoring & Analytics**
   - Set up Application Insights
   - Add error tracking (Sentry)
   - Implement user analytics

5. **Performance Optimization**
   - Enable Azure CDN
   - Configure caching headers
   - Optimize bundle size

6. **Custom Domain**
   - Configure custom domain in Azure
   - Set up SSL certificate
   - Update CORS settings

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Azure Web Apps](https://learn.microsoft.com/en-us/azure/app-service/)
- [Azure Bicep](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- [Azure AD B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙋 Support

For issues or questions:
- Create an issue in the GitHub repository
- Check Azure documentation
- Review Vite and React documentation

---

Built with ❤️ using React, Vite, and Azure
