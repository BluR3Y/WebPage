var loaderAnimation = new function() {
    let lastState = 0;
    let bar = document.getElementsByClassName('bar')[0];
    let percentage = document.getElementById('percentage');
    let loader = document.getElementsByClassName('loading-page')[0];
    let contentCont = document.getElementsByClassName('contentCont')[0];
    let gathering = [
        { marker: 10, label: 'Resume' },
        { marker: 20, label: 'My Bio' },
        { marker: 50, label: 'Work Experience' },
        { marker: 75, label: 'Academic Prowess' },
        { marker: 90, label: 'Contact Info' }
    ];

    this.modify = function(limit, rate) {
        let primaryColor = getComputedStyle(document.querySelector(':root')).getPropertyValue('--primary-color');
        let secondaryColor = getComputedStyle(document.querySelector(':root')).getPropertyValue('--secondary-color');

        return new Promise((resolve,reject) => {
            setInterval(() => {
                if(lastState >= limit) {resolve(); return;}
        
                let gatherItem = gathering.find(item => item.marker === lastState);
                if(gatherItem) {
                    addGatherItem(gatherItem);
                }

                lastState += 1;
                percentage.innerHTML = `${lastState} %`;
                bar.style.backgroundImage = `linear-gradient(to right, ${primaryColor} ${lastState}%, ${secondaryColor} ${lastState}%)`;
            }, rate);
        })
    }

    this.pause = function(duration) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, duration);
        })
    }

    this.hide = function(duration) {
        contentCont.style.animation = `fadeAway ${duration}s linear`;
        loader.style.animation = `fadeOut ${duration+0.3}s linear`;
        setTimeout(() => {
            loader.style.display = 'none';
        }, `${duration}000`);
    }

    this.start = function() {
        this.pause(800)
        .then(() => this.modify(36, 50)
        .then(() => this.pause(1400)
        .then(() => this.modify(65, 50)
        .then(() => this.modify(85, 90)
        .then(() => this.modify(100, 50)
        .then(() => this.hide(1)))))))
    }
}

function addGatherItem(itemInfo) {
    let gatherCont = document.getElementsByClassName('gatheredCont')[0];

    var item = document.createElement('h1');
    item.setAttribute('class', 'gatheredItem');
    item.style.left = `${itemInfo.marker}%`;
    
    var plus = document.createElement('i');
    plus.setAttribute('class','fa-solid fa-plus');
    item.appendChild(plus);

    var textEl = document.createTextNode(itemInfo.label);
    item.appendChild(textEl);

    gatherCont.appendChild(item);
}

window.addEventListener('load', function() {
    loaderAnimation.start();
})