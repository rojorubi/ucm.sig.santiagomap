/*
funcion que scanea mi tabla de dynamodb para recorrer todos los registros y obtener la info necesaria para mostrar por cada punto su capa de información con foto, tags, fotos relacionadas, url etc
*/
var totPhotosLoaded=0;
var totPhotosWithLandmarkAnnotations=0;
function onScan(err, data) {	
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
           		/*&& tope<10*/){           	   
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

				// create popup contents						
	    		//var customPopup = title+"<br/><img src='"+photo.url_download+"' alt='"+title+"' width='250px'/>";
	    		var webEntitiesHtlm='<tr><th>Tags (score)</th><td>';
	    		var colors = ['red', '#f7ab38', 'green'];
	    		if(webEntities!=undefined && webEntities!=""){
		    		for (var i = webEntities.length - 1; i >= 0; i--) {
						//webEntitiesHtlm+="<p>"+webEntities[i]['description']+"</p>";
						webEntitiesHtlm+= '<span style="color:'+colors[i]+';font-weight:bold">'+webEntities[i]['description']+' ('+webEntities[i]['score']+')</span></br>';
						if(!array_tags.includes(webEntities[i]['description'])){
							array_tags.push(webEntities[i]['description']);
						}
					}	    				
				}else{
					console.log("webEntities empty")
				}
				webEntitiesHtlm+='</td></tr>';

				var relatedImages='<tr><th>Related images</th><td>';
				if(visuallySimilarImages!=undefined && visuallySimilarImages!=""){
					for (var j = visuallySimilarImages.length - 1; j >= 0; j--) {    
						var idzoom = photo._id+'_'+j;			
						idzoom = idzoom.trim();
						relatedImages+= '<a href="'+visuallySimilarImages[j]['url']+'" target="_blank"><img id="'+idzoom+'" src="'+visuallySimilarImages[j]['url']+'" alt="" width="100px" data-zoom-image="'+visuallySimilarImages[j]['url']+'"/></a>&nbsp;&nbsp';
					}
				}else{
					console.log("relatedImages empty")
				}
				relatedImages+='</td></tr>';    					

				customPopup = //'<div class="modal-content">'+
		          '<div class="modal-header">'+
		            '<button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button>'+
		            '<h4 class="modal-title text-primary" id="feature-title"></h4>'+
		          '</div>'+
		          '<div class="modal-body" id="feature-info"><table class="table table-striped table-bordered table-condensed">'+
		          	'<tbody>'+
		          	'<tr><th>Title</th><td style="font-weight:bold">'+title+' ('+photo.dates_take+')</td></tr>'+
		          	relatedImages+
		          	'<tr><th>Longitude</th><td>'+photo.longitude+'</td></tr>'+					          	
		          	'<tr><th>Lattitude</th><td>'+photo.latitude+'</td></tr>';

				if(landmarkAnnotations_longitude!="" && landmarkAnnotations_latitude!=""){
					customPopup = customPopup + '<tr><th>landmarkAnnotations Longitude</th><td>'+landmarkAnnotations_longitude+'</td></tr>'+
		          	'<tr><th>landmarkAnnotations Latitude</th><td>'+landmarkAnnotations_latitude+'</td></tr>';
				}		          	
		         
		        customPopup = customPopup + 	
		          	'<tr><th>Best Clasification</th><td align="center" bgcolor="#f9e339">'+bestClasification+'</td></tr>'+
		          	webEntitiesHtlm+
		          	'<tr><th>Url Flickr</th><td><a class="url-break" href="'+photo.url+'" target="_blank">'+photo.url+'</a></td>'+
		          	'</tr>'+
		          	'<tr><th>Photo</th><td align="center"><img src="'+photo.url_download+'" alt="'+title+'" width="250px"/></td></tr>'
		          	'</tbody></table><table></table></div>'+					          						          	
		          '<div class="modal-footer"></div>';
		          //+'</div>';

		        
	    		// specify popup options 
			    var customOptions =
			        {
			        'maxWidth': '500',
			        'className' : 'custom'
			        }

				var marker = L.marker(new L.LatLng(photo.latitude, photo.longitude), { title: title });
				marker.bindPopup(customPopup, customOptions);
				markers.addLayer(marker);

				tope++;
			}
        });
		
        // continue scanning if we have more photos, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            paramsscan.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(paramsscan, onScan);
        }else{
    		console.log("SCAN FINISHED. Tengo array de best tags completo. Numero de tags diferentes extraidas =  "+ array_bestClasification.length);
    		console.log("TOTAL fotos con landmarkAnnotations = "+ totPhotosWithLandmarkAnnotations);
    		createGEOJson(array_bestClasification);
        }
    }
}

