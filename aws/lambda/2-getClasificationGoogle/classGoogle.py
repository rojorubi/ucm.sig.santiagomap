import json
import urllib2
import os
import boto3
from boto3.dynamodb.conditions import Key, Attr

def updateRowInDynamoDB(idphoto, clasification):
    table = boto3.resource('dynamodb').Table('DATA_IMAGE_SANTIAGO')
    response = table.update_item(
        Key={
            '_id': str(idphoto)
        },
        UpdateExpression="set clasification_google_vision = :c",
        ExpressionAttributeValues={
            ':c': str(clasification)
        },
        ReturnValues="UPDATED_NEW"
    )
    print "UpdateItem succeeded:"
    print(json.dumps(response, indent=4))
    print "end process."
    
def callingToGoogle(idphoto, url_process_lead, payload_json):
    print "Calling to google..."
    req = urllib2.Request(url_process_lead, payload_json)
    req.add_header("Content-type", "application/json")
    res = urllib2.urlopen(req)
    response = res.read()
    print "Response to GOOGLE CODE CLASIFICATION IMAGE:",response
    #buscar en la tabla de dynamo el _id de la foto con idphoto e insertar el valor del campo clasification_google_vision
    updateRowInDynamoDB(idphoto, response)
    
#https://github.com/gxx/aws-lambda-python/blob/master/ARTICLE.md
def lambda_handler(event, context):
    print "Event:",event
    # Obtain the bucket name and key for the event
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    print "bucket_name:",bucket_name
    key_path = event['Records'][0]['s3']['object']['key']
    print "key_path:",key_path
    idphoto = key_path.split(".")[0]
    print "idphoto:",idphoto
    payload_json_s3 = boto3.resource('s3').Object(bucket_name, key_path).get()['Body'].read() # Retrieve the S3 Object
    print "body from s3 json:",payload_json_s3
    url_process_lead = 'https://vision.googleapis.com/v1/images:annotate?key=xxx'
    payload_json=json.dumps(json.loads(payload_json_s3))
    callingToGoogle(idphoto, url_process_lead, payload_json)