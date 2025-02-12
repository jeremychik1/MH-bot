function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

function click(node){
  	triggerMouseEvent (node, "mouseover");
    triggerMouseEvent (node, "mousedown");
    triggerMouseEvent (node, "mouseup");
    triggerMouseEvent (node, "click");
}

function typeText(node, text) {
	node.value = "";
	for (let char of text) {
		node.value += char;
		node.dispatchEvent(new Event("input", { bubbles: true }));
		node.dispatchEvent(new KeyboardEvent("keydown", { key: char }));
		node.dispatchEvent(new KeyboardEvent("keypress", { key: char }));
		node.dispatchEvent(new KeyboardEvent("keyup", { key: char }));
	}
}

function go(){
    var timer = document.getElementsByClassName("huntersHornView__timerState huntersHornView__timerState--type-countdown huntersHornView__countdown")[0].innerHTML
    document.title = "MouseHunt | " + timer
    if (document.getElementsByClassName("huntersHornMessageView__text").length > 0 && document.getElementsByClassName("huntersHornMessageView__text")[0].innerHTML == "You must claim a King's Reward before the hunt can continue."){
        document.title = "King's Reward!";
        setTimeout(function(){ krstart(); },1000);
    }
    else if (timer.split(":")[0] == 0 && timer.split(":")[1] < 2){
        setTimeout(function(){ horn(); },(3000 + Math.random() * 1000));
    }
    else{
        setTimeout(function(){ go(); },1000);
    }
}

function horn(){
    var targetNode = document.querySelector ("a[href*='https://www.mousehuntgame.com/turn.php']");
    // Simulate a natural mouse-click sequence.
    click(targetNode)
    setTimeout(function(){ go(); },2000);
}

function krstart(){
	// click claim
	var targetNode = document.getElementsByClassName('huntersHornMessageView__action')[0];
	click(targetNode);
	
	// delay
	setTimeout(function(){ krinput(); },2000);
	
}

function krinput(){
	var pic = document.getElementsByClassName('puzzleView__image')[0].firstChild.src;
	var input = document.getElementsByClassName('puzzleView__code')[0]
	
	import("https://esm.sh/tesseract.js").then(Tesseract => {
		function recognizeText() {
			Tesseract.recognize(pic, "eng").then(({ data }) => {
				const cleanText = data.text.replace(/[^a-zA-Z0-9]/g, "");
				if (cleanText.length >= 5) {
					typeText(input, cleanText.substring(0, 5).toLowerCase());
				} else {
					// Retry if not enough characters
					recognizeText();
				}
			});
		}
		recognizeText();
	});
	
	// delay and enter
	setTimeout(function(){ krgo(); },2000);
}
	
function krgo(){
	var targetNode = document.getElementsByClassName('puzzleView__solveButtonText puzzleView__solveButtonText--ready')[0];
	click(targetNode);
	
	// delay and refresh 
	setTimeout(function(){ location.reload(); },3000);
}

go()
