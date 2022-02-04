storageLocal = window.localStorage;
var lastScrollTop=0;

function desktopMode(){
    var pageWidth = window.innerWidth;
    var pageHeight = window.innerHeight;
    var minWidth = 601;
    var minHeight = 501;
    if(pageWidth >= minWidth && pageHeight >= minHeight){
        return true;
    }
    return false;
}

function displayHiddenNav(){
    var hiddenNavCont = document.getElementsByClassName("hiddenNavCont")[0];
    var navIsOpen = (()=>{
        if(hiddenNavCont.classList.contains("hiddenNavShow")){
            return true;
        }
        return false;
    })();

    if(navIsOpen === true){
        hiddenNavCont.classList.remove("hiddenNavShow");
        disableBlur();
    }else{
        hiddenNavCont.classList.add("hiddenNavShow");
        enableBlur();
    }
}

function displayHiddenBtn(){
    var contentScroll = document.getElementsByClassName("mainContent")[0].scrollTop;
    var hiddenNavBtn = document.getElementsByClassName("hiddenNavBtn")[0];
    if(contentScroll > lastScrollTop){
        hiddenNavBtn.classList.remove("hiddenNavBtnShow");
    }else{
        hiddenNavBtn.classList.add("hiddenNavBtnShow");
    }
    lastScrollTop=contentScroll;
}

function disableBlur(){
    var blur = document.getElementsByClassName("pageBlur")[0];
    blur.style.display = "none";
}
function enableBlur(){
    var blur = document.getElementsByClassName("pageBlur")[0];
    blur.style.display = "block";
}

function scrollPage(slideAmount){
    var contentPage = document.getElementsByClassName("mainContent")[0];
    var pageHeight = contentPage.scrollHeight - contentPage.clientHeight;
    var pixelsPerScroller = pageHeight/1000;
    var scrollAmount = pixelsPerScroller * slideAmount;

    contentPage.scrollTo(0,scrollAmount);
}

function updateSlider(){

    var contentPage = document.getElementsByClassName("mainContent")[0];
    var navSlider = document.getElementById("sideNav_Slider");
    var scrollLimit = contentPage.scrollHeight - contentPage.clientHeight;
    var scrollAmount = contentPage.scrollTop;

    var scrollCover = scrollAmount / scrollLimit;
    var slideAmount = 1000 * scrollCover;
    navSlider.value = slideAmount;

}

function moveSliderDown(){
    var navSlider = document.getElementById("sideNav_Slider");
    var contentPage = document.getElementsByClassName("mainContent")[0];
    var pageHeight = contentPage.scrollHeight - contentPage.clientHeight;
    var pixelsPerStep = pageHeight/100;
    var scrollAmount = contentPage.scrollTop;
    var slideSteps = 1000/100;

    if(navSlider.value < 1000){
        navSlider.value = parseInt(navSlider.value) + slideSteps;
        
        contentPage.scrollTo(0, scrollAmount + pixelsPerStep);
    }
}

function moveSliderUp(){
    var navSlider = document.getElementById("sideNav_Slider");
    var contentPage = document.getElementsByClassName("mainContent")[0];
    var pageHeight = contentPage.scrollHeight - contentPage.clientHeight;
    var pixelsPerStep = pageHeight/100;
    var scrollAmount = contentPage.scrollTop;
    var slideSteps = 1000/100;

    if(navSlider.value > 0){
        navSlider.value = parseInt(navSlider.value) - slideSteps;

        contentPage.scrollTo(0, scrollAmount - pixelsPerStep);
    }
}

function moveSlider(event){
    if(event.deltaY > 0){
        moveSliderDown();
    }else{
        moveSliderUp();
    }
}

function gotoSection(sectionNum){
    var sideBarSections = document.getElementsByClassName("sectionItem");

    var pageSections = document.getElementsByClassName("sectionContainer");
    pageSections[sectionNum].scrollIntoView({behavior: "smooth"});
}

function loadtoSection(sectionNum){
    var sideBarSections = document.getElementsByClassName("sectionItem");
    sideBarSections[0].classList.remove("selectedSectionItem");
    
    var pageSections = document.getElementsByClassName("sectionContainer");
    pageSections[sectionNum].scrollIntoView({behavior: "instant"});
}

