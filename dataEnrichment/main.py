import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import pandas as pd

if __name__ == '__main__':
    client_credentials_manager = SpotifyClientCredentials(client_id='56bdf97188d843e5845cac4da74bdfa9',
                                                          client_secret='90e79695e06f45e5bee8942f14d767f4')
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    for i in range(0, 1):
        result = sp.search(q='artist:Lomepal track:Flash', type='track', limit=1, offset=i)

        track = result['tracks']['items'][0]

        artist = sp.artist(track["artists"][0]["external_urls"]["spotify"])
        print("artist genres:", artist["genres"])

        album = sp.album(track["album"]["external_urls"]["spotify"])
        print("album genres:", album["genres"])
        print("album release-date:", album["release_date"])
