import dns from 'dns';

// Override DNS for Atlas SRV resolution issues
// This must be imported before any other module that might use DNS (like mongoose or ioredis)
dns.setServers(['8.8.8.8', '8.8.4.4']);

console.log('DNS override initialized');
