# to load the set
import json
import pickle
from pathlib import Path
##############################################################################
# This file is to analyse all the song that don't have big genre that match  #
##############################################################################


p = Path(__file__).parents[1]
path = str(p) + '\\data'

with open(path + '\\genres.pickle', 'rb') as f:
   my_set = pickle.load(f)

genre_list = ['pop', 'rock', 'rap', 'hip hop', 'reggae', 'metal', 'lo-fi', 'jazz', 'funk', 'blues', 'variete']

for e in my_set:
   if not any(x in e for x in genre_list):
      print(e)

not_handle_genres = set()
with open(path + '\\in_formating_json.json', encoding='utf8') as jsonFile:
   json_merged = json.load(jsonFile)
   for e in json_merged:
      list_temp = []
      if e['genres'] == None:
         e['genres'] = 'empty'
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
         for g in e['genres']:
            not_handle_genres.add(g)

print(len(not_handle_genres))
print(not_handle_genres)
