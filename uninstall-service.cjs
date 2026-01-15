const { Service } = require('node-windows');
const path = require('path');

// Create a new service object with the same configuration
const svc = new Service({
  name: 'CMG Database Editor',
  script: path.join(__dirname, 'service-runner.cjs')
});

// Listen for the "uninstall" event
svc.on('uninstall', function() {
  console.log('Service uninstalled successfully!');
  console.log('The CMG Database Editor service has been removed from Windows.');
});

// Listen for any errors
svc.on('error', function(err) {
  console.error('Service error:', err);
});

// Uninstall the service
console.log('Uninstalling CMG Database Editor Windows service...');
console.log('This may require administrator privileges.');
svc.uninstall();
