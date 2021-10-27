const axios = require('axios');
const btoa = require('btoa');

class Spotify {
    constructor(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.token = '';
        this.header = btoa(`${clientId}:${clientSecret}`);
        this.apiBase = 'https://api.spotify.com/v1/';
    }

    async getToken() {
        const { data } = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: 'grant_type=client_credentials',
            headers: {
                Authorization: `Basic ${this.header}`,
            },
        });
        data.expires_at = Math.round(Date.now() / 1000) + parseInt(data.expires_in);
        this.token = data;
        return this.token.access_token;
    }

    async makeRequest(url) {
        const token = await this.checktoken();
        const response = await axios({
            method: 'get',
            url,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status !== 200) throw `Issue making request to ${url} status ${response.status} error ${a}`;
        return response.data;
    }

    async getTrack(id) {
        return await this.makeRequest(`${this.apiBase}tracks/${id}`);
    }

    async getAlbum(id) {
        return await this.makeRequest(`${this.apiBase}albums/${id}`);
    }

    async getPlaylistTrack(id) {
        return await this.makeRequest(`${this.apiBase}playlists/${id}/tracks`);
    }

    async getPlaylist(id) {
        return await this.makeRequest(`${this.apiBase}playlists/${id}`);
    }

    async checkToken() {
        if (this.token) {
            if (!this.checktime(this.token)) {
                return this.token;
            }
        }
        const token = await this.getToken();
        if (this.token === undefined) {
            throw console.error('Requested a token from Spotify, did not end up getting one');
        }
        return token;
    }

    async checkTime(token) {
        return token.expires_at - Math.round(Date.now() / 1000) < 60;
    }
}
module.exports = Spotify;
