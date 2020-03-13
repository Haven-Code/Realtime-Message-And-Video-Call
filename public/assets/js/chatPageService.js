var messageOffset = 10;
var notfound404 = "";
var callerID = "";
var windowOpen;
const status = io('http://localhost:8000/status');

status.on('connect', function () {

	status.on('load-done-data', (result) => {

		$('#overlay').hide();

		if (result == "404") {
			$('.listFr').html("User này không tìm thấy !");
		} else if (result == "500") {
			$('.listFr').html("Có Lỗi Xảy Ra !")
		} else {
			var b = "";
			result.forEach((friend) => {

				if (friend.is_online === "Online") {
					var onlineIcon = "";
				} else {
					var onlineIcon = "offline";
				}

				let a = '<li class="contact" onclick=\'openChatMessage("' + friend.id + '")\'>'
					+ '<div class="d-flex bd-highlight">'
					+ '<div class="img_cont">'
					+ '<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"'
					+ 'class="rounded-circle user_img">'
					+ '<span userOnline="' + friend.id + '" class="online_icon ' + onlineIcon + '"></span>'
					+ '</div>'
					+ '<div class="user_info">'
					+ ' <span> ' + friend.fullname + ' </span>'
					+ '<p userOnline="' + friend.id + '">' + friend.is_online + '</p>'
					+ '</div>'
					+ '</div>'
					+ '</li > '

				b += a;
			});

			$('.contacts').html(b);
		}

	});

});

const messageSocket = io('http://localhost:8000/message');

messageSocket.on('connect', () => {

	messageSocket.emit('send-userID', user);

	messageSocket.on('load-message-data', (data) => {
		if (data === "503") {
			$('.notification').html("Lỗi quá trình lấy tin nhắn !");
		} else if (data === "404") {
			$('.defaultBox').hide();
			$('.chatBox').show();
		} else {
			$('.defaultBox').hide();
			$('.chatBox').show();

			var dataHtml = "";

			data.reverse().forEach((mes) => {
				if (mes.sender === user) {
					let sender = `<div class="d-flex justify-content-end mb-4 msg">
							<div class="msg_cotainer_send">
								` + mes.message + `
								<span class="msg_time_send">` + timeStranfer(mes.createdAt) + `</span>
							</div>
							<div class="img_cont_msg">
								<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
									class="rounded-circle user_img_msg">
							</div>
							</div>`;
					dataHtml += sender;
				} else if (mes.sender !== user) {
					let reciver = `<div class="d-flex justify-content-start mb-4 msg">
							<div class="img_cont_msg">
								<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
									class="rounded-circle user_img_msg">
							</div>

							<div class="msg_cotainer">
								` + mes.message + `
								<span class="msg_time">` + timeStranfer(mes.createdAt) + `</span>
							</div>

						</div>`;
					dataHtml += reciver;
				}
			})
			$('.chatShowBox').html(dataHtml);
			$(".chatShowBox").stop().animate({ scrollTop: $(".chatShowBox")[0].scrollHeight }, 1000);

		}
	})

	messageSocket.on('send-message-data', (data) => {
		//console.log("Nhận DATA", data)
		var dataHtml = "";
		if (data.sender === user) {
			let sender = `<div class="d-flex justify-content-end mb-4 msg">
							<div class="msg_cotainer_send">
								` + data.message + `
								<span class="msg_time_send">` + timeStranfer(data.createdAt) + `</span>
							</div>
							<div class="img_cont_msg">
								<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
									class="rounded-circle user_img_msg">
							</div>
							</div>`;
			dataHtml += sender;
		} else {
			let reciver = `<div class="d-flex justify-content-start mb-4 msg">
							<div class="img_cont_msg">
								<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
									class="rounded-circle user_img_msg">
							</div>

							<div class="msg_cotainer">
								` + data.message + `
								<span class="msg_time">` + timeStranfer(data.createdAt) + `</span>
							</div>

						</div>`;
			dataHtml += reciver;
		}

		$('.chatShowBox').append(dataHtml);
	})

	messageSocket.on('load-more-message-data', (data) => {
		if (data === "404") {
			if (!notfound404) {
				let sender = `<div class="d-flex justify-content-center mb-4 ">
				<div class="msgEnd">
					Hết Rùiiiii  
				</div></div>`;
				$('.chatShowBox').prepend(sender);
				notfound404 = true;
			}
		} else if (data != "503" || data != "404") {
			var dataHtml = "";
			data.reverse().forEach((mes) => {
				if (mes.sender === user) {
					let sender = `<div class="d-flex justify-content-end mb-4 msg">
							<div class="msg_cotainer_send">
								` + mes.message + `
								<span class="msg_time_send">` + timeStranfer(mes.createdAt) + `</span>
							</div>
							<div class="img_cont_msg">
								<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
									class="rounded-circle user_img_msg">
							</div>
							</div>`;
					dataHtml += sender;
				} else if (mes.sender !== user) {
					let reciver = `<div class="d-flex justify-content-start mb-4 msg">
							<div class="img_cont_msg">
								<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
									class="rounded-circle user_img_msg">
							</div>

							<div class="msg_cotainer">
								` + mes.message + `
								<span class="msg_time">` + timeStranfer(mes.createdAt) + `</span>
							</div>

						</div>`;
					dataHtml += reciver;
				}
			})
			$('.chatShowBox').prepend(dataHtml);
			let arrayLength = data.length;
			messageOffset = messageOffset + arrayLength;
		}
	})

	messageSocket.on('calling-to', (data) => {
		$('.modalCaller').html('Calling From: '+data.to)
		callerID = data.from;
		$('#callingModal').modal({backdrop: 'static', keyboard: false})  
		$('#callingModal').modal('show');
	})

	messageSocket.on('calling-declined', (data) => {
		windowOpen.close();
		alert('Người Dùng Bận !');
	})

})

