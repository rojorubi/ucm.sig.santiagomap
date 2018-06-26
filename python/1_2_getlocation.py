#!/usr/bin/python

import flickrapi
import json
from pprint import pprint

api_key = 'xxx'
secret_api_key = 'xxx'
photo_id = '6093476225'

flickr = flickrapi.FlickrAPI(api_key, secret_api_key)

try:
    photo = flickr.photos.geo.getLocation(api_key=api_key, photo_id=photo_id, format='parsed-json')

    m = photo
    n = json.dumps(m)
    o = json.loads(n)
    print(o['photo']['location'])

except flickrapi.exceptions.FlickrError as ex:
    print("Error code: %s" % ex.code)
    print("Error msg: %s" % ex)
