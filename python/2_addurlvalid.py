# -*- coding: utf8 -*-
import string
#import arcpy
#import arcgisscripting
#gp= arcgisscripting.create() # obtenemos la ventana gráfica de arcgis
import flickrapi
import json
api_key = 'f62de8ac68739905531c8378bfd4086b'
secret_api_key = '520216bfefa4089f'

my_consts={"FIELD_LONGITUDE": "longitude",
"FIELD_ID": "_id",
"FIELD_FID":"FID",
"FIELD_URL":"urls_url",
"FIELD_LATITUDE":"latitude",
"SEPARADOR_CAMPO":";"}

SIZE_MEDIUM="Medium"

# funcion para comprobar si existe o no el fichero introduccido por el usuario
def existe(nombreArch):
    try:
        f = open(nombreArch)
        f.close()
        return True
    except:
        return False

#obtengo la url de la foto de flickr en calidad media para luego poder pasar en el curl a google y clasificar la imagen
def getUrlValidMediumSize(photo_id, size):
    '''
    EJEMPLO:
    https://farm1.staticflickr.com/2/1418878_1e92283336_m.jpg

    farm-id: 1
    server-id: 2
    photo-id: 1418878
    secret: 1e92283336
    size: m
    https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
    '''
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
            if(label==size):
                url =s['source']
                if(url!="" or url!=null):
                    #print("URL VALID-->"+url)
                    return str(url)
	            
    except flickrapi.exceptions.FlickrError as ex:
        print("Error code: %s" % ex.code)
        print("Error msg: %s" % ex)
        return "ko"

#metodo para guardar el json que requiere la llamada a google por cada id de photo de flickr
#def getJsonRequestGoogleById():

#fichero con todos los curls de todas las fotos que quiero clasificar en google
#def getCurlGoogleById(url_photo):


def getListOfIdPhotos(fichero, misize):
    #crear nuevo campo al final del fichero csv e ir rellenando el valor
    ficheroSalida = open(fichero, "r")  
    lineas = ficheroSalida.readlines()
    ficheroSalida.close()

    fichero_sinextension = fichero.split(".")
    fichero_nuevo = "listIdPhotosAndUrlsValid.txt"
    ficheroSalida = open(fichero_nuevo, "w")
    
    lineas[0] = lineas[0].rstrip() 
    listaCabecera = lineas[0].split(my_consts["SEPARADOR_CAMPO"]) # tengo separadas todas las etiquetas de la cabecera
    indice = listaCabecera.index(my_consts["FIELD_ID"])
    
    contadorOK=0
    contadorKO=0

    #realizar solo si NO existe ya un campo con el mismo nombre
    if("longitude" not in listaCabecera and "latitude" not in listaCabecera):
        contador = 0
        print("total lineas")
        print(len(lineas))
        for cont in range(len(lineas)):
            #gp.AddMessage(cont)
            #print(cont)
            
            lineas[cont] = lineas[cont].rstrip()
            #lineas[cont] = lineas[cont].replace(" ","-")
            
            listaValores = lineas[cont].split(my_consts["SEPARADOR_CAMPO"])
            if cont==0:
                lineaNueva = "ID"+my_consts["SEPARADOR_CAMPO"]+"URL_VALID"+misize+"\n"
                ficheroSalida.write(lineaNueva)
            else:
                idPhoto = listaValores[indice]
                if(idPhoto!=""):
                    print(str(cont)+" de "+str(len(lineas))+" ------ ID-PHOTO-FLICKR:"+idPhoto)

                    url_valid = getUrlValidMediumSize(idPhoto, SIZE_MEDIUM);

                    #createJsonCurlGoogle(idPhoto);

                    if(str(url_valid)!="ko"):
                        lineaNueva = idPhoto+my_consts["SEPARADOR_CAMPO"]+url_valid+"\n"
                        print(lineaNueva)
                        lineaNueva = ficheroSalida.write(lineaNueva)
                        contadorOK+=1
                    else:
                        contadorKO+=1
        print("TOTAL= "+str(len(lineas)))
        print("TOTAL OK= "+str(contadorOK))
        print("TOTAL KO= "+str(contadorKO))
            
    else:
        gp.AddMessage("No se ha creado el nuevo campo"+nombreField+"ya estaba creado con anterioridad")

    
    ficheroSalida.close()


def main(nombreFichero, misize):
    nombreF = nombreFichero
    while not existe(nombreF):
        # pedir nombres de ficheros hasta que el usuario introduzca uno que exista
        gp.AddMessage("el fichero no existe")
    getListOfIdPhotos(nombreF, misize)


main("SantoDomingo3.csv", SIZE_MEDIUM)
