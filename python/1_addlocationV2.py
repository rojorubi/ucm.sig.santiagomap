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
"FIELD_URL_TO_DOWNLOAD":"url_download",
"SEPARADOR_CAMPO":";"}

SIZE_MEDIUM="Medium"

def createJsonFileToSendS3(idPhoto, urlPhoto):
    ficheroSalida = open("filesJsonFinalesCurl/"+idPhoto+".json", "w")

    linea = '{"requests":[{"image":{"source": {"imageUri":"'+urlPhoto+'"}},"features":[{"type":"LANDMARK_DETECTION","maxResults":1},{"type":"WEB_DETECTION","maxResults":3}]}]}';

    print("linea: "+linea)

    linea_json=json.dumps(json.loads(linea))
            
    #linea = "{'id':'"+idPhoto+"','url':'"+urlPhoto+"'}"
    ficheroSalida.write(linea_json) 
    ficheroSalida.close()

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

def getUrlString(field_url):
    # [ { ""type"": ""photopage"", ""_content"": ""https:\/\/www.flickr.com\/photos\/chinetphotography\/4262480695\/"" } ]
    #print(field_url)
    #obtener la url del campo en json que tenemos en el csv original
    field_url =field_url.replace("[","")
    field_url =field_url.replace("]","")
    field_url =field_url.replace("\"\"","\"")
    field_url =field_url.replace("\\","")
    #field_url =field_url.replace(" ","")
    field_url =field_url.replace("\"","'")
    field_url_formatted = eval(field_url)
    
    m = field_url_formatted
    n = json.dumps(m)
    o = json.loads(n)
    url =o['_content']
    if(url!="" or url!=null):
        print("URL-->"+url)
        return str(url)
    else:
        return "ko"

def getLocationByIdPhoto(photo_id):
    flickr = flickrapi.FlickrAPI(api_key, secret_api_key)

    try:
        photo = flickr.photos.geo.getLocation(api_key=api_key, photo_id=photo_id, format='parsed-json')

        m = photo
        n = json.dumps(m)
        o = json.loads(n)
        #print(o)
        longitude =o['photo']['location']['longitude']
        latitude =o['photo']['location']['latitude']
        stat = o['stat']
        #print("---------LOCATION ---------")
        #print(o['photo']['location']['latitude'])
        #print(o['photo']['location']['longitude'])
        if(stat=="ok"):
            return [longitude,latitude]
    
    except flickrapi.exceptions.FlickrError as ex:
        print("Error code: %s" % ex.code)
        print("Error msg: %s" % ex)
        return "ko"

# funcion para comprobar si existe o no el fichero introduccido por el usuario
def existe(nombreArch):
    try:
        f = open(nombreArch)
        f.close()
        return True
    except:
        return False

def addFieldsLocation(fichero):
    #crear nuevo campo al final del fichero csv e ir rellenando el valor
    ficheroSalida = open(fichero, "r")  
    lineas = ficheroSalida.readlines()
    ficheroSalida.close()

    fichero_sinextension = fichero.split(".")
    fichero_nuevo = fichero_sinextension[0]+"_v3FINAL.csv"
    ficheroSalida = open(fichero_nuevo, "w")
    
    lineas[0] = lineas[0].rstrip() 
    listaCabecera = lineas[0].split(my_consts["SEPARADOR_CAMPO"]) # tengo separadas todas las etiquetas de la cabecera
    indice = listaCabecera.index(my_consts["FIELD_ID"])
    indiceURL = listaCabecera.index(my_consts["FIELD_URL"])
    
    contadorOK=0
    contadorKO=0
    contadorUrlOK=0
    contadorKO=0

    #realizar solo si NO existe ya un campo con el mismo nombre
    if("longitude" not in listaCabecera and "latitude" not in listaCabecera and "url_valid" not in listaCabecera):
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
                lineaNueva = lineas[cont]+my_consts["SEPARADOR_CAMPO"]+"longitude"+my_consts["SEPARADOR_CAMPO"]+"latitude"+my_consts["SEPARADOR_CAMPO"]+"url"+my_consts["SEPARADOR_CAMPO"]+"url_download"+"\n"
                ficheroSalida.write(lineaNueva)
            else:
                idPhoto = listaValores[indice]

                #if(idPhoto=="12324269274"):
                
                if(idPhoto!=""):
                    print(str(cont)+" de "+str(len(lineas))+" ------ ID-PHOTO-FLICKR:"+idPhoto)
                    location = getLocationByIdPhoto(idPhoto)
                    if(str(location)!="ko"):

                        fieldUrl = listaValores[indiceURL]
                        url = getUrlString(fieldUrl)

                        if(str(url)!="ko"):
                            print("longitude="+location[0]+" latitude="+location[1])

                            url_valid = getUrlValidMediumSize(idPhoto, SIZE_MEDIUM);
                            if(str(url_valid)!="ko"):
                                
                                print("url_download="+url_valid)
                                contadorUrlOK+=1

                                lineaNueva = lineas[cont]+my_consts["SEPARADOR_CAMPO"]+location[0]+my_consts["SEPARADOR_CAMPO"]+location[1]+my_consts["SEPARADOR_CAMPO"]+url+my_consts["SEPARADOR_CAMPO"]+url_valid+"\n"
                                ficheroSalida.write(lineaNueva)

                                createJsonFileToSendS3(idPhoto,url_valid)

                                contadorOK+=1
                            else:
                                contadorUrlKO+=1
                        else:
                            contadorKO+=1
                    else:
                        contadorKO+=1
                #else:
                    #print(cont)
        print("TOTAL= "+str(len(lineas)))
        print("TOTAL OK= "+str(contadorOK))
        print("TOTAL KO= "+str(contadorKO))
        print("TOTAL Url OK= "+str(contadorUrlOK))
        print("TOTAL Url KO= "+str(contadorUrlKO))
            
    else:
        gp.AddMessage("No se ha creado el nuevo campo"+nombreField+"ya estaba creado con anterioridad")

    
    ficheroSalida.close()

#def main(nombreFichero, nombreCampo, valorNull):
def main(nombreFichero):
    nombreF = nombreFichero
    while not existe(nombreF):
        # pedir nombres de ficheros hasta que el usuario introduzca uno que exista
        #gp.AddMessage("el fichero no existe")
        print("el fichero no exite")
    #try:
    # por cada linea del fichero buscado por su id introducimos dos valores mas por registro, su longitud y latitud

    addFieldsLocation(nombreF)
    #addField(nombreF, "TipoDeuda")
    
    #except:
        #gp.AddMessage("Algo ha ocurrido mientras se hacian los cálculos, se ha interrumpido la ejecución del programa")

    
# -INI- del programa
#nomFichero = arcpy.GetParameterAsText(0)
#nomCampo = arcpy.GetParameterAsText(1)
#valorNull = arcpy.GetParameterAsText(2)

#gp.AddMessage("Calculando datos...")
main("SantoDomingo3.csv")







