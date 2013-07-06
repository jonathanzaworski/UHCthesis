module.exports = randomizer;

function randomizer() {
	var lettersUrl = ['/a','/b','/c','/d','/e'];
	var numbersUrl = ['/1','/2','/3','/4','/5'];
	var randomUrl = lettersUrl[Math.floor(Math.random()*5)] + numbersUrl[Math.floor(Math.random()*5)];
	return randomUrl

}


