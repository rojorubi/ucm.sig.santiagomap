#!/usr/bin/python

import flickrapi
import json
from pprint import pprint

api_key = 'xxx'
secret_api_key = 'xxx'
photo_id = '8466235318'

flickr = flickrapi.FlickrAPI(api_key, secret_api_key)

try:
    photo = flickr.photos.getSizes(api_key=api_key, photo_id=photo_id, format='parsed-json')

    m = photo
    n = json.dumps(m)
    o = json.loads(n)
    #print(o['sizes'])

    sizes = o['sizes']['size']
    for s in sizes:
        label = s['label']
        if(label=="Medium"):
            print(s['source'])
            
except flickrapi.exceptions.FlickrError as ex:
    print("Error code: %s" % ex.code)
    print("Error msg: %s" % ex)
