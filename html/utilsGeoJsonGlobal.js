/*
funcion que scanea mi tabla de dynamodb para recorrer todos los registros y obtener la info necesaria para mostrar por cada punto su capa de información con foto, tags, fotos relacionadas, url etc
*/
var tope=0;
var totPhotosLoaded=0;
var totPhotosWithLandmarkAnnotations=0;
function onScanGlobal(err, data) {	
	console.log("onScanGlobal inside.");
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        
		var customPopup="";		
		var dataLength=data.Count;
		console.log("Scan exitoso. Total fotos que vamos a cargar = "+dataLength);
		data.Items.forEach(function(photo) {
           customPopup="";
           if(photo.id!=null && photo.id!="" 
           		&& photo.latitude!=null && photo.latitude!=""
           		&& photo.longitude!=null && photo.longitude!=""
           		&& photo.url!=null && photo.url!=""
           		&& photo.url_download!=null && photo.url_download!=""
           		&& photo.location_l!=null && photo.location_l!=""
           		/*&& tope<5*/){           	   
	           console.log(
	           		"Photo "+totPhotosLoaded+" de "+dataLength,
	                photo._id + ": ",
	                photo.url, "- latitude:", photo.latitude,
	                "- longitude:", photo.longitude);
	      		totPhotosLoaded++;

	           	var title = photo.location_l;
				var clasification = photo.clasification_google_vision;

				
				var webEntities="";
				try { 	
					webEntities=JSON.parse(clasification)['responses'][0]['webDetection']['webEntities'];
				}catch (e) {
						console.log(e);
				}
				var bestClasification="";
				try {
					bestClasification=JSON.parse(clasification)['responses'][0]['webDetection']['bestGuessLabels'][0]['label'];
					var customPopup2 ="";
		       		customPopup2 = "title: "+title+" - url: "+photo.url_download+" - best tag: "+bestClasification+" - latitude: "+photo.latitude+" - longitude: "+photo.longitude;
		       		isKeyInObject(array_bestClasification, bestClasification, photo.latitude, photo.longitude, customPopup2);
				}catch (e) {
						console.log(e);
				}
				var visuallySimilarImages="";
				try{
					visuallySimilarImages=JSON.parse(clasification)['responses'][0]['webDetection']['visuallySimilarImages'];						
				}catch (e) {
						console.log(e);
				}

				var landmarkAnnotations="";
				var landmarkAnnotations_longitude="";
				var landmarkAnnotations_latitude="";
				try { 	
					landmarkAnnotations=JSON.parse(clasification)['responses'][0]['landmarkAnnotations'];
					if(landmarkAnnotations!="" && landmarkAnnotations!=undefined){
						totPhotosWithLandmarkAnnotations++;
						landmarkAnnotations_longitude = landmarkAnnotations[0]['locations'][0]['latLng']['longitude'];
						landmarkAnnotations_latitude = landmarkAnnotations[0]['locations'][0]['latLng']['latitude'];
						console.log("landmarkAnnotations longitude= "+landmarkAnnotations_longitude+ "latitude= "+ landmarkAnnotations_latitude);	
					}					
				}catch (e) {
				
				}   					

/*
ini datos globales
*/
				mititle = title;
				midate_take = photo.dates_take;
				milongitude = photo.longitude;
				milatitude = photo.latitude;
				milandmarkAnnotations_longitude ="";
				milandmarkAnnotations_latitude ="";
				if(landmarkAnnotations_longitude!="" && landmarkAnnotations_latitude!=""){
					milandmarkAnnotations_longitude = landmarkAnnotations_longitude;
					milandmarkAnnotations_latitude = landmarkAnnotations_latitude;
				}
				mibestClasification = bestClasification;
				miurl = photo.url;
				miurl_download = photo.url_download;
				tag1="";
				tag2="";
				tag3="";
				score1="";
				score2="";
				score3="";
				if(webEntities!=undefined && webEntities!=""){
		    		for (var i = webEntities.length - 1; i >= 0; i--) {
						if(i==1 && webEntities[i]['description']!=""){
							tag1=webEntities[i]['description'];
							score1=webEntities[i]['score']
						}else if(i==2 && webEntities[i]['description']!=""){
							tag2=webEntities[i]['description'];
							score2=webEntities[i]['score']
						}else if(i==3 && webEntities[i]['description']!=""){
							tag3=webEntities[i]['description'];
							score3=webEntities[i]['score']
						}
					}	    				
				}else{
					console.log("webEntities empty")
				}

				array_values_global.push({title:mititle, dates_takes:midate_take, longitude:milongitude, latitude:milatitude, landmarkAnnotations_latitude: milandmarkAnnotations_latitude, landmarkAnnotations_longitude: milandmarkAnnotations_longitude, bestClasification:mibestClasification, url:miurl, url_download:miurl_download, tag1:tag1, tag2:tag2, tag3:tag3, score1:score1, score2:score2, score3:score3});	
/*
fin datos globales
*/
				
				tope++;
			}
        });
		
        // continue scanning if we have more photos, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            paramsscan.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(paramsscan, onScanGlobal);
        }else{
    		console.log("SCAN FINISHED. Tengo array de best tags completo. Numero de tags diferentes extraidas =  "+ array_bestClasification.length);
    		console.log("TOTAL fotos con landmarkAnnotations = "+ totPhotosWithLandmarkAnnotations);
    		createGEOJsonGlobal(array_values_global);
        }
    }
}

