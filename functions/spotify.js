var axios = require("axios");
var btoa = require("btoa");

class spotify {
    constructor(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.token = "";
        this.header = btoa(clientId + ":" + clientSecret);
        this.api_base = "https://api.spotify.com/v1/";
    }
    async gettoken() {
        await axios({
            method: "post",
            url: "https://accounts.spotify.com/api/token",
            data: "grant_type=client_credentials",
            headers: {
                Authorization: "Basic " + this.header,
            },
        }).then((data) => {
            data.data["expires_at"] =
                Math.round(Date.now() / 1000) +
                parseInt(data.data["expires_in"]);
            this.token = data.data;
        });
        return this.token["access_token"];
    }
    async _make_spotify_req(url) {
        var token = await this.checktoken();
        var a = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        if (a.status !== 200) {
            throw `Issue making request to ${url} status ${a.status} error ${a}`;
        }
        return a.data;
    }
    async gettrack(id) {
        return await this._make_spotify_req(this.api_base + `tracks/${id}`);
    }
    async getAlbum(id) {
        return await this._make_spotify_req(this.api_base + `albums/${id}`);
    }
    async getplaylisttrack(id) {
        return await this._make_spotify_req(
            this.api_base + `playlists/${id}/tracks`
        );
    }
    async getplaylist(id) {
        return await this._make_spotify_req(this.api_base + `playlists/${id}`);
    }
    async checktoken() {
        if (this.token) {
            if (!this.checktime(this.token)) {
                return this.token;
            }
        }
        var token = await this.gettoken();
        if (this.token === undefined) {
            throw console.error(
                "Requested a token from Spotify, did not end up getting one"
            );
        }
        return token;
    }
    async checktime(token) {
        return token["expires_at"] - Math.round(Date.now() / 1000) < 60;
    }
}
module.exports = spotify;
