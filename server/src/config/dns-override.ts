import dns from 'dns';

// Override DNS for Atlas SRV resolution issues
// Must be imported before any module touching the network (mongoose, ioredis)
dns.setServers(['8.8.8.8', '8.8.4.4']);