function createGEOJsonGlobal(arrayValues){
	//recorrer el arrayValues y guardar una posicion por cada coodenada x,y en una posicion de mi geojson variable
	/*
	var geojsonFeature = {
		  "type": "FeatureCollection",
		  "features": [
		    {
		      "type": "Feature",
		      "style": {
		        "marker-color": "#a52222"
		      },
		      "geometry": {
		        "type": "Point",
		        "coordinates": [
		          -5.295410156249999,
		          38.324420427006544
		        ]
		      }
		    },
		    {
		      "type": "Feature",
		      "style": {
		        "marker-color": "#a52222",
		        "marker-size": "small",
		        "marker-symbol": "star"
		      },
		      "geometry": {
		        "type": "Point",
		        "coordinates": [
		          -4.41650390625,
		          37.38761749978395
		        ]
		      }
		    }
		]
	};
	*/

	/*geojsonFeature = {
		  "type": "FeatureCollection",
		  "features": []
	};*/

	/* cada una de las posiciones del array tiene los valores siguientes:
		array_values_global.push({
		title:mititle, 
		dates_takes:midate_take, 
		longitude:milongitude, 
		latitude:milatitude, 
		landmarkAnnotations_latitude: milandmarkAnnotations_latitude, 
		landmarkAnnotations_longitude: milandmarkAnnotations_longitude, 
		bestClasification:mibestClasification, 
		url:miurl, 
		url_download:miurl_download, 
		tag1:tag1, 
		tag2:tag2, 
		tag3:tag3, 
		score1:score1, 
		score2:score2, 
		score3:score3});	
	*/

	geojsonFeatureINI = '{"type": "FeatureCollection","features": [';
	geojsonFeatureFIN = ']}';
	var miobj="";
	var title="";
	var dates_takes="";
	var longitude="";
	var latitude="";
	var landmarkAnnotations_latitude="";
	var landmarkAnnotations_longitude="";
	var bestClasification="";
	var url="";
	var url_download="";
	var tag1="";
	var tag2="";
	var tag3="";
	var score1="";
	var score2="";
	var score3="";
	var feature="";
	for (var j =0; j<Object.values(arrayValues).length; j++){
		//recorremos todos los valores de coordenadas y por cada uno creamos una feature en mi objeto geojsonFeature.features push
		title=arrayValues[j]['title'];
		dates_takes=arrayValues[j]['dates_takes'];
		longitude=arrayValues[j]['longitude'];
		latitude=arrayValues[j]['latitude'];
		landmarkAnnotations_latitude=arrayValues[j]['landmarkAnnotations_latitude'];
		landmarkAnnotations_longitude=arrayValues[j]['landmarkAnnotations_longitude'];
		bestClasification=arrayValues[j]['bestClasification'];
		url=arrayValues[j]['url'];
		url_download=arrayValues[j]['url_download'];
		tag1=arrayValues[j]['tag1'];
		tag2=arrayValues[j]['tag2'];
		tag3=arrayValues[j]['tag3'];
		score1=arrayValues[j]['score1'];
		score2=arrayValues[j]['score2'];
		score3=arrayValues[j]['score3'];
		//for(var pos=0; pos<arrayValues.length; pos++){
			feature='{'+
		      '"type": "Feature",'+
		      '"style": {'+
		        '"marker-color": "#a52222",'+
		        '"marker-size": "small",'+
		        '"marker-symbol": "star"'+
		      '},'+
		      '"properties": {'+
		        '"name": "'+title+'",'+
		        '"dates_takes": "'+dates_takes+'",'+
		        '"landmarkAnnotations_latitude": "'+landmarkAnnotations_latitude+'",'+
		        '"landmarkAnnotations_longitude": "'+landmarkAnnotations_longitude+'",'+
		        '"bestClasification": "'+bestClasification+'",'+
		        '"url": "'+url+'",'+
		        '"url_download": "'+url_download+'",'+
		        '"tag1": "'+tag1+'",'+
		        '"tag2": "'+tag2+'",'+
		        '"tag3": "'+tag3+'",'+
		        '"score1": "'+score1+'",'+
		        '"score2": "'+score2+'",'+
		        '"score3": "'+score3+'"'+		        
		      '},'+
		      '"geometry": {'+
		        '"type": "Point",'+
		        '"coordinates":'+
		          "["+longitude+","+latitude+"]"+
		      '}}';

		    if(miobj==""){
		    	miobj=geojsonFeatureINI;
		    	miobj=miobj.concat(feature);	
		    }else{
		    	miobj=miobj.concat(",").concat(feature);
		    }				    
		//}
		
	}
	miobj=miobj.concat(geojsonFeatureFIN);
	var texto = [];
	texto.push(miobj);
	textoblob = new Blob(texto, {
        type: 'text/plain'
    });		
    console.log("GeoJson global completed.");
	descargarArchivoGEOJsonGlobal(textoblob, "mapSantiagoUCM.geojson");
}

function descargarArchivoGEOJsonGlobal(contenidoEnBlob, nombreArchivo) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = nombreArchivo || 'archivo.dat';
        var clicEvent = new MouseEvent('click', {
            'view': window,
                'bubbles': true,
                'cancelable': true
        });
        save.dispatchEvent(clicEvent);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(contenidoEnBlob);
};

function loadAllDataFromDynamoDBGlobal(){
	var paramsscan = {
	    TableName: "DATA_IMAGE_SANTIAGO"
	};
	console.log("Scanning DATA_IMAGE_SANTIAGO table from function loadAllDataFromDynamoDB.");
	docClient.scan(paramsscan, onScanGlobal);
}

