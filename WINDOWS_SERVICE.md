# Windows Service Setup for CMG Database Editor

This application can be installed and run as a Windows system service, which means it will:
- Start automatically when Windows boots
- Run in the background without requiring a user to be logged in
- Restart automatically if it crashes
- Be managed through Windows Services console

## Prerequisites

- Node.js installed on the system
- Administrator privileges (required for service installation)
- Application built and ready to run (`npm run build`)

## Installation Steps

### 1. Build the Application

First, ensure your application is built for production:

```bash
npm run build
```

### 2. Install as Windows Service

Run the following command **as Administrator** (right-click PowerShell/CMD and select "Run as Administrator"):

```bash
npm run service:install
```

This will:
- Register the application as a Windows service named "CMG Database Editor"
- Configure it to start automatically
- Start the service immediately
- Make the application available at `http://localhost:3000`

### 3. Verify Installation

You can verify the service is running in several ways:

**Option A: Windows Services Console**
1. Press `Win + R`, type `services.msc`, and press Enter
2. Look for "CMG Database Editor" in the list
3. The status should show "Running"

**Option B: PowerShell**
```powershell
Get-Service "CMG Database Editor"
```

**Option C: Browser**
- Navigate to `http://localhost:3000`

## Managing the Service

### Stop the Service
```powershell
Stop-Service "CMG Database Editor"
```

### Start the Service
```powershell
Start-Service "CMG Database Editor"
```

### Restart the Service
```powershell
Restart-Service "CMG Database Editor"
```

### Check Service Status
```powershell
Get-Service "CMG Database Editor" | Format-List
```

## Uninstallation

To remove the service from your system, run **as Administrator**:

```bash
npm run service:uninstall
```

This will:
- Stop the service if it's running
- Unregister it from Windows
- Remove all service-related configurations

## Configuration

### Changing the Port

The default port is 3000. To change it:

1. Open `install-service.js`
2. Modify the `PORT` value in the `env` array:
```javascript
{
  name: 'PORT',
  value: '8080'  // Change to your desired port
}
```
3. Uninstall and reinstall the service

### Service Logs

Service logs are managed by Windows and can be viewed in:
- **Event Viewer**: Look under "Windows Logs" → "Application"
- **Service daemon logs**: Located in the daemon folder created by node-windows

## Troubleshooting

### Service Won't Start

1. Check that the application builds successfully: `npm run build`
2. Verify Node.js is accessible from the system PATH
3. Check Windows Event Viewer for error messages
4. Ensure no other application is using port 3000

### Permission Errors

- Always run installation/uninstallation commands as Administrator
- Right-click PowerShell or Command Prompt and select "Run as Administrator"

### Service Installed but Not Accessible

1. Check if the service is actually running: `Get-Service "CMG Database Editor"`
2. Verify firewall settings aren't blocking port 3000
3. Check Event Viewer for application errors

### Updating the Application

When you update the application:
1. Stop the service: `Stop-Service "CMG Database Editor"`
2. Build the new version: `npm run build`
3. Start the service: `Start-Service "CMG Database Editor"`

Alternatively, uninstall and reinstall the service to ensure clean updates.

## Notes

- The service runs the production build (via `npm run preview`)
- The service uses the Vite preview server, which serves the built application
- The service will automatically restart if it crashes
- Logs are written to Windows Event Viewer under the Application log
