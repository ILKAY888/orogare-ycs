// YCS Orogare API Service
class YCSApi {
    constructor() {
        this.baseUrl = CONFIG.API_URL;
    }

    async request(endpoint, options = {}) {
        const url = CONFIG.getUrl(endpoint);
        const config = {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Request failed');
            return { success: true, data };
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error.message);
            return { success: false, error: error.message };
        }
    }

    async registerMember(memberData) {
        return this.request('members', { method: 'POST', body: JSON.stringify(memberData) });
    }

    async getMembers() {
        return this.request('members');
    }

    async submitPrayer(prayerData) {
        return this.request('prayers', { method: 'POST', body: JSON.stringify(prayerData) });
    }

    async getPublicPrayers() {
        return this.request('prayers');
    }

    async getUpcomingEvents() {
        try {
            const response = await fetch(CONFIG.getUrl('events') + '/upcoming');
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async sendContact(contactData) {
        return this.request('contact', { method: 'POST', body: JSON.stringify(contactData) });
    }

    async getStats() {
        return this.request('stats');
    }

    async checkHealth() {
        return this.request('health');
    }
}

const api = new YCSApi();