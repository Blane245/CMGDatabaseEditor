const { spawn } = require('child_process');
const path = require('path');

// This script runs the Vite preview server as a Windows service
// First, ensure the build exists, then start the preview server

console.log('CMG Database Editor Service Starting...');
console.log('Working directory:', __dirname);

const port = process.env.PORT || 3000;

// Start the Vite preview server
const vitePreview = spawn('npm', ['run', 'preview', '--', '--port', port, '--host'], {
  cwd: __dirname,
  env: process.env,
  shell: true
});

vitePreview.stdout.on('data', (data) => {
  console.log(`[Vite]: ${data.toString().trim()}`);
});

vitePreview.stderr.on('data', (data) => {
  console.error(`[Vite Error]: ${data.toString().trim()}`);
});

vitePreview.on('close', (code) => {
  console.log(`Vite preview server exited with code ${code}`);
  if (code !== 0) {
    process.exit(code);
  }
});

// Handle service shutdown gracefully
process.on('SIGINT', () => {
  console.log('Service stopping...');
  vitePreview.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Service stopping...');
  vitePreview.kill();
  process.exit(0);
});

console.log(`CMG Database Editor service started on port ${port}`);