function popUp(URL, nombreventana) {
    window.open(URL, nombreventana, 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=300,height=400,left = 400,top = 50');
}

function cargarGeoJson(filegeojson, iconurl, heatmap){
	var iconbase="https://s3.us-east-2.amazonaws.com/ucmap/leaflet/images/marker-base.png";
	if(iconurl!=undefined){
		iconbase = iconurl;
	}
	var ComunidadeIcon = L.icon({
	  iconUrl: iconbase,
	  iconSize: [32, 37],
	  iconAnchor: [16, 37],
	  popupAnchor: [0, -28]
	});

	if(geojsonLayer!=undefined || geojsonLayer!=""){
		map.setZoom(12);//reseteamos el zoom al inicio
		console.log("reseteamos el zoom a valor 12");
		map.removeLayer(geojsonLayer);
	}

	new L.GeoJSON.AJAX(filegeojson,{
        middleware:function(data){
            geojsonLayer = L.geoJson(data, {
              onEachFeature: function (feature, layer) {
                layer.setIcon(ComunidadeIcon);

                var datos = feature.properties.info.split(" - ");
                var title = datos[0].split(": ")[1];
                var url = datos[1].split(": ")[1];;
                var bestTag = datos[2].split(": ")[1];;
                var latitude = datos[3].split(": ")[1];;
                var longitude = datos[4].split(": ")[1];;

                var customPopup = //'<div class="modal-content">'+
		          '<div class="modal-header" sty>'+
		            '<button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button>'+
		            '<h4 class="modal-title text-primary" id="feature-title"></h4>'+
		          '</div>'+
		          '<div class="modal-body" id="feature-info"><table class="table table-striped table-bordered table-condensed">'+
		          	'<tbody>'+
		          	'<tr><th>Title</th><td style="font-weight:bold">'+title+'</td></tr>'+
		          	'<tr><th>Longitude</th><td>'+longitude+'</td></tr>'+					          	
		          	'<tr><th>Lattitude</th><td>'+latitude+'</td></tr>'+
		          	'<tr><th>Best Clasification</th><td align="center" bgcolor="#f9e339">'+bestTag+'</td></tr>'+		          	
		          	'<tr><th>Url Flickr</th><td><a class="url-break" href="'+url+'" target="_blank">URL PHOTO</a></td>'+
		          	'</tr>'+
		          	'<tr><th>Photo</th><td align="center"><img src="'+url+'" alt="'+title+'" width="150px"/></td></tr>'		          	
		          	'</tbody></table><table></table></div>'+					          						          	
		          '<div class="modal-footer"></div>';
		          //+'</div>';
		        
			    layer.bindPopup(customPopup);
				/*var customOptions =
			        {
			        'maxWidth': '500',
			        'className' : 'custom'
			        }

				var marker = L.marker(new L.LatLng(photo.latitude, photo.longitude), { title: title });
				marker.bindPopup(customPopup, customOptions);
				markers.addLayer(marker);
				*/
              }
            }).addTo(map);

            map.zoomIn(3);

            popUp("./heatmaps/heat_map_"+heatmap+".html", heatmap);

            return geojsonLayer
        }
    });

	//geojsonLayer = new L.GeoJSON.AJAX(filegeojson);       
	//geojsonLayer.addTo(map);
}

/*SE PUEDE BORRAR NO SE UTILIZA O TERMINAR DE HACER BIEN*/
function getBestTags(obj){
	var listBestTags =[];
	var totalActual="";
	var nameActual="";
	var top=10; 
	var totlBestTags=0;
	var candidate=false;
	var max="";
	if(Object.values(obj).length!=0){
		for (var j =0; j<Object.values(obj).length; j++){
			
			totalActual=Object.values(obj)[j]["total"];
			nameActual=Object.values(obj)[j]["name"];
			//console.log("values actuales total="+totalActual+" name="+nameActual);
			max="";
			if(Object.values(listBestTags).length==0){
				candidate = true;
			}else{
				for(var i =0; i<Object.values(listBestTags).length; i++){
					if(totalActual>=Object.values(listBestTags)["total"]>=totalActual){
						candidate=true;
					}
				}
			}
			if(candidate){
				listBestTags[Object.values(listBestTags).length] = totalActual+"#"+nameActual;				
			}
		}
	}
	console.log(listBestTags.sort());
}

function isKeyInObject(obj, key, latitude, longitude, customPopup2) {
	//recorrer el objeto que ya tengo y comprobar si debo añadir el nuevo valor con total 1 o sumar +1 a una posicion ya existente
	var subtotal=1;
	var subCoordinates="";
	var subPopups="";
	var pos=0;
	var found=false;
	//console.log("numero de valores entre los que busco="+Object.values(obj).length);
	if(Object.values(obj).length!=0){
		for (var j =0; j<Object.values(obj).length; j++){
			if(Object.values(obj)[j]["name"]== key.toLowerCase()){
				subtotal= Object.values(obj)[j]['total'];
				Object.values(array_bestClasification)[j]['total'] = subtotal+1;
				subCoordinates = Object.values(array_bestClasification)[j]['points'];
				Object.values(array_bestClasification)[j]['points'] = subCoordinates.concat("#["+longitude+","+latitude+"]");
				
				//console.log("FOUND TOTAL="+subtotal+1);

				//guardamos el valor de customPopup2
				subPopups = Object.values(array_bestClasification)[j]['popups'];
				Object.values(array_bestClasification)[j]['popups'] = subPopups.concat("#"+customPopup2);

				found=true;
			}
		}
	}
	if(!found){
		//console.log("NOT FOUND");
		var coordinates= "["+longitude+","+latitude+"]";
		array_bestClasification.push({total:1,name:key.toLowerCase(),points:coordinates, popups:customPopup2});		
	}
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^="'!:${}()|\[\]\/\\])/g, "\\\\$1");
}

function createGEOJson(arrayValues){
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

	geojsonFeatureINI = '{"type": "FeatureCollection","features": [';
	geojsonFeatureFIN = ']}';
	var miobj="";
	var tag="";
	var total="";
	var arrayCoordenates="";
	var arrayPopsups="";
	//var escaped = new Option(customPopup).innerHTML;
	
	//var escaped = escapeRegExp(customPopupGlobal);	
	//var escaped = escaped.split("\n").join("");
	
	//photoid, photourl, photolatitude, photolongitude, bestClasification
	
	for (var j =0; j<Object.values(arrayValues).length; j++){
		//recorremos todos los valores de coordenadas y por cada uno creamos una feature en mi objeto geojsonFeature.features push
		miobj="";
		tag = arrayValues[j]['name'];
		total = arrayValues[j]['total'];
		arrayCoordenates = arrayValues[j]['points'].split('#');
		arrayPopsups = arrayValues[j]['popups'].split('#');
		for(var pos=0; pos<arrayCoordenates.length; pos++){
			var feature='{'+
		      '"type": "Feature",'+
		      '"style": {'+
		        '"marker-color": "#a52222",'+
		        '"marker-size": "small",'+
		        '"marker-symbol": "star"'+
		      '},'+
		      '"properties": {'+
		        '"name": "'+tag+'",'+
		        '"total": "'+total+'",'+
		        '"info": "'+arrayPopsups[pos]+'"'+		        
		      '},'+
		      '"geometry": {'+
		        '"type": "Point",'+
		        '"coordinates":'+
		          arrayCoordenates[pos]+
		      '}}';

		    if(miobj==""){
		    	miobj=geojsonFeatureINI;
		    	miobj=miobj.concat(feature);	
		    }else{
		    	miobj=miobj.concat(",").concat(feature);
		    }				    
		}
		miobj=miobj.concat(geojsonFeatureFIN);
		//geojsonFeature.features.push(JSON.stringify(miobj));
		//console.log("geojson para tag="+tag+" geojson="+geojsonFeature);

		var texto = [];
		texto.push(miobj);
		textoblob = new Blob(texto, {
	        type: 'text/plain'
	    });		
		//descargarArchivoGEOJson(textoblob, tag.replace(new RegExp(" "),"_")+".geojson");
	}
}

function descargarArchivoGEOJson(contenidoEnBlob, nombreArchivo) {
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

/*
function crearGeoJsonBestClasification(tagname, longitude, latitude){
	var geojsonFeature_bestClasification = {
	    "type": "Feature",
	    "properties": {
	        "name": "Best clasification",
	        "amenity": "Baseball Stadium",
	        "popupContent": "This is where the Rockies play!"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [-104.99404, 39.75621]
	    }
	};
}*/

function queryData() {
    //document.getElementById('textarea').innerHTML = "";
    //document.getElementById('textarea').innerHTML += "Querying for _id=12302513465";

    var params = {
        TableName : "DATA_IMAGE_SANTIAGO",
        KeyConditionExpression: "#_id = :_id",
        ExpressionAttributeNames:{
            "#_id": "_id"
        },
        ExpressionAttributeValues: {
            ":_id":"12302513465"
        }
    };

    docClient.query(params, function(err, data) {
        if (err) {
            //document.getElementById('textarea').innerHTML += "Unable to query. Error: " + "\n" + JSON.stringify(err, undefined, 2);
        } else {
        	//return data.Items;
            data.Items.forEach(function(photo) {
                /*document.getElementById('textarea').innerHTML += "\n" + photo.clasification_google_vision + ": " + photo.location_l + " latitude:"+ photo.latitude+" longitude:"+photo.longitude;*/
                console.log(": " + photo.location_l + " latitude:"+ photo.latitude+" longitude:"+photo.longitude);
                //return(photo);
            });		         	
        }
        return data.Items[0];
    });
}

function addMarkerByIdPhoto(idphoto){//12302513465
	var promise = new Promise(function (resolve, reject) {
    	var params = {
	        TableName : "DATA_IMAGE_SANTIAGO",
	        KeyConditionExpression: "#_id = :_id",
	        ExpressionAttributeNames:{
	            "#_id": "_id"
	        },
	        ExpressionAttributeValues: {
	            ":_id": idphoto
	        }
	    };

	    docClient.query(params, function(err, data) {
	        if (err) {
	            //document.getElementById('textarea').innerHTML += "Unable to query. Error: " + "\n" + JSON.stringify(err, undefined, 2);
	        } else {
	        	//return data.Items;
	            data.Items.forEach(function(photo) {
	                /*document.getElementById('textarea').innerHTML += "\n" + photo.clasification_google_vision + ": " + photo.location_l + " latitude:"+ photo.latitude+" longitude:"+photo.longitude;*/
	                console.log(": " + photo.location_l + " latitude:"+ photo.latitude+" longitude:"+photo.longitude);
	                //return(photo);
	            });		         	
	        }
	        resolve(data.Items[0]);
	    });    	
	})
		
	promise.then(function(val){
		var photo = val;
		var title = photo.location_l;
		var clasification = photo.clasification_google_vision;

		var webEntities=JSON.parse(clasification)['responses'][0]['webDetection']['webEntities'];
		var bestClasification=JSON.parse(clasification)['responses'][0]['webDetection']['bestGuessLabels'][0]['label'];
		var visuallySimilarImages=JSON.parse(clasification)['responses'][0]['webDetection']['visuallySimilarImages'];

		// create popup contents
		var customPopup = title+"<br/><img src='"+photo.url_download+"' alt='"+title+"' width='250px'/>";

		var webEntitiesHtlm="";
		for (var i = webEntities.length - 1; i >= 0; i--) {
			webEntitiesHtlm+="<p>"+webEntities[i]['description']+"</p>";
		}
		customPopup=customPopup+webEntitiesHtlm;

		// specify popup options 
	    var customOptions =
	        {
	        'maxWidth': '500',
	        'className' : 'custom'
	        }
		
		var markers = L.markerClusterGroup();
		var marker = L.marker(new L.LatLng(photo.latitude, photo.longitude), { title: title });
		marker.bindPopup(customPopup, customOptions);
		markers.addLayer(marker);
		map.addLayer(markers);	
	});
}

function addMarkerByNEWIdPhoto(idphoto){//12302513465
	var promise = new Promise(function (resolve, reject) {
    	var params = {
	        TableName : "DATA_IMAGE_SANTIAGO",
	        KeyConditionExpression: "#_id = :_id",
	        ExpressionAttributeNames:{
	            "#_id": "_id"
	        },
	        ExpressionAttributeValues: {
	            ":_id": idphoto
	        }
	    };

	    docClient.query(params, function(err, data) {
	        if (err) {
	            //document.getElementById('textarea').innerHTML += "Unable to query. Error: " + "\n" + JSON.stringify(err, undefined, 2);
	        } else {
	        	//return data.Items;
	            data.Items.forEach(function(photo) {
	                /*document.getElementById('textarea').innerHTML += "\n" + photo.clasification_google_vision + ": " + photo.location_l + " latitude:"+ photo.latitude+" longitude:"+photo.longitude;*/
	                console.log(": " + photo.location_l + " latitude:"+ photo.latitude+" longitude:"+photo.longitude);
	                //return(photo);
	            });		         	
	        }
	        resolve(data.Items[0]);
	    });    	
	})
		
	promise.then(function(val){
		var photo = val;
		var title = photo.location_l;
		//var clasification = photo.clasification_google_vision;

		//var webEntities=JSON.parse(clasification)['responses'][0]['webDetection']['webEntities'];
		//var bestClasification=JSON.parse(clasification)['responses'][0]['webDetection']['bestGuessLabels'][0]['label'];
		//var visuallySimilarImages=JSON.parse(clasification)['responses'][0]['webDetection']['visuallySimilarImages'];

		// create popup contents
		var customPopup = title+"<br/><img src='"+photo.url_download+"' alt='"+title+"' width='250px'/>";

		/*var webEntitiesHtlm="";
		for (var i = webEntities.length - 1; i >= 0; i--) {
			webEntitiesHtlm+="<p>"+webEntities[i]['description']+"</p>";
		}
		customPopup=customPopup+webEntitiesHtlm;*/

		// specify popup options 
	    var customOptions =
	        {
	        'maxWidth': '500',
	        'className' : 'custom'
	        }
		
		var markers = L.markerClusterGroup();
		var marker = L.marker(new L.LatLng(photo.latitude, photo.longitude), { title: title });
		marker.bindPopup(customPopup, customOptions);
		markers.addLayer(marker);
		map.addLayer(markers);	
	});
}

function loadAllDataFromDynamoDB(){
	var paramsscan = {
	    TableName: "DATA_IMAGE_SANTIAGO"
	};
	console.log("Scanning DATA_IMAGE_SANTIAGO table from function loadAllDataFromDynamoDB.");
	docClient.scan(paramsscan, onScan);
}

function loadAllDataGeoJsonToSearch(){	
	/*{total: 192, name: "cathedral of santo domingo de la calzada"}
				{total: 130, name: "sky"}				
				{total: 82, name: "stone carving"}
				{total: 73, name: "santo domingo de la calzada"}
				{total: 64, name: "arch"}
				{total: 45, name: "sculpture"}
				{total: 35, name: "statue"}
				{total: 42, name: "carving"}
				{total: 41, name: "wall"}
				{total: 32, name: "medieval architecture"}
				{total: 27, name: "historic site"}
				{total: 20, name: "camino de santiago"}
				{total: 17, name: "tree"}
				{total: 14, name: "architecture"}
				{total: 13, name: "cathedral"}*/
/*search ini view-source:http://labs.easyblog.it/maps/leaflet-search/examples/multiple-layers.html*/

	if(geojsonLayer!=undefined || geojsonLayer!=""){
		map.removeLayer(geojsonLayer);
	}

	var geojsonArch = new L.GeoJSON.AJAX("geojson/arch.geojson");
	var geojsonSky = new L.GeoJSON.AJAX("geojson/sky.geojson");

	geojsonOpts = {
		pointToLayer: function(feature, latlng) {
			return L.marker(latlng, {
				icon: L.divIcon({						
					iconSize: L.point(16, 16),
					html: feature.properties.info[0].toUpperCase(),
				})
			}).bindPopup('<b>'+feature.properties.name+'</b>');
		}
	};
	var poiLayers = L.layerGroup([
		geojsonArch,		
		geojsonSky
	])
	.addTo(map);

	L.control.search({
		layer: poiLayers,
		initial: false,
		propertyName: 'name',
		buildTip: function(text, val) {
			//var type = val.layer.feature.properties.amenity;
			return '<a href="#" class="">'+text+'</a>';
		}
	})
	.addTo(map);
/*search fin*/
}