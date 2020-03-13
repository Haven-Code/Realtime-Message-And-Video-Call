var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
const localVideo = $('#videoLocalStream')[0];
const remoteVideo = $('#videoRemoteStream')[0];
var moveTimer;
var streamSrc;

$('.videoFrame')
	.mouseenter(function () {
		$('.callControlButton').fadeIn();
		clearTimeout(moveTimer);
		moveTimer = setTimeout(function () {
			$('.callControlButton').delay(1000).fadeOut();
		}, 100)
	})
	.mouseleave(function () {
		clearTimeout(moveTimer);
		$('.callControlButton').delay(1000).fadeOut();
	})

// READY PEER

var peer = new Peer({
	key: 'phucphoenixdeptraiso1',
	host: 'localhost',
	port: 8000,
	path: '/peer',
});

// Socket 

var messageSocket = io('http://localhost:8000/message');

messageSocket.on('connect', function () {

	if (typeCall === "incall") {
		messageSocket.emit('calling', { from: user, to: callTo });
	}

	messageSocket.on('user-call-peer-id', (data) => {
		if (data.from === user && data.to === callTo && typeCall === "incall") {
			console.log('HEREEE');
			let peerID = data.peerID;
			getUserMedia({ audio: false, video: true }, (stream) => {
				localVideo.srcObject = stream;
				localVideo.play();
				var call = peer.call(peerID, stream);
				window.existingCall = call;

				call.on('stream', (remoteStream) => {
					remoteVideo.srcObject = remoteStream;
					remoteVideo.play();
					$('.callingScreen').hide();
					$('.remoteStream').show();
				})

			}, function (err) {
				console.log('Failed to get local stream', err);
			})

		}
	})

})

peer.on('open', function (id) {

	if (typeCall === "outcall") {
		messageSocket.emit('answer-call-peer-id', { from: callTo, to: user, peerID: id })
	}
	console.log('ID CỦA BẠN:', id)
});

peer.on('call', (call) => {
	getUserMedia({ audio: false, video: true }, (stream) => {
		window.existingCall = call
		call.answer(stream);

		localVideo.srcObject = stream;
		localVideo.play();

		call.on('stream', (remoteStream) => {
			remoteVideo.srcObject = remoteStream;
			remoteVideo.play();
			$('.callingScreen').hide();
			$('.remoteStream').show();
		})

	}, function (err) {
		console.log('Failed to get remote stream', err);
	})
})

peer.on('close', () => {
	console.log('CLOSED');
	$('.remoteStream').hide();
	$('.localStream').hide();
	$('.callControlButton').remove();
	$('.endCallControlButton').show();
	$('.callText').html('Cuộc Gọi Đã Kết Thúc !');
	$('.callingScreen').fadeIn(500);
	
})

peer.on('disconnected', () => {
	console.log('DISCONNECTED');
	$('.remoteStream').hide();
	$('.localStream').hide();
	$('.callControlButton').remove();
	$('.endCallControlButton').show();
	$('.callText').html('Cuộc Gọi Đã Kết Thúc !');
	$('.callingScreen').fadeIn(500);
	
})

$('.endCallButton').on('click', ()  => {
	window.existingCall.close();
	peer.destroy()
})