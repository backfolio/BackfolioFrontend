# 🚀 Azure Deployment Checklist

Use this checklist to ensure a smooth deployment to Azure Web App.

## Pre-Deployment

### 1. Prerequisites
- [ ] Node.js 20.x installed
- [ ] Azure CLI installed (`az --version`)
- [ ] Azure subscription active
- [ ] Logged into Azure CLI (`az login`)

### 2. Local Testing
- [ ] Dependencies installed (`npm install`)
- [ ] App builds successfully (`npm run build`)
- [ ] App runs locally (`npm run dev`)
- [ ] Tested all routes:
  - [ ] Landing page (/)
  - [ ] Login page (/login)
  - [ ] Signup mode (/login?mode=signup)
  - [ ] Dashboard (/dashboard)
- [ ] Login/logout flow works
- [ ] Protected routes redirect correctly

### 3. Configuration Review
- [ ] Review `infra/main.parameters.json`:
  - [ ] Location is correct (default: eastus)
  - [ ] Environment is set (dev/staging/prod)
  - [ ] SKU is appropriate for your needs
- [ ] Check `package.json` scripts are correct
- [ ] Verify `vite.config.ts` build settings

## Deployment Options

Choose **ONE** of the following methods:

### Option A: Quick Deploy Script ⭐ RECOMMENDED

- [ ] Make script executable: `chmod +x deploy.sh`
- [ ] Review script variables (resource group name, location)
- [ ] Run: `./deploy.sh`
- [ ] Note the output URL
- [ ] Test the deployed app

### Option B: Manual Azure CLI

- [ ] Create resource group
- [ ] Validate Bicep template
- [ ] Preview deployment (what-if)
- [ ] Deploy infrastructure
- [ ] Build application
- [ ] Create deployment package
- [ ] Deploy to Web App
- [ ] Verify deployment

### Option C: GitHub Actions CI/CD

- [ ] Web App created in Azure
- [ ] Download publish profile from Azure Portal
- [ ] Add GitHub secrets:
  - [ ] `AZURE_WEBAPP_NAME`
  - [ ] `AZURE_WEBAPP_PUBLISH_PROFILE`
- [ ] Push to main branch
- [ ] Monitor GitHub Actions run
- [ ] Verify deployment

## Post-Deployment

### 1. Verification
- [ ] App URL is accessible
- [ ] HTTPS is working (green padlock)
- [ ] Landing page loads correctly
- [ ] All styles are applied (Tailwind CSS working)
- [ ] Images/assets load correctly
- [ ] Login page is accessible
- [ ] Can create account (mock auth)
- [ ] Can login
- [ ] Dashboard shows after login
- [ ] Can logout successfully
- [ ] Protected route redirects work

### 2. Azure Portal Check
- [ ] Navigate to Resource Group in Azure Portal
- [ ] Verify App Service Plan is running
- [ ] Verify Web App is running
- [ ] Check App Service logs for errors
- [ ] Verify custom domain (if configured)

### 3. Performance & Monitoring
- [ ] Page load time is acceptable (<3 seconds)
- [ ] Mobile responsiveness works
- [ ] No console errors in browser
- [ ] Check Azure metrics:
  - [ ] CPU usage
  - [ ] Memory usage
  - [ ] HTTP requests

### 4. Security
- [ ] HTTPS only is enforced
- [ ] Security headers are present (check browser dev tools)
- [ ] No sensitive data in client code
- [ ] Environment variables configured (if needed)

## Next Steps (Optional)

### Production Readiness
- [ ] Implement real authentication (Azure AD B2C)
- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Enable Application Insights
- [ ] Set up alerts and monitoring
- [ ] Configure backup and disaster recovery
- [ ] Set up staging environment
- [ ] Implement error tracking (Sentry)
- [ ] Add analytics (Google Analytics/Application Insights)

### Development Workflow
- [ ] Set up branch protection rules
- [ ] Configure GitHub Actions for PR checks
- [ ] Add automated testing
- [ ] Set up code coverage
- [ ] Configure dependency updates (Dependabot)
- [ ] Add pre-commit hooks
- [ ] Set up staging environment

### Features to Add
- [ ] Password reset functionality
- [ ] Email verification
- [ ] User profile page
- [ ] User settings
- [ ] Two-factor authentication
- [ ] Social login providers
- [ ] Dashboard functionality
- [ ] API integration

### Performance Optimization
- [ ] Enable Azure CDN
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Code splitting
- [ ] Lazy loading routes
- [ ] Reduce bundle size
- [ ] Enable compression

## Troubleshooting

### Build Fails
```bash
# Clear everything and reinstall
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

### Deployment Fails
```bash
# Check Azure login status
az account show

# List subscriptions
az account list --output table

# Set correct subscription
az account set --subscription "YOUR_SUBSCRIPTION_NAME"

# Verify resource group exists
az group show --name rg-backfolio
```

### App Not Loading
- Check App Service logs in Azure Portal
- Verify build output is in `dist` folder
- Check `web.config` is in the deployment package
- Verify Node version matches (20.x)
- Check Application Settings in Azure Portal

### Authentication Not Working
- This is expected - mock auth is for demo only
- See README.md for integrating real authentication
- Azure AD B2C is recommended for production

### Styling Issues
- Verify all CSS files are in dist folder
- Check browser console for 404 errors
- Verify PostCSS and Tailwind are processing correctly
- Clear browser cache

## Resources

- **Main Documentation**: README.md
- **Quick Start**: QUICKSTART.md
- **Azure App Service**: https://portal.azure.com
- **Azure Documentation**: https://learn.microsoft.com/azure/app-service/

## Deployment Status

**Date**: _________________

**Deployed By**: _________________

**Environment**: [ ] Dev [ ] Staging [ ] Production

**App URL**: _________________

**Resource Group**: _________________

**Deployment Method**: [ ] Script [ ] Manual [ ] CI/CD

**Status**: [ ] Success [ ] Failed [ ] In Progress

**Notes**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

✅ **All Done?** Congratulations on your deployment! 🎉
