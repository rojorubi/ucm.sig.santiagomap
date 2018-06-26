from flickrapi import FlickrAPI
from pprint import pprint
import json

FLICKR_PUBLIC = 'xxx'
FLICKR_SECRET = 'xxx'

flickr = FlickrAPI(FLICKR_PUBLIC, FLICKR_SECRET, format='parsed-json')

#SEARCH
extras='date_taken, owner_name,geo,tags,url_z';
pagenum=1;
cont=0;

for pagenum in range(1,10):
	flickrSearchResult = flickr.photos.search(text='camino de santiago españa spain', tags='camino,santiago,peregrino,walking tour,spain tour, xacobeo, spain, españa',per_page=250, content_type=1, has_geo=1,accuracy=3, extras=extras, bbox='-8.725076,42.10766,-1.788848,43.338097',page=pagenum,nojsoncallback=1)
	photos = flickrSearchResult['photos']['photo'];
	for photo in photos:
	        print(str(cont)+"-- idphoto:"+str(photo['id'])+" title:"+str(photo['title'])+" url: "+"https://www.flickr.com/photos/"+str(photo['owner'])+"/"+str(photo['id'])+"/")
	        cont+=1;

#FORLOCATION
'''
https://www.flickr.com/photos/{user-id}/{photo-id}
https://www.flickr.com/photos/129023874@N06/40920264061

Recorded accuracy level of the location information. 
World level is 1, 
Country is ~3, Region ~6, City ~11, Street ~16. Current range is 1-16. 
Defaults to 16 if not specified.
'''