function updateSelectedSection(){
    var mainContent = document.getElementsByClassName("mainContent")[0];
    var sectionContainers = document.getElementsByClassName("sectionContainer");
    var sideBarSections = document.getElementsByClassName("sectionItem");

    var scrollAmount = mainContent.scrollTop;
    var bottomView = scrollAmount + mainContent.clientHeight;

    var initialSection;

    for(var i=0; i < sectionContainers.length; i++){
        var sectionTop = function(){
            var sumHeight = 0;
            for(var j=i-1; j >=0; j--){
                sumHeight += sectionContainers[j].clientHeight;
            }
            return sumHeight;
        }();
        var sectionBottom = sectionTop + sectionContainers[i].clientHeight - 1;
        if((sectionTop >= scrollAmount && sectionTop < bottomView) || (sectionBottom > scrollAmount && sectionBottom < bottomView) || (sectionTop <= scrollAmount && bottomView <= sectionBottom)){
            sideBarSections[i].classList.add("selectedSectionItem");
            if(initialSection === undefined || i < initialSection){
                initialSection = i;
            }
        }else{
            sideBarSections[i].classList.remove("selectedSectionItem");
        }
    }
    if(localStorage.getItem('lastSection') != initialSection){
        localStorage.setItem('lastSection',initialSection);
    }

}

function adjustSideNavSectHeight(){
    var contentPage = document.getElementsByClassName("mainContent")[0];
    var pageHeight = contentPage.scrollHeight - contentPage.clientHeight;
    var pageSections = document.getElementsByClassName("sectionContainer");
    var sideBarSectionCont = document.getElementsByClassName("pageSection")[0];
    var sideBarHeight = sideBarSectionCont.clientHeight;
    var sideBarSections = document.getElementsByClassName("sectionItem");

    for(var i=0; i < pageSections.length; i++){
        var sectionPageHeight = pageSections[i].clientHeight/pageHeight;
        var sectionSideBarHeight = sectionPageHeight * sideBarHeight;
        sideBarSections[i].style.height = sectionSideBarHeight+"px";

    }

    var sliderCont = document.getElementsByClassName("slider")[0];
    var contHeight = window.innerHeight-70;
    sliderCont.style.width = `${contHeight}px`;

    var style = document.querySelector('[data="sideSlider"]');
    var sliderHeight = (window.innerHeight / contentPage.scrollHeight) * sideBarHeight;
    style.innerHTML = `.slider::-webkit-slider-thumb {width: ${sliderHeight}px;}`;
}


