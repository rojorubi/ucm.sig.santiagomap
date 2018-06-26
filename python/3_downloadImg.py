import requests
import string

my_consts={"FIELD_URL": "URL_VALIDMedium",
"FIELD_ID": "ID",
"SEPARADOR_CAMPO":";"}

DIRECTORY="photos/"

def downloadPhoto(url_photo, name_photo):
	img_data = requests.get(url_photo).content
	with open(name_photo, 'wb') as handler:
   		handler.write(img_data)

# funcion para comprobar si existe o no el fichero introduccido por el usuario
def existe(nombreArch):
    try:
        f = open(nombreArch)
        f.close()
        return True
    except:
        return False

def getPhotos(fichero):
    #crear nuevo campo al final del fichero csv e ir rellenando el valor
    ficheroSalida = open(fichero, "r")  
    lineas = ficheroSalida.readlines()
    ficheroSalida.close()

    fichero_sinextension = fichero.split(".")
    
    lineas[0] = lineas[0].rstrip() 
    listaCabecera = lineas[0].split(my_consts["SEPARADOR_CAMPO"]) # tengo separadas todas las etiquetas de la cabecera
    indice = listaCabecera.index(my_consts["FIELD_ID"])
    indicePhoto = listaCabecera.index(my_consts["FIELD_URL"])
    contadorOK=0
    contadorKO=0

    contador = 0
    print("total lineas")
    print(len(lineas))
    for cont in range(len(lineas)):
        lineas[cont] = lineas[cont].rstrip()
        listaValores = lineas[cont].split(my_consts["SEPARADOR_CAMPO"])
        idPhoto = listaValores[indice]
        urlPhoto = listaValores[indicePhoto]
        if(idPhoto!=""):
            print(str(cont)+" de "+str(len(lineas))+" - ID-PHOTO-FLICKR:"+idPhoto+" - URL-PHOTO-FLICKR:"+urlPhoto)
            if cont!=0:
                downloadPhoto(urlPhoto, idPhoto+".jpg")

    print("TOTAL= "+str(len(lineas)))
    print("TOTAL OK= "+str(contadorOK))
    print("TOTAL KO= "+str(contadorKO))
        
    ficheroSalida.close()


def main(nombreFichero):
    nombreF = nombreFichero
    while not existe(nombreF):
        # pedir nombres de ficheros hasta que el usuario introduzca uno que exista
        gp.AddMessage("el fichero no existe")
    getPhotos(nombreF)


main("listIdPhotosAndUrlsValid.txt")
