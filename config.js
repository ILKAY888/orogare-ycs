// YCS Orogare API Configuration
const CONFIG = {
    // Change this URL after deploying backend to Vercel
    API_URL: 'http://localhost:5000/api',
    // Production: 'https://ycs-backend.vercel.app/api'
    
    ENDPOINTS: {
        members: '/members',
        prayers: '/prayers',
        events: '/events',
        contact: '/contact',
        stats: '/stats',
        health: '/health'
    },
    
    getUrl: function(endpoint) {
        return this.API_URL + this.ENDPOINTS[endpoint];
    }
};