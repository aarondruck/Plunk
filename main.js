// using easywebsocket.org


var ChatAnywhere	= function(){
	
	var channelName	= jQuery.url.param("channel")	|| "wsanywhere-chat";
	var username	= jQuery.url.param("user")	|| "user-"+Math.floor(Math.random()*9999);
	
	// TODO put that in jQuery ? what is this ? obsolete ?
	var statusEl	= document.getElementById("chat-status")
	var textAreaEl	= document.getElementById("chat-textarea")
	var usernameEl	= document.getElementById("chat-username")
	var formEl	= document.getElementById("chat-form");
	var inputEl	= document.getElementById("chat-input")
	// var get Image from server here for inputEl
	var submitEl	= document.getElementById("chat-submit");

	var setUsername	= function(username){
		jQuery("#container .header .username").empty().text(username)
	}
	setUsername(username)
	jQuery("#container .header .channel.value").text(channelName)
	var setStatus	= function(status){
		jQuery("#container .header .status").text(status)
	}
	var updateChatArea	= function(tmplClass, tmplData){
		$( "#container ."+ tmplClass).tmpl(tmplData)
			.appendTo("#container .chatArea");
		// scroll to the bottom
		var chatAreaEl	= jQuery("#container .chatArea").get(0);
		chatAreaEl.scrollTop = jQuery("#container .chatArea").height();
	}
	
	var setMessage	= function(tmplData){
		updateChatArea("tmplChatMessage", tmplData)
		updateImage();
	}
	
	var setJoin	= function(tmplData){
		updateChatArea("tmplChatJoin", tmplData)
	}
	var setRename	= function(tmplData){
		updateChatArea("tmplChatRename", tmplData)
	}
	
	jQuery("#container .header .editButton").click(function(){
		var selector	= "#container .header .username";
		var oldUsername	= jQuery("#container .header .username").text();
		jQuery(selector).empty();
		jQuery("<input type='text'/>").attr("value", oldUsername).appendTo(selector);
		jQuery(selector+ " input").focus();
		jQuery(selector+ " input").blur(function(){
			var newUsername	= jQuery(selector+ " input").val();
			jQuery("#container .footer .input").focus();
			if( !newUsername )	return;
			setUsername(newUsername);
			sendRename(oldUsername, newUsername)
		})
	})
	
	var socketUrl	= "ws://example.com/"+channelName;
	var socket	= new EasyWebSocket(socketUrl);
	socket.onopen	= function(){
		setStatus("Connected");
		sendJoin(username);
	}
	socket.onmessage= function(event){
		var event	= JSON.parse(event.data);
		//console.log("event", event)
		if( event.type == "message" ){
			setMessage(event.data);			
		}else if( event.type == "join" ){
			setJoin(event.data);			
		}else if( event.type == "left" ){
		}else if( event.type == "rename" ){
			setRename(event.data);
		}else{
			//console.log("unhandled event in socket message")
		}
	}
	socket.onclose	= function(){
		setStatus("Closed");
	}
	
	// function fireThisEvent() {
	// 	alert("fireThisEvent()!");
	// }
	
	//PINGS THE BROWSER, fires on the mobile side index.php, not desktop browser
	ChatAnywhere.prototype.fireThisEvent = function()
	{
		//set userID in chat.html from index.php here?
		//$('#result').load('draw/index.php #test');
		//this is what appears in the chatbox on chat.html in chatArea
		
		var username = jQuery("#container .header .username").text()
		var message	= "here's a message";
		if( !message )	return false;
		//this is what is fired off with the username and message... sendMessage()
		sendMessage(username, inputEl.value);
		inputEl.value	= "";		
		return false;
		
	}
	
	//send the event!
	// $("#myButton").click(function(){
	// 	alert("myButton hit!");
	// 	var username	= "test123";
	// 	var message	= inputEl.value;
	// 	if( !message )	return false;
	// 	//this is what is fired off with the username and message... sendMessage()
	// 	sendMessage(username, inputEl.value);
	// 	inputEl.value	= "";
	// 	return false;
	// })
	
	//display image on canvas
	function updateImage() {
		
		//send the userID from index.php to chat.html, and grab the userID here?
		//alert($("#result").text());
		
		//$.get('draw/index.php')
		//need to grab the new userID from phone here, not from browser
		//alert(jQuery("#container .chatArea div:last-child span.username").text());
		
		// need to grab userID from canvas here?
		
		
		//change user name to above, APPEND THE HTML TO THE PAGE! so multiple users can add their images
		var usernameForImage = jQuery("#container .chatArea div:last-child span.username").text();
		$("#bigCanvasArea .myImage").append("<img src='draw/images/" + usernameForImage + "-image.png' style='position:relative; width:2000px;height:2000px;margin:0 auto;'>");
		
		$("#bigCanvasArea .myImage img").animate({
		   top: (Math.floor(Math.random()*501)),
		   left: (Math.floor(Math.random()*501)),
		   height: 200,
		   width: 200
		}, 1000).animate({
		   //bounce up
		   height: 210,
		   width: 210
		}, 180).animate({
		   height: 200,
		   width: 200
		}, 175).animate({
		   //bounce up
		   height: 205,
		   width: 205
		}, 125).animate({
		   height: 200,
		   width: 200
		}, 105);
		
		//LOAD SOUND - arrow dart
		var audioSplatt = document.createElement('audio');
		audioSplatt.setAttribute('src', 'draw/wav/impact.wav');
		audioSplatt.play();	
	}
	
	var socketSend	= function(data){
		//console.log("socketSend", data)
		socket.send(JSON.stringify(data));
	}
	var sendMessage	= function(username, message){
				
		socketSend({
			type	: "message", // change the type?
			data	: {
				username: username,
				message	: inputEl.value + " fire!"		
				//image				
			}
		});
	}
	
	var sendJoin	= function(username){
		socketSend({
			type	: "join",
			data	: {
				username: username,
			}
		});
	}
	var sendLeave	= function(username){
		socketSend({
			type	: "leave",
			data	: {
				username: username,
			}
		});
	}
	var sendRename	= function(oldUsername, newUsername){
		socketSend({
			type	: "rename",
			data	: {
				newUsername: newUsername,
				oldUsername: oldUsername
			}
		});
	}
	

	
}



jQuery(function(){	
	var chat	= new ChatAnywhere();
		
})
