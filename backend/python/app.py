import json
import requests
import spotipy

from flask import Flask, request, jsonify
from flask_cors import CORS
from spotipy.oauth2 import SpotifyClientCredentials

YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/playlistItems"

app = Flask(__name__)
CORS(app, origins=["https://poetrainy-playlist-mixer.vercel.app", "http://localhost:5173"])

def get_youtube_playlist(key: str, playlist_id: str):
  playlist_params = {"part": ["contentDetails", "snippet"], "playlistId": playlist_id, "maxResults": "100", "key": key}
  response = requests.get(YOUTUBE_URL, playlist_params)
  items = response.json()["items"]

  result = []
  for item in items:
    result.append({
      "id": item["id"],
      "title": item["snippet"]["title"],
      "artist": item["snippet"]["videoOwnerChannelTitle"],
      "thumbnail": item["snippet"]["thumbnails"]["standard"],
    })
    
  return result

def get_spotify_playlist(client_id:str, client_secret:str, playlist_id: str): 
  client_credentials_manager = SpotifyClientCredentials(client_id, client_secret)
  sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
  response = sp.playlist_tracks(playlist_id)
  items = response["items"]
  
  result = []
  for item in items:
    track = item["track"]
    track_info = {
      "id": track["id"],
      "title": track["name"],
      "artist": track["artists"][0]["name"],
      "thumbnail": track["album"]["images"][0],
      "album": track["album"]["name"],
      "url": track["external_urls"]["spotify"],
    }
    result.append(track_info)
  
  return result

@app.route("/youtube", methods=["GET"])
def youtube_playlist():
  key = request.headers.get("Key")
  playlist_id = request.args.get("playlistId")

  result = get_youtube_playlist(key, playlist_id)
  return result

@app.route("/spotify", methods=["GET"])
def spotify_playlist():
  client_id = request.headers.get("Client-Id")
  client_secret = request.headers.get("Client-Secret")
  playlist_id = request.args.get("playlistId")

  result = get_spotify_playlist(client_id, client_secret, playlist_id)
  return result

if __name__ == "__main__":
  app.run(debug=True, port=8000)
