const { Service } = require('node-windows');
const path = require('path');

// Create a new service object
const svc = new Service({
  name: 'CMG Database Editor',
  description: 'CMG Database Editor Web Application Service',
  script: path.join(__dirname, 'service-runner.cjs'),
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ],
  env: [
    {
      name: 'NODE_ENV',
      value: 'production'
    },
    {
      name: 'PORT',
      value: '3000'
    }
  ]
});

// Listen for the "install" event
svc.on('install', function() {
  console.log('Service installed successfully!');
  console.log('Starting service...');
  svc.start();
});

// Listen for the "start" event
svc.on('start', function() {
  console.log('Service started successfully!');
  console.log('The CMG Database Editor is now running as a Windows service.');
  console.log('Access it at http://localhost:3000');
});

// Listen for any errors
svc.on('error', function(err) {
  console.error('Service error:', err);
});

// Install the service
console.log('Installing CMG Database Editor as a Windows service...');
console.log('This may require administrator privileges.');
svc.install();
