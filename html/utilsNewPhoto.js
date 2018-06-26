
var _id ="";
var clasification_google_vision ="";
var dates_take ="";
var id ="";
var latitude ="";
var location_l ="";
var longitude ="";
var owner_nsid ="";
var url ="";
var url_download ="";
var urls_url ="--";

var FLICKR_api_key = 'xxx'
var FLICKR_secret_api_key = 'xxx'

//recoger todos los datos que necesito para guardar en dynamodb
//damos valor a:
//  _id
//  id
//	location_l
//	latitude
//	longitude
function step0_checkIfIdPhotoHasLocation(){
	console.log("STEP 0 CHECKING IF ID PHOTO HAS LOCATION.");
	if($("#newphoto").val()!='' && $("#newphoto").val()!= undefined){
		var idPhoto =$("#newphoto").val();
		_id = idPhoto;
		id = randomString(4);
		//{ "stat": "fail", "code": 2, "message": "Photo has no location information." }
		var photoLocUrl2 ="https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&&api_key=xxx&photo_id="+idPhoto+"&format=json&jsoncallback=?";
		$.getJSON(photoLocUrl2, function(data){
			if(data.stat=="ok"){
				location_l = data.photo.location.county._content + " - " + data.photo.location.region._content + " - " + data.photo.location.locality._content;
				latitude = data.photo.location.latitude;
				longitude = data.photo.location.longitude;
				console.log("Found photo! "+location_l+" longitude: "+longitude+" latitude: "+latitude);

				step1_getMoreInfoNewPhoto();
			}else{
				alert("Error: "+ data.message);
			}
	    });
    }else{
    	alert("Id photo empty.");
    }
}
//recoger todos los datos que necesito para guardar en dynamodb
//damos valor a:
//	dates_take
//	owner_nsid
//	url
function step1_getMoreInfoNewPhoto(){
	console.log("STEP 1 GETTING MORE INFO ABOUT PHOTO.");
	var apiUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=xxx&photo_id=" + _id + "&format=json&jsoncallback=?";
      
	$.getJSON(apiUrl, function(data){
		if(data.stat=="ok"){
			dates_take = data.photo.dates.taken;
		  	owner_nsid = data.photo.owner.nsid;
		  	url = data.photo.urls.url;
		  	//url_download
		  	console.log("Found photo! dates_take: "+dates_take+" owner_nsid: "+owner_nsid+" url: "+url);
		  	step2_getUrlValidMediumSize();
		}else{
			alert("Error getting info.");
		}
    }); 
}
//recoger todos los datos que necesito para guardar en dynamodb
//damos valor a:
//	url_download
function step2_getUrlValidMediumSize(){
	console.log("STEP 3 GET URL VALID MEDIUM SIZE.");
	var apiUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=xxx&photo_id=" + _id + "&format=json&jsoncallback=?";
    //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
	$.getJSON(apiUrl, function(data){
		if(data.stat=="ok"){
			url_download = data.sizes.size[5].source;
		  	console.log("Found photo! url_download: "+url_download);
		  	step3_insertRowInDynamodbAWS();
		}else{
			alert("Error getting url medium size.");
		}
    }); 
}

function step3_insertRowInDynamodbAWS(){
	console.log("STEP 3 INSERT ROW IN DYNAMODB AWS with _id:"+_id);
	AWS.config.update({
	  region: "us-east-2",
	  // The endpoint should point to the local or remote computer where DynamoDB (downloadable) is running.
	  endpoint: "https://dynamodb.us-east-2.amazonaws.com/DATA_IMAGE_SANTIAGO",		  
	  //  accessKeyId and secretAccessKey defaults can be used while using the downloadable version of DynamoDB. 
	  //  For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.		  
	  accessKeyId: "xxx",
	  secretAccessKey: "xxx/xxx"
	});

	var docClient = new AWS.DynamoDB.DocumentClient();
	var table = "DATA_IMAGE_SANTIAGO";
	
	var params = {
	    TableName:table,
	    Item:{
            'location_l':location_l,
            'dates_take':dates_take,
            '_id':_id,
            'id': id,
            'urls_url':urls_url,
            'owner_nsid':owner_nsid,
            'longitude':longitude,
            'latitude':latitude,
            'url':url[0]._content,
            'url_download':url_download
	    }
	};

	console.log("Adding a new item in dynamodb...");
	docClient.put(params, function(err, data) {
	    if (err) {
	        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
	    } else {
	        console.log("Added item:", JSON.stringify(data, null, 2));
	        step4_showInMapAndDownloadFileToGoogleVision();
	    }
	});
}

function step4_showInMapAndDownloadFileToGoogleVision(){
	console.log("STEP 4 SHOWING THE PHOTO AND DOWNLOAD FILE REQUEST TO GOOGLE CLOUD VISION.");

	addMarkerByNEWIdPhoto(_id);

	var contenidofile = '{"requests":[{"image":{"source":{"imageUri":"'+url_download+'"}},"features":[{"type":"LANDMARK_DETECTION","maxResults":1},{"type":"WEB_DETECTION","maxResults":3}]}]}';

	var texto = [];
		texto.push(contenidofile);
		textoblob = new Blob(texto, {
	        type: 'text/plain'
	    });	

	var reader = new FileReader();
    reader.onload = function (event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = _id+".json" || 'archivo.dat';
        var clicEvent = new MouseEvent('click', {
            'view': window,
                'bubbles': true,
                'cancelable': true
        });
        save.dispatchEvent(clicEvent);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(textoblob);	
	/*
	var filepath ="/Users/rojorubi/Documents/descarga.jpeg";

	var contenidofile = "{'requests':[{'image':{'source':{'"+url_download+"'}},'features':[{'type':'LANDMARK_DETECTION','maxResults':1},{'type':'WEB_DETECTION','maxResults':3}]}]}";
	AWS.config.update({
	  region: "us-east-2",
	  accessKeyId: "XXX",
	  secretAccessKey: "XXX"
	});
	var albumBucketName = "requestgooglecloud2";
	var s3 = new AWS.S3({
	  apiVersion: '2006-03-01',
	  params: {Bucket: albumBucketName}
	});
	var photoKey = _id+".json";
	  s3.upload({
	    Key: photoKey,
	    Body: contenidofile,
	    ACL: 'public-read'
	  }, function(err, data) {
	    if (err) {
	      return alert('There was an error uploading your photo: ', err.message);
	    }
	    alert('Successfully uploaded file in S3.');
	  });
	*/
}

function randomString(length) {
    //var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    var chars = '0123456789'.split('');

    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