var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = 1000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 150 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }

    if(this.toRotate[i] == this.toRotate[this.toRotate.length-1] && this.isDeleting){
        return;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

function gotoSkill(selectedSkill){
    var skillIndicator = document.getElementsByClassName("skillIndicator")[0];
    var skillIndicatorCont = document.getElementsByClassName("skillIndicatorCont")[0];
    var skillTitles = document.getElementsByClassName("skillTitleItem");
    var heightPerTitle = skillIndicatorCont.clientHeight / skillTitles.length;
    var translateAmount = heightPerTitle * selectedSkill;

    skillIndicator.style.transform = `translateY(${translateAmount}px)`;
    skillIndicator.style.transition = "all 0.2s linear";

    var currentSelectedSkill = function(){
        for(var i=0; i < skillTitles.length; i++){
            if(skillTitles[i].classList.contains("selectedSkillTitle")){
                return i;
            }
        }
        return -1;
    }();

    skillTitles[currentSelectedSkill].classList.remove("selectedSkillTitle");
    skillTitles[selectedSkill].classList.add("selectedSkillTitle");

    var skillInfoItems = document.getElementsByClassName("skillInfoItem");
    skillInfoItems[currentSelectedSkill].style.display = "none";
    skillInfoItems[selectedSkill].style.display = "block";
}

function showName(){
    var elements = document.getElementsByClassName('myName');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
}

// var sectionTwoContent = [document.getElementsByClassName("mtInfo")[0]];
// var sectionThreeContent = [document.getElementsByClassName("mySkills")[0]];
// var sectionFourContent = [document.getElementsByClassName("projectContainer")[0],document.getElementsByClassName("projectContainer")[1],document.getElementsByClassName("projectContainer")[2]];
// var sectionFiveContent = [document.getElementsByClassName("educationWrapper")[0],document.getElementsByClassName("collegeWorkWrapper")[0],document.getElementsByClassName("collegeWorkWrapper")[1]];
// var sectionSixContent = [document.getElementsByClassName("messageMe")[0]];

function displaySectionOneContent(){
    var greetingsContent = document.getElementsByClassName("greetings")[0];

    if(greetingsContent.style.opacity != "1"){
        var contentPage = document.getElementsByClassName("mainContent")[0];
        var pageBottom = contentPage.clientHeight;
        var greetingsInfo = greetingsContent.getBoundingClientRect();

        if((greetingsInfo.bottom - 100 >= 0) && (greetingsInfo.top <= 0)){
            greetingsContent.style.opacity = "1";
            greetingsContent.style.animation = "fadeInDown 1s ease";
            showName();
        }else if((greetingsInfo.top >= 0) && (greetingsInfo.bottom <= pageBottom)){
            greetingsContent.style.opacity = "1";
            greetingsContent.style.animation = "fadeInUp 1s ease";
            showName();
        }
    }
    
}

function displaySectionTwoContent(){
    var myInfo = document.getElementsByClassName("myInfo")[0];

    if(myInfo.style.opacity != "1"){
        var contentPage = document.getElementsByClassName("mainContent")[0];
        var pageBottom = contentPage.clientHeight;    
        var myInfoPosition = myInfo.getBoundingClientRect();

        if((myInfoPosition.top + 100 <= pageBottom) && (myInfoPosition.bottom >= pageBottom)){
            myInfo.style.opacity = "1";
            myInfo.style.animation = "fadeInUp 1s ease";
        }else if((myInfoPosition.bottom - 100 >= 0) && (myInfoPosition.top <= 0)){
            myInfo.style.opacity = "1";
            myInfo.style.animation = "fadeInDown 1s ease";
        }else if((myInfoPosition.top >= 0) && (myInfoPosition.bottom <= pageBottom)){
            myInfo.style.opacity = "1";
            myInfo.style.animation = "fadeInUp 1s ease";
        }
    }
}

function displaySectionThreeContent(){
    var mySkills = document.getElementsByClassName("mySkills")[0];

    if(mySkills.style.opacity != "1"){
        var contentPage = document.getElementsByClassName("mainContent")[0];
        var pageBottom = contentPage.clientHeight;
        var mySkillsPosition = mySkills.getBoundingClientRect();

        if((mySkillsPosition.top + 100 <= pageBottom) && (mySkillsPosition.bottom >= pageBottom)){
            mySkills.style.opacity = "1";
            mySkills.style.animation = "fadeInUp 1s ease";
        }else if((mySkillsPosition.bottom - 100 >= 0) && (mySkillsPosition.top <= 0)){
            mySkills.style.opacity = "1";
            mySkills.style.animation = "fadeInDown 1s ease";
        }else if((mySkillsPosition.top >= 0) && (mySkillsPosition.bottom <= pageBottom)){
            mySkills.style.opacity = "1";
            mySkills.style.animation = "fadeInUp 1s ease";
        }
    }
}

function displaySectionFourContent(){
    var projects = document.getElementsByClassName("projectContainer");

    for(var i=0; i < projects.length; i++){
        var currentProject = projects[i];

        if(currentProject.style.opacity != "1"){
            var contentPage = document.getElementsByClassName("mainContent")[0];
            var pageBottom = contentPage.clientHeight;
            var currentProjectPosition = currentProject.getBoundingClientRect();

            if((currentProjectPosition.top + 100 <= pageBottom) && (currentProjectPosition.bottom >= pageBottom)){
                currentProject.style.opacity = "1";
                currentProject.style.animation = "fadeInUp 1s ease";
            }else if((currentProjectPosition.bottom - 100 >= 0) && (currentProjectPosition.top <= 0)){
                currentProject.style.opacity = "1";
                currentProject.style.animation = "fadeInDown 1s ease";
            }else if((currentProjectPosition.top >= 0) && (currentProjectPosition.bottom <= pageBottom)){
                currentProject.style.opacity = "1";
                currentProject.style.animation = "fadeInUp 1s ease";
            }
        }
    }
}

function displaySectionFiveContent(){
    var contentPage = document.getElementsByClassName("mainContent")[0];
    var pageBottom = contentPage.clientHeight;

    var myAwards = document.getElementsByClassName("educationWrapper")[0];
    var myMajor = document.getElementsByClassName("collegeWorkWrapper")[0];
    var myMinor = document.getElementsByClassName("collegeWorkWrapper")[1];

    if(myAwards.style.opacity != "1"){
        myAwardsPosition = myAwards.getBoundingClientRect();

        if((myAwardsPosition.top + 100 <= pageBottom) && (myAwardsPosition.bottom >= pageBottom)){
            myAwards.style.opacity = "1";
            myAwards.style.animation = "fadeInUp 1s ease";
        }else if((myAwardsPosition.bottom - 100 >= 0) && (myAwardsPosition.top <= 0)){
            myAwards.style.opacity = "1";
            myAwards.style.animation = "fadeInDown 1s ease";
        }else if((myAwardsPosition.top >= 0) && (myAwardsPosition.bottom <= pageBottom)){
            myAwards.style.opacity = "1";
            myAwards.style.animation = "fadeInUp 1s ease";
        }
    }
    if(myMajor.style.opacity != "1"){
        myMajorPosition = myMajor.getBoundingClientRect();

        if((myMajorPosition.top + 100 <= pageBottom) && (myMajorPosition.bottom >= pageBottom)){
            myMajor.style.opacity = "1";
            myMajor.style.animation = "fadeInUp 1s ease";
        }else if((myMajorPosition.bottom - 100 >= 0) && (myMajorPosition.top <= 0)){
            myMajor.style.opacity = "1";
            myMajor.style.animation = "fadeInDown 1s ease";
        }else if((myMajorPosition.top >= 0) && (myMajorPosition.bottom <= pageBottom)){
            myMajor.style.opacity = "1";
            myMajor.style.animation = "fadeInUp 1s ease";
        }
    }
    if(myMinor.style.opacity != "1"){
        myMinorPosition = myMinor.getBoundingClientRect();

        if((myMinorPosition.top + 100 <= pageBottom) && (myMinorPosition.bottom >= pageBottom)){
            myMinor.style.opacity = "1";
            myMinor.style.animation = "fadeInUp 1s ease";
        }else if((myMinorPosition.bottom - 100 >= 0) && (myMinorPosition.top <= 0)){
            myMinor.style.opacity = "1";
            myMinor.style.animation = "fadeInDown 1s ease";
        }else if((myMinorPosition.top >= 0) && (myMinorPosition.bottom <= pageBottom)){
            myMinor.style.opacity = "1";
            myMinor.style.animation = "fadeInUp 1s ease";
        }
    }
}

function displaySectionSixContent(){
    var messageMe = document.getElementsByClassName("messageMe")[0];

    if(messageMe.style.opacity != "1"){
        var contentPage = document.getElementsByClassName("mainContent")[0];
        var pageBottom = contentPage.clientHeight;
        messageMePosition = messageMe.getBoundingClientRect();

        if((messageMePosition.top + 100 <= pageBottom) && (messageMePosition.bottom >= pageBottom)){
            messageMe.style.opacity = "1";
            messageMe.style.animation = "fadeInUp 1s ease";
        }else if((messageMePosition.bottom - 100 >= 0) && (messageMePosition.top <= 0)){
            messageMe.style.opacity = "1";
            messageMe.style.animation = "fadeInDown 1s ease";
        }else if((messageMePosition.top >= 0) && (messageMePosition.bottom <= pageBottom)){
            messageMe.style.opacity = "1";
            messageMe.style.animation = "fadeInUp 1s ease";
        }
    }
}

function displayContent(){

    var selectedSections = (()=>{
        var mainContent = document.getElementsByClassName("mainContent")[0];
        var sectionContainers = document.getElementsByClassName("sectionContainer");
        var scrollAmount = mainContent.scrollTop;
        var bottomView = scrollAmount + mainContent.clientHeight;
        var sections = [];
        for(var i=0; i < sectionContainers.length; i++){
            var sectionTop = function(){
                var sumHeight = 0;
                for(var j=i-1; j >=0; j--){
                    sumHeight += sectionContainers[j].clientHeight;
                }
                return sumHeight;
            }();
            var sectionBottom = sectionTop + sectionContainers[i].clientHeight - 1;
            if((sectionTop >= scrollAmount && sectionTop < bottomView) || (sectionBottom > scrollAmount && sectionBottom < bottomView) || (sectionTop <= scrollAmount && bottomView <= sectionBottom)){
                sections.push(i);
            }
        }
        return sections;
    })();

    for(var i=0; i < selectedSections.length; i++){
        switch(selectedSections[i]){
            case 0:
                displaySectionOneContent();
                break;
            case 1:
                displaySectionTwoContent();
                break;
            case 2:
                displaySectionThreeContent();
                break;
            case 3:
                displaySectionFourContent();
                break;
            case 4:
                displaySectionFiveContent();
                break;
            case 5:
                displaySectionSixContent();
                break;
        }
    }
}

function submitMessage(){
    var messengerMessage = String(document.getElementsByClassName("userMessage")[0].value);

    window.location.href = `mailto:reyhector1234@gmail.com?subject=Saying Hello&body=${messengerMessage}%0D%0A%0D%0A`;
}

document.getElementsByClassName("mainContent")[0].addEventListener("scroll", function(){
    if(desktopMode()){
        updateSlider();
        updateSelectedSection();
    }else{
        displayHiddenBtn();
    }
    displayContent();
});

window.addEventListener("load",()=>{
    if(storageLocal.getItem('lastSection') != null && storageLocal.getItem('lastSection') != 0){
        loadtoSection(storageLocal.getItem('lastSection'));
    }
    if(desktopMode()){
        adjustSideNavSectHeight();
    }else{
        document.getElementsByClassName("hiddenNavBtn")[0].classList.add("hiddenNavBtnShow");
    }
    displayContent();
});

window.addEventListener("resize", ()=>{
    if(desktopMode()){
        adjustSideNavSectHeight();
        updateSelectedSection();
        updateSlider();
    }else{
        document.getElementsByClassName("hiddenNavBtn")[0].classList.add("hiddenNavBtnShow");
    }
});