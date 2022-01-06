import json
import pickle
from pathlib import Path

##################################################################################
# This file is to reduce the genre to only the bigger one or to a genre : other  #
##################################################################################

p = Path(__file__).parents[1]
path = str(p) + '\\data'

with open(path + '\\genres.pickle', 'rb') as f:
    my_set = pickle.load(f)

genre_list = ['pop', 'rock', 'rap', 'hip hop', 'reggae', 'metal', 'lo-fi', 'jazz', 'funk', 'blues', 'variete']
with open(path + '\\in_formating_json.json', encoding='utf8') as jsonFile:
    json_merged = json.load(jsonFile)
    for e in json_merged:
        list_temp = []
        if e['genres'] == None:
            e['genres'] = ['other']
            continue
        else:
            flag = False
            for x in genre_list:
                if flag:
                    break
                else:
                    for e_genre in e['genres']:
                        if x in e_genre:
                            e['genres'].remove(e_genre)
                            list_temp.append(x)
                            break
        if len(list_temp) == 0:
            e['genres'] = ['other']
        else:
            e['genres'] = list_temp

for e in json_merged:
    genre_set = set(e['genres'])
    if 'hip hop' in genre_set:
        genre_set.add('rap')
        genre_set.remove('hip hop')
        e['genres'] = list(genre_set)

with open(path + '\\formated_json.json', "w") as f:
    json.dump(json_merged, f)