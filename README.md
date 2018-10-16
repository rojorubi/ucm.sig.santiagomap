# ucm.sig.santiagomap
El propósito general del proyecto será analizar un conjunto de fotografías geolocalizadas obtenidas de la red social Flickr y todas ellas tomadas en el camino de Santiago español. A partir de esta información analizaremos el contenido visual de cada fotografía utilizando la interface de programación de aplicaciones (API) proporcionada por Google en la herramienta Cloud Vision.


# **Objetivo principal de proyecto**

El objetivo principal del trabajo es tener un sistema automatizado para poder clasificar y visualizar fotografías geolocalizadas obtenidas de la red de Flickr.
 

Hacer crecer un análisis espacial, utilizando un SIG, con las temáticas identificadas en cada una de las fotografías.
  
**Partimos de un shape file con 2500 fotografías geolocalizadas principalmente en la zona concretamente en la provincia de Logroño.**

# Localización principal de la imágenes utilizadas

**![](https://lh5.googleusercontent.com/68rVeBHF_UpZ8370gT6qdrUeqEartfAv_O_tp191BohGDX8sxCGq-B8XPte0oEIrORLnD7TKDQzH1_M5FiJ7C4V3g39zELcx75YR7SRJnG21BFicx9R2x0AJkAgoMDoohU5yiHfm5ew)**

## Características principales del proyecto

![enter image description here](https://lh3.googleusercontent.com/5fGJSEvWLnym1QwnycSKilA0hD9cy0WeDsjw32TbLT2Yb5aaapXhV-RfaigAz5v6OV6z44QE0Q2dwg)

## **Proceso completo para la obtención de un fichero csv con los datos finales.**

**![](https://lh6.googleusercontent.com/GjmXztarn0C5D25eS5hPTQoGgqSEhLckUwvvGX57PoW2V9lpB99rKsTHQqTnNFiom0dQnNKjJixd2KhyhOV-S4qNkHCe_WZOC1x_L9Dg2P47CoNtDAbko0tUo9hrkAYYGorAJ8kd7ww)**

## **Cloud Vision**

Detección de etiquetas:

1.  Clasificación de tres etiquetas (tag1, tag2 y tag3).
    
2.  Mejor clasificación (best tag).
    

Detección web:

1.  Urls (3) de fotos relacionadas con la original.
    

Detección de puntos de referencia:

1.  Puntos de interés y errores de georrefenciación a partir de ellos.

**![](https://lh3.googleusercontent.com/Qspy8cy1sO9kGa_jmDrgLZDkmeDUG1YG8FN_wLQvvmIWp6kSOd18IfGXVpo-zIjpU7_OLJOijKhg1UfmWyfPKpVS2A_OuLcPu1NNr0HVLEa6VTnyNKwk7qDjRnbvI8zWLBp_1Bykb-4)**

## **Llamada curl ejemplo a Google Cloud Vision**

**![](https://lh6.googleusercontent.com/edcYQcRSuhb8yATePliS4D4iizS8WO3qei70PNkXqghlBHnqWJnFkBELanzRn49YBLagnxqg1nnF7m0QDgKSz4wZMU-fAC7ZkNs1HmeldvpcQFmVgaMDDIOwYGzm94MhHE31UWQbdls)**

## **Datos de entrada API Google Cloud Vision**

**![](https://lh6.googleusercontent.com/e6MAhLCIBiCS-7PrWeR-dmITFFCBYS2ZoUSAFMSud57NvSi-Wz7HZfBVfBthgnJ4JBdKFmJ82XU08nDROoI0JuZQqGTp6enmZunuxvJ_USOlAwwUqo1eRdav_mKhJanvSqgi1CqIxTE)**

# **Datos resultado de la clasificación**
**![](https://lh6.googleusercontent.com/_NnqR3iAzlBBkcP70kwrD7G7C4WPjB6xOurppC1RYMSxe3smirw3JeHKA6OBFDqfpqbPUZmNfmz2ORKSLzPr014-XiAg7tkYGdAuKrDX3BAsOjlVsWAH2VeFw3WsMTXu3K5zNaHauRM)**

**![](https://lh5.googleusercontent.com/fdwSKeUdC8f6sF2xDkpya21v3PzcRPGgqHVZ4QsJLE8RyBb9KgBiguA4LNehTBmyGlvQ2SSfQht1cL5c6s-GbbPfXYeiA4Rc9-jFAp8fg91VoZNl59-6c8uptqRQ2XLMXVOHljCZfwU)**
## Imagen sin clasificar

**![](https://lh6.googleusercontent.com/BTTsoWDiJ7Wmne9P1EzSFhgif8ObC7mOLqv5G4dRQ9QgPANB387VyoY1tFSmfqWFCLaTzGXsWUfSmweuwnAMyBSOrJZR5U4neH8j1mycdyOPQ4ZJR_ffX6p8asGULXUHT1LqUygXBlE)**

## Imagen clasificada

**![](https://lh4.googleusercontent.com/XCTDOI4SGlydIrfohtO-9N-iowXd78UDyt7uvqRgsBAAWaFoIUP1EFJdeCbEKsqBtyvnFXaZlGXV-R7gPtj78afo3XFr_OTDCmgZ8eekxBaZmIqnYjukQMLoQrKs2FFwzvT9mc6IEiU)![](https://lh3.googleusercontent.com/Hw05VGbieWLg8ZYVuDaONUaIXbp-30pjLFqVXOplgEsFq8gRY_lr-tdH9F5LsyRHwQzclXkDYqoLTaC4eZpnnhdO6ZOk82NedhC9CsMMSFWmAFZ9bso3SvM2NSN4VrSwNYQaD6YYIYU)**
## Proceso para añadir imágenes nuevas a partir del identificador de la fotografía en Flickr


**![](https://lh6.googleusercontent.com/77LqKV9b7BeYahLuPm1NHLXdFmmVSyWbm6UUCwG7zz6KZ2I-sv8s9-wtv4moYd4ntEePrT38xa_yam8RCVfBPS8woOrKIr7ZXMiXrPRhgjn8bCm9R7pYx-ciLwMdkLhOq8gxYtcAU_s)**

## Esquema del uso de web services de Amazon.

**![](https://lh3.googleusercontent.com/QsiK7HJNhLo_fPJwiMJa8qMpTQU78f52rm8HJV7-V6gLWnOmVYBWlEY4b7z1zIsgB78OA2BQVTPSwqc6Wk4-47W-Hu_Oa0TsPtjQJpLoh1U3GrAbu3zbH1lCPeJ3DPrKGUqAFi0GD1k)**
