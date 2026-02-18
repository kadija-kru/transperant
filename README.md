# Transparent List Background - SPFx Application Customizer

A SharePoint Framework (SPFx) Application Customizer that injects custom CSS to make SharePoint list view backgrounds transparent.

## Description

This solution provides an Application Customizer extension that dynamically injects CSS into SharePoint pages to make list and detail view backgrounds transparent. This allows the underlying page background or theme to show through list views, creating a more integrated visual experience.

## Features

- Automatically makes list backgrounds transparent on SharePoint pages
- Targets multiple SharePoint list elements:
  - `.ms-List` - Main list container
  - `.ms-DetailsList` - Detail list view
  - `.ms-FocusZone` - Focus zone wrapper
  - `.ms-CommandBar` - Command bar
  - `.ms-DetailsRow` - Detail rows
  - Legacy fabric blocks and other list containers
- Uses `!important` to override default SharePoint styles
- No configuration required - works automatically once deployed

## Prerequisites

- **Node.js**: **REQUIRED** - Version 16.13.0+ or 18.17.1+ (SPFx 1.18.2 enforces this)
  - ⚠️ **IMPORTANT**: Node.js v19+ will NOT work. You must use Node 16 or 18.
  - Recommended: Use Node.js 18.17.1 (specified in `.nvmrc`)
  - Use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions:
    ```bash
    nvm install 18.17.1
    nvm use 18.17.1
    ```
- **SharePoint Online**: Target environment
- **Global installations** (after setting correct Node version):
  ```bash
  npm install -g gulp-cli
  npm install -g yo
  npm install -g @microsoft/generator-sharepoint
  ```

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kadija-kru/transperant.git
   cd transperant
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Build Commands

### Development Build
```bash
gulp build
```
This compiles TypeScript files and creates development bundles.

### Production Build
```bash
gulp clean
gulp build
gulp bundle --ship
gulp package-solution --ship
```

This creates a production-ready `.sppkg` file in the `sharepoint/solution` folder.

### Local Testing
```bash
gulp serve
```
This starts the local workbench for testing. Update `config/serve.json` with your SharePoint site URL.

## Deployment

### Step 1: Build the Package
```bash
gulp clean
gulp build
gulp bundle --ship
gulp package-solution --ship
```

The `.sppkg` file will be created at: `sharepoint/solution/transparent-list-background.sppkg`

### Step 2: Upload to App Catalog

1. Navigate to your SharePoint App Catalog site
2. Go to **Apps for SharePoint**
3. Click **Upload** and select the `.sppkg` file
4. Check "Make this solution available to all sites in the organization" if desired
5. Click **Deploy**

### Step 3: Add Extension to a Site

#### Option A: Using SharePoint Admin Center (Recommended)
1. Go to SharePoint Admin Center
2. Navigate to **More features** > **Apps**
3. Open **App Catalog**
4. Find "transparent-list-background"
5. Click **Add to all sites** or add to specific sites

#### Option B: Using PnP PowerShell
```powershell
Connect-PnPOnline -Url https://yourtenant.sharepoint.com/sites/yoursite -Interactive

# Add the app to the site
Add-PnPApp -Path "./sharepoint/solution/transparent-list-background.sppkg"

# Install the app
Install-PnPApp -Identity "transparent-list-background"

# Add the Application Customizer to the site
Add-PnPCustomAction -Name "TransparentListBackground" `
  -Title "Transparent List Background" `
  -Location "ClientSideExtension.ApplicationCustomizer" `
  -ClientSideComponentId "e5c6d7f8-a9b0-4c1d-2e3f-4a5b6c7d8e9f" `
  -Scope Site
```

#### Option C: Tenant-Wide Deployment
If you selected "Make this solution available to all sites" during deployment, the extension will be automatically available across all sites.

## Configuration

### Testing Locally

1. Update `config/serve.json` with your SharePoint site URL:
   ```json
   {
     "pageUrl": "https://yourtenant.sharepoint.com/sites/yoursite/Lists/YourList/AllItems.aspx"
   }
   ```

2. Run `gulp serve` and accept the certificate warning

3. Click "Load debug scripts" when prompted

### Modifying CSS

To customize which elements become transparent, edit the `_injectCustomStyles()` method in:
`src/extensions/transparentListBackground/TransparentListBackgroundApplicationCustomizer.ts`

## Troubleshooting

### Issue: "NodeJS version does not meet requirements"

**Solution**: 
- You MUST use Node.js version 16.13+ or 18.17.1+
- Node.js v19 and higher are NOT supported by SPFx 1.18.2
- Install nvm (Node Version Manager):
  ```bash
  # Install nvm (Linux/Mac)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  
  # Use the project's Node version
  nvm install
  nvm use
  ```
- Alternatively, download Node 18.17.1 from [nodejs.org](https://nodejs.org/)

### Issue: Styles Not Applying

**Solution**: 
- Clear browser cache and hard refresh (Ctrl+F5)
- Verify the extension is activated on the site
- Check browser console for errors
- Ensure the component ID in `serve.json` matches the manifest

### Issue: Build Fails

**Solution**:
- Ensure you have the correct Node.js version (16.13+ or 18.17.1+)
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Run `npm cache clean --force`

### Issue: "Cannot find module" Error

**Solution**:
- Run `npm install` to ensure all dependencies are installed
- Check that `tsconfig.json` paths are correct

### Issue: Extension Not Loading in Production

**Solution**:
- Verify the app is deployed to the App Catalog
- Check that the app is installed on the target site
- Ensure the Custom Action is added (for manual installations)
- Verify tenant-wide deployment settings

### Issue: Permission Errors

**Solution**:
- You need Site Collection Administrator or Tenant Administrator rights
- Check that the App Catalog is accessible
- Verify you have permissions to deploy solutions

## Technical Details

- **SPFx Version**: 1.18.2
- **Node.js Compatibility**: 16.13.0+ or 18.17.1+
- **TypeScript**: 4.7.4
- **Component Type**: Application Customizer
- **Target**: SharePoint Online

## Project Structure

```
/
├── config/
│   ├── package-solution.json    # Solution packaging configuration
│   ├── serve.json                # Local development configuration
│   ├── config.json               # Component registration
│   └── write-manifests.json      # CDN configuration
├── src/
│   └── extensions/
│       └── transparentListBackground/
│           ├── TransparentListBackgroundApplicationCustomizer.ts
│           ├── TransparentListBackgroundApplicationCustomizer.manifest.json
│           └── loc/
│               ├── en-us.js      # English localization
│               └── myStrings.d.ts # Type definitions
├── .gitignore
├── .yo-rc.json                   # Yeoman configuration
├── gulpfile.js                   # Build tasks
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is provided as-is for use in SharePoint Online environments.

## Support

For issues or questions, please create an issue in the GitHub repository.

## Version History

- **1.0.0** - Initial release
  - Application Customizer for transparent list backgrounds
  - Support for multiple list view elements
  - Production-ready deployment package
