	var doithu;
    	var banthan;
    	var count = 0;
    	var imgpath="http://localhost:8080/MyGame/image/";
    	var wspath="ws://localhost:8080/MyGame/Server";
     	var websocket = new WebSocket(wspath);
        websocket.onopen = function(message) {processOpen(message);};
        websocket.onmessage = function(message) {processMessage(message);};
        websocket.onclose = function(message) {processClose(message);};
        websocket.onerror = function(message) {processError(message);};
        var tempElement = null;
      function processOpen(message) {
        websocket.send("INIT-"+document.getElementById("user").value.trim());
      }
      function processMessage(message) {
        if (message.data.startsWith("list_user")) {
          var listUser = message.data.replace("list_user", "").split("-");
          defaultTable("ListUser");
          for(var i=0;i<listUser.length;i++)
        	  themHang(listUser[i]);
          return;
        }
     
        ////////////////////////////////////////////////
        if(message.data.startsWith("YOUHAVEONECHALLENGER")){
        	var mes = message.data.split("-");
        	if(confirm("Bạn nhận được lời thách đấu từ: "+mes[1]+" có chấp nhận không?"))
        		websocket.send("ACCEPT-"+mes[1]);
        	else websocket.send("REFUSE-"+mes[1]);
        	return;
        }
        ///////////////////////////////////////////////////
        if(message.data.startsWith("GAMESTART")){
        	//đối phương đã chấp nhận lời thách đấu của bạn
        	count =0;
     		var list=message.data.split("-");
        	openGame(list[2]);
        	return;
        }
        /////////////////////////
        if(message.data.startsWith("REFUSE")){
        	alert("Doi phuong da tu choi");
        	return;
        }
        /////////////////////////////////////////////////
        if(message.data.startsWith("YOULOSE")){
        	//đối phương chiến thắng, thông báo gì đó và clear bàn chơi.
        	defaultTable("Game");
        	return;
        }
        if(message.data.startsWith("YOUWIN")){
        	alert("Ban da chien thang: "+doithu);
        	defaultTable("Game");
        	return;
        }
      }
      function processClose(message) {
    	  defaultTable("Game");
    	  defaultTable("ListUser");
      }
      function processError(message) {
    	  websocket.close();
      }
      function themHang(username){
  		var myTabble= document.getElementById("ListUser");
  		var row=myTabble.insertRow(0);
  		var value1 = row.insertCell(0);
  		var value2 = row.insertCell(1);
  		if(username==banthan)
  		value1.innerHTML = "<b>"+username+"</b>";
  		else{
  			value1.innerHTML = "<b>"+username+"</b>";
  	  		value2.innerHTML= "<button onClick='thachdau(\""+username+"\")'>SOLO</button>";
  		}

  	}
      function thachdau(username){
    	  doithu=username;
    	  websocket.send("THACHDAU-"+username);
      }
      function defaultTable(tablename){
  		document.getElementById(tablename).innerHTML="";
  	}
      function openGame(listImage){
    	var list=listImage.split(",");
  		var myTabble= document.getElementById("Game");
  		var i=0;
  		for(var ie=0;ie<4;ie++){
  			var row=myTabble.insertRow(0);
  			var value1 = row.insertCell(0);
  			var value2 = row.insertCell(1);
  			var value3 = row.insertCell(2);
  			var value4 = row.insertCell(3);
  			var value5 = row.insertCell(4);
  			value1.innerHTML="<image onClick='imgClick(this)' height='250' width='200' src='"+imgpath+"0.png' id='"+list[i]+"' />";
  			value2.innerHTML="<image onClick='imgClick(this)' height='250' width='200' src='"+imgpath+"0.png' id='"+list[i+1]+"' />";
  			value3.innerHTML="<image onClick='imgClick(this)' height='250' width='200' src='"+imgpath+"0.png' id='"+list[i+2]+"' />";
  			value4.innerHTML="<image onClick='imgClick(this)' height='250' width='200' src='"+imgpath+"0.png' id='"+list[i+3]+"' />";
  			value5.innerHTML="<image onClick='imgClick(this)' height='250' width='200' src='"+imgpath+"0.png' id='"+list[i+4]+"' />";
  			i+=5;
  		}
  	}
      ///////////////////////////////////////
      /////////////Control GAME///////////////
      /////////////////////////////////////////
        function imgClick(myImage) {
            var id = myImage.id.split("v");
            if (id[0] > 0) {
                if (tempElement != null && tempElement != myImage) {
                    showCard(myImage);
                    var tempID = tempElement.id.split("v");
                    if (tempID[0] == id[0]) {
                        tempElement.id = -1;
                        myImage.id = -1;
                        count++;
                        document.getElementById("result").innerHTML = count;
                        tempElement = null;
                        if (count == 10)
                            websocket.send("IMWIN-"+doithu);
                    }
                    else {
                        showCard(myImage);
                        var myVar = setTimeout(function () {
                            tempElement.src = imgpath+"0.png";
                            myImage.src = imgpath+"0.png";
                            tempElement = null;
                        }, 300);
                    }
                }
                else {
                    tempElement = myImage;
                    showCard(myImage);
                }
            }
        }
        function showCard(myImage) {
            var id = myImage.id.split("v");
            myImage.src = imgpath + id[0] + ".png";
        }