import boto3
import csv

'''
lambda para la carga inicial de datos del csv en la tabla de dynamodb
'''
def lambda_handler(event, context):
    s3 = boto3.resource('s3')
    dynamodb = boto3.resource('dynamodb')

    bucket = s3.Bucket('filescsv')
    object_key = 'SantoDomingo3_v3.csv'

    obj = bucket.Object(object_key)
    print('Bucket name: {}'.format(bucket.name))
    print('Object key: {}'.format(obj.key))
    print('Object content length: {}'.format(obj.content_length))
    print('Object body: {}'.format(obj.get()['Body'].read()))
    print('Object last modified: {}'.format(obj.last_modified))

    lines = obj.get()['Body'].read().split(b'\n')
    #for r in lines:
       #print(r.decode())
    
    table =dynamodb.Table('DATA_IMAGE_SANTIAGO')

    #FID;location_l;dates_take;_id;urls_url;owner_nsid;longitude;latitude;url;url_download
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
