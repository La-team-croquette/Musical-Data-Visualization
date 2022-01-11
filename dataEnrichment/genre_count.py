import json
import pickle
from pathlib import Path

##################################################################################
# This file is to reduce the genre to only the bigger one or to a genre : other  #
##################################################################################

p = Path(__file__).parents[1]
path = str(p) + '\\data'

genre_list = ['pop', 'variete', 'rap', 'blues', 'rock', 'reggae', 'metal', 'jazz', 'lo-fi', 'funk', 'other']

genre_count = dict.fromkeys(genre_list, 0)
total = 0
with open(path + '\\formated_json.json', encoding='utf8') as jsonFile:
    json_file = json.load(jsonFile)
    for e in json_file:
        if len(e['genres']) != 0:
            for g in e['genres']:
                genre_count[g] = genre_count[g] + 1
                total += 1

chart_dict = []
for k, v in genre_count.items():
    chart_dict.append({
        'name': str(k),
        'percentage': round(v/total, 3),
        'value': v,
        'color': '#000000',
    })

with open(path + '\\genre_count.json', 'w') as fp:
    json.dump(chart_dict, fp)