# to load the set
import pickle
from pathlib import Path

p = Path(__file__).parents[1]
path = str(p)+'\\data'

with open(path+'\\genres.pickle', 'rb') as f:
   my_set = pickle.load(f)

genre_list = ['pop', 'rock', 'rap', 'raggae', 'metal', 'lo-fi', 'jazz', 'hip hop', 'funk', 'blues', '']

for e in my_set:
   if not any(x in e for x in genre_list):
      print(e)

print('test')