const userSocket = io('http://localhost:8000/user');

userSocket.on('connect', () => {

	userSocket.on('get-user-by-id-data', (data) => {

		if (data === "503") {
			$('.chatBoxName').html("Lỗi quá trình lấy tin nhắn !");
		} else if (data === "404") {
			$('.chatBoxName').html("User Không Tồn Tại !");
		} else {
			$('.chatBoxName').html(data.fullname);
			$('.chatBoxMessageCounter').attr('useronline', data._id);
			$('.chatBoxIcon').attr('useronline', data._id);
			$('.videoCallButton').attr('onclick',"videoCallButton('"+data._id+"')")
			if (data.is_online === true) {
				$('.chatBoxMessageCounter').html("Online");
				$('.chatBoxIcon').attr('class', 'online_icon chatBoxIcon');
			} else {
				$('.chatBoxMessageCounter').html("Offline");
				$('.chatBoxIcon').attr('class', 'online_icon chatBoxIcon offline');
			}

		}
	})

	userSocket.on('user-online', (userID) => {
		if (friendList !== "" || friendList !== undefined) {
			let a = JSON.parse(friendList);
			a.find(friend => {
				if (friend === userID) {
					let textSelectors = 'p[useronline=' + userID + ']';
					let spanSelectors = 'span[useronline=' + userID + ']';
					$(textSelectors).html('Online');
					$(spanSelectors).attr("class", "online_icon");
				}
			})
		}
	})

	userSocket.on('user-offline', (userID) => {
		if (friendList !== "" || friendList !== undefined) {
			let a = JSON.parse(friendList);
			a.find(friend => {
				if (friend === userID) {
					let textSelectors = 'p[useronline=' + userID + ']';
					let spanSelectors = 'span[useronline=' + userID + ']';
					$(textSelectors).html('Offline');
					$(spanSelectors).attr("class", "online_icon offline");
				}
			})
		}
	})

});

$(document).ready(function () {
	$('.chatBox').hide();
	status.emit('load-done', user);
	var messageFriendShowing = "";
})

function openChatMessage(friendID) {
	$('.friendID').attr('value', friendID);
	userSocket.emit('get-user-by-id', friendID);
	let sendData = {
		user: user,
		friend: friendID
	};
	messageSocket.emit('load-message-by-friend', sendData);
	messageFriendShowing = friendID;
}

function timeStranfer(time) {
	let dateTimestamp = Date.parse(time);
	let getDateTimestamp = new Date(time);
	let nowDateTimestamp = Date.now();
	let timeBetween = nowDateTimestamp - dateTimestamp;
	let dateBetween = new Date(timeBetween);
	var timeReturn = "";

	if (timeBetween < 86400000) {
		timeReturn = dateBetween.getHours() + " giờ trước";
	} else if (timeBetween > 86400000 && timeBetween < 172800000) {
		timeReturn = getDateTimestamp.getHours() + ":" + getDateTimestamp.getMinutes() + " Hôm qua";
	} else {
		timeReturn = getDateTimestamp.toLocaleString("es-ES");
	}

	return timeReturn;
}

$('.type_msg').on('keypress', function (e) {
	if (e.which === 13) {

		$(this).attr("disabled", "disabled");
		$('.send_btn').click();
		$(this).removeAttr("disabled");
	}
});

$('.textBox').submit((e) => {
	e.preventDefault();
	var message = $('.type_msg').val();
	var friendID = $('.friendID').val();

	if (message !== null || message !== "" || message !== undefined) {
		let msg = {
			sender: user,
			friendID: friendID,
			message: message,
			timestamp: Date.now()
		}
		messageSocket.emit('send-message', msg);
		let sender = `<div class="d-flex justify-content-end mb-4 msg">
							<div class="msg_cotainer_send">
								` + message + `
								<span class="msg_time_send">` + timeStranfer(Date.now()) + `</span>
							</div>
							<div class="img_cont_msg">
								<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
									class="rounded-circle user_img_msg">
							</div>
							</div>`;
		$('.chatShowBox').append(sender);
		$('.type_msg').val('');
		$(".chatShowBox").stop().animate({ scrollTop: $(".chatShowBox")[0].scrollHeight }, 1000);
	}
})

$(".chatShowBox").scrollTop($(".chatShowBox")[0].scrollHeight);

$('.chatShowBox').scroll(function () {
	if ($('.chatShowBox').scrollTop() == 0) {
		if (!notfound404) {
			let data = {
				user: user,
				friend: messageFriendShowing,
				offset: messageOffset
			}
			messageSocket.emit('load-more-message', data);
		}
	}
});

function videoCallButton(userID){
	let callUrl = "/videocall/incall/"+userID;
	console.log(callUrl);
	windowOpen = window.open(callUrl,"Calling !","width=1024,height=680");
}

$('.declineCall').on('click', () => {
	$('#callingModal').modal('hide');
	messageSocket.emit('decline-call', { from: callerID , to : user })
})

$('.answerCall').on('click', () => {
	let callUrl = "/videocall/outcall/"+callerID;
	console.log(callUrl);
	$('#callingModal').modal('hide');
	windowOpen = window.open(callUrl,"Calling !","width=1024,height=680");
})