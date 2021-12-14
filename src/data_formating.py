# date origine genre
import json
import os
from pathlib import Path

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import pickle

if __name__ == '__main__': 
    
    p = Path(__file__).parents[1]
    path = str(p)+'\\data'
    path_list = []
    
    for file in os.listdir(path):
        print(file)
        path_list.append(path+'\\'+file)    

    with open(path_list[0], encoding = 'utf8') as jsonFile:
                json_merged = json.load(jsonFile)
                listener = path_list[0].split('\\')[-1].split('.')[0]
                for e in json_merged:
                    e['listener'] = listener
                jsonFile.close()    

    for file in path_list[1:]:
        with open(file, encoding = 'utf8') as jsonFile:
            jsonObject = json.load(jsonFile)
            listener = jsonFile.name.split('\\')[-1].split('.')[0]
            print(listener)
            for e in jsonObject:
                e['listener'] = listener
            json_merged = json_merged + jsonObject
            jsonFile.close()
            
client_credentials_manager = SpotifyClientCredentials(client_id='56bdf97188d843e5845cac4da74bdfa9', client_secret='90e79695e06f45e5bee8942f14d767f4')
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

genre_list = set()

for e in json_merged:
    result = sp.search(q='artist:'+e['artistName']+' track:'+e['trackName'], type='track', limit=1, offset=0)
    if len(result['tracks']['items']) > 0:
        track = result['tracks']['items'][0]
        artist = sp.artist(track["artists"][0]["external_urls"]["spotify"])
        e['genres'] = artist["genres"]
        
        '''
        genre_temp = set(artist["genres"])
        print(genre_temp)
        genre_list = genre_list.union(genre_temp)
        '''
'''        
with open(path+'\\genres.txt','wb') as f:
   pickle.dump(genre_list, f)
 
# to load the set 
with open(path+'\\genres.txt','rb') as f:
   my_set = pickle.load(f)
'''