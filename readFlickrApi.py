from flickrapi import FlickrAPI
from pprint import pprint
import json
import boto3
import csv

FLICKR_PUBLIC = 'f62de8ac68739905531c8378bfd4086b'
FLICKR_SECRET = '520216bfefa4089f'

flickr = FlickrAPI(FLICKR_PUBLIC, FLICKR_SECRET, format='parsed-json')
#SEARCH
extras='date_taken, owner_name,geo,tags,url_z';
pagenum=1;
cont=0;
'''
lambda para la carga inicial de datos del csv en la tabla de dynamodb
'''
def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table =dynamodb.Table('DATA_IMAGE_SANTIAGO')
    print(table.item_count);

'''

    for pagenum in range(1,10):
        flickrSearchResult = flickr.photos.search(text='camino de santiago españa spain', tags='camino,santiago,peregrino,walking tour,spain tour, xacobeo, spain, españa',per_page=250, content_type=1, has_geo=1,accuracy=3, extras=extras, bbox='-8.725076,42.10766,-1.788848,43.338097',page=pagenum,nojsoncallback=1)
        photos = flickrSearchResult['photos']['photo'];
        for photo in photos:
                print(str(cont)+"-- idphoto:"+str(photo['id'])+" title:"+str(photo['title'])+" url: "+"https://www.flickr.com/photos/"+str(photo['owner'])+"/"+str(photo['id'])+"/")
                cont+=1;
                with table.batch_writer() as batch:
                    cont=1
                    for row in lines:
                        #print(row.decode().split(';')[1])
                        batch.put_item(Item={
                            'id':str(cont),
                            'location_l':row.decode().split(';')[1],
                            'dates_take':row.decode().split(';')[2],
                            '_id':row.decode().split(';')[3],
                            'urls_url':row.decode().split(';')[4],
                            'owner_nsid':row.decode().split(';')[5],
                            'longitude':row.decode().split(';')[6],
                            'latitude':row.decode().split(';')[7],
                            'url':row.decode().split(';')[8],
                            'url_download':row.decode().split(';')[9]
                        })
                        cont+=1
'''