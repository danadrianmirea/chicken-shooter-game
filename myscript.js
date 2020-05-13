// shooting game 

// randomly appearing targets
// moving targets
// 5 shots before reloading
// 1 minute countown for each level





// elements
let img_src         = 'morhoon1.gif';
let img_size        = 140;
let set_timer       = 15;                                     // duration of the game in seconds
let width           = 900;
let height          = 900;
let smallSizeChance = 0.5;
let difficulty      = 5;                                      // 1 - 9, bigger = harder
let avg_targets     = 7 + difficulty;                                      // average targets count - difficulty
let playground      = document.querySelector('#playground');
let timer           = document.querySelector('#timer');
let points          = document.querySelector('#points');
let stats           = document.querySelector('.stats')
let audio           = document.querySelector('.shoot');
let shells          = 6;
let empty_sound     = document.querySelector('.empty')

localStorage.setItem('total', 0);


// Initialization=================================
function startGame() {
    window.focus();
    countdown();
    targetInterval();
    document.querySelector('#start').style.display = 'none';
	playground.addEventListener('mousedown', function(e) {
		shoot(e);
	});
	ammoReloader();
}
// Initialization=================================




function shoot(e) {
	if(e.which === 3) {
		e.preventDefault;
		return false;
	}

    let shells = document.querySelectorAll('.shell.visible');
    if(shells.length > 0) {
        shells[0].classList = 'shell hidden';
        shootSound();
    } else {
        // empty sound
        empty_sound.currentTime = 0;
        empty_sound.play();
    }

}


function hitTarget(e) {
    if(e.which === 3) {
		e.preventDefault;
		return false;
	}
    // check if there is ammo
    let shells = document.querySelectorAll('.shell.visible');
    if(shells.length > 0) {
		let target_id = e.target.getAttribute('data-id');
		let size = e.target.width;
		addPoints(size);
		hitEffect(target_id);    
    }
}

function reloadAmmo() {
	let shells = document.querySelectorAll('img.shell');

	// show shells
	shells.forEach(function(shell) {
		shell.classList.remove('hidden');
		shell.classList.add('visible');
	});

	// substract total
    localStorage.total = localStorage.total - 10;
    if(localStorage.total < 0) {
        localStorage.total = 0;
    }
	points.innerHTML = localStorage.total;

	// play reload sound
	document.querySelector('#reload').currentTime = 0;
	document.querySelector('#reload').play();
}

function ammoReloader() {
	playground.addEventListener('mousedown', function(e) {
		e.preventDefault();
		if(e.which === 3) {
			reloadAmmo();
		}
	});

	playground.addEventListener('contextmenu', function(e) {
		e.preventDefault();
	});

}



////////////////////////////////////////////

// visual effect target hit
function hitEffect(target_id) {

        removeTarget(target_id); 
    
 
}


//add points
function addPoints(size) {

    if(size === 80) {
        localStorage.total = parseInt(localStorage.total) + 10
    } else {
        localStorage.total = parseInt(localStorage.total) + 5
    }

    points.innerHTML = localStorage.total;

}

// Countdown timer
function countdown() {
    
    // window.onload = function() {
        setInterval(function() {
            set_timer--;
            timer.innerHTML = set_timer;

            if(set_timer === 0) {
                endGame();
            }

        }, 1000);   
    // }
}

// Hide target
function removeTarget(target_id) {
    let target_remove = document.querySelector('[data-id="' + target_id + '"]');
    // setTimeout(function() {
        target_remove.remove();
    // }, 500);
}





// Show target on a random place
function addTarget() {

    let target_id = Date.now() + Math.floor(Math.random() * 100) + 1;
    let elevation;
    let start_from;

    //create target
    let target = document.createElement('img');
    target.setAttribute('src', img_src);
    target.setAttribute('data-id', target_id);
    target.classList = 'target';
    target.style.maxWidth = img_size + 'px';
    target.style.maxHeight = img_size + 'px';

    target.addEventListener('mousedown', function(e) {
        hitTarget(e);
    });


    // Set elevation
    elevation  = Math.random() * (height - 300);
    target.style.top = elevation + 'px';

    // Place target at starting position
    if(Math.random() > 0.5) {
        // Fly in from left
        start_from = 'left';
        target.style.left = '-150px';
        target.style.transform = 'scaleX(-1)';

    } else {
        start_from = 'right';
        // fly in from right
        target.style.right = '-150px';
    }

    // Set size
    if(Math.random() > smallSizeChance) {
        // Set small size
        target.style.width = '80px';
        target.style.height = '80px';
    } 

    playground.append(target)


    // Move target
    let speed          = 12 - difficulty;                  // miliseconds interval
    let index          = 0;
    let breaking_point = Math.floor(Math.random() * 900);

    if(Math.random() > 0.5) {
        var vertical = 'asc';
    } else {
        var vertical = 'desc';
    }

       setInterval(function() {
        

        // Set left or right offset and change it for each interval
        if(start_from == 'left') {
            let old_position = target.style.left;
            let old_px = old_position.slice(0,-2);
            let new_px = parseInt(old_px) + 1;
            target.style.left = new_px + 'px';

        } else {
            let old_position = target.style.right;
            let old_px = old_position.slice(0,-2);
            let new_px = parseInt(old_px) + 1;
            target.style.right = new_px + 'px';
        }



        // Break point for change in asceding or descending
        if(index == breaking_point) {

            if(vertical == 'asc') {
                vertical = 'desc';
            } else {
                vertical = 'asc';
            }
        }




        // Change elevation
        index++;
        let old_elevation = target.style.top.slice(0,-2);

        if(index % 10 === 0) {
            if(vertical == 'asc') {
                target.style.top = parseFloat(old_elevation) - 1 + 'px';
                
            } else {
                target.style.top = parseFloat(old_elevation) + 1 + 'px';
            }
        }

        
        
        
        // Remove target when off playground
        if(parseInt(target.style.left.slice(0,-2)) > 900 || parseInt(target.style.right.slice(0,-2)) > 900) {
            target.remove();
        }
    }, speed);






   
}


// Add targets at regular interval
function targetInterval() {
    // At start place multiple targets at once
    start_targets = Math.floor(Math.random() * 3) + 1;
    
    for(i = 0; i < start_targets; i++) {
        addTarget();
    }

    // Regularly add targets
    showTargetsRegularly = setInterval(function() {

        // Get number of current targets
        let target_num = document.querySelectorAll('.target').length - 1;
        
        // Add a reasonable amount of targets if nescessary
        let targets_add = avg_targets - target_num;
        if(targets_add >= 3) {
            // add one or two
            if(Math.random() > 0.5) {
                addTarget();
                addTarget();
            } else {
                addTarget();
            }
        } else {
            // don't add anything
        }


    }, 800)

}








// Endgame
function endGame() {
  
    // Remove all 
    let targets = document.querySelectorAll('.target');

    targets.forEach(function(target) {
        target.remove();
    });

    // Cancel interval for showing targets
    clearInterval(showTargetsRegularly);

    // show stats
    stats.setAttribute('style', 'display: block');

    document.querySelector('.points').remove();
    timer.remove();
    document.querySelector('#final-total').innerHTML = points.innerHTML;
    
    // Record highest score
    if(localStorage.getItem('highest') === null) {
        localStorage.setItem('highest', localStorage.total)
 
    } else if (parseInt(localStorage.total) > parseInt(localStorage.highest)) {
        localStorage.highest = localStorage.total;
    }

    document.querySelector('#highest').innerHTML = localStorage.highest;

}

function restart() {
    location.reload();
}

function shootSound() {
    audio.currentTime = 0;
    audio.play();
}











////////////////////////////////////////////
// Event listeners

document.querySelector('#restart').addEventListener('click', restart);
document.querySelector('#start').addEventListener('click', startGame);


