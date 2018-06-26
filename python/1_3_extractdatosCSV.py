# -*- coding: cp1252 -*-

# leer el fichero y generar uno nuevo a partir de este
# el nuevo fichero será en formato csv tambien y contendrá los campos:
# "id" => id
# "url" => url
# "mujeres" => Muj2011

# funcion para comprobar si existe o no el fichero introduccido por el usuario
def existe(nombreArch):
    try:
        f = open(nombreArch)
        f.close()
        return True
    except:
        return False
    
# devuelve todas las lineas del fichero que le pasamos por parametro
def leerFichero(nombreFichero):
    varFich = open(nombreFichero, "r")
    lineasDelFichero = varFich.readlines()
    varFich.close()    
    return lineasDelFichero
    
def crearCabecera(ficheroSalida, campo1, campo2, campo3):
    cabecera = campo1+";"+campo2+";"+campo3+"\n"    
    ficheroSalida.write(cabecera)    

def crearFichero(ficheroSalida, lineas, campo1, campo2, campo3):
    #print "cabecera fichero origen: ", lineas[0]
    crearCabecera(ficheroSalida, campo1, campo2, campo3)
    # tengo que buscar el nombreCampo en la linea de cabecera del fichero
    # la linea de cabecera del fichero la tengo en lineas[0]
    lineas[0] = lineas[0].rstrip() # quitamos todos los saltos de linea o blancos de linea por la derecha
                                   # asi quitamos el \n de "Deuda2011\n"   
                                   # strip() quita los blancos por la derecha y la izquierda
    listaCabecera = lineas[0].split(";") # tengo separadas todas las etiquetas de la cabecera
    indice1 = listaCabecera.index(campo1)   
    indice2 = listaCabecera.index(campo2)    
    indice3 = listaCabecera.index(campo3)    
    lineaNueva =""
    for cont in range(1, len(lineas)):
        listaValores = lineas[cont].split(";")
        lineaNueva = listaValores[indice1]+";"+listaValores[indice2]+";"+listaValores[indice3]+"\n"
        ficheroSalida.write(lineaNueva)        

def main(nombreFichero):
    nombreF = nombreFichero
    while not existe(nombreF):
        # pedir nombres de ficheros hasta que el usuario introduzca uno que exista
        print "el fichero no existe"
        nombreF = raw_input("Introduce el nombre del fichero que quieres tratar dentro: ")
    lineas = leerFichero(nombreF)
    try:
        # establecemos a mano el nombre del fichero de salida NOTA: podría mejorarse el programa pidiendo el nombre por teclado al usuario
        ficheroSalida = open("ficheroSalida.csv", "w")
        # establecemos a mano el nombre de los campos que queremos guardar en el fichero nuevo
        # respetamos los nombres de la cabecera del fichero original para futuros tratamientos del fichero y comprobaciones, por eso escribimos los literales "texto" "Hom2011" "Muj2011" 
        crearFichero(ficheroSalida, lineas, "Texto", "Hom2011", "Muj2011") 
        ficheroSalida.close()
    except:
        print("Algo ha ocurrido mientras se generaba el fichero de salida, se ha interrumpido la ejecución del programa")

    
# -INI- del programa
nombreFichero = raw_input("Introduce el nombre del fichero que quieres tratar: ")
main(nombreFichero)







