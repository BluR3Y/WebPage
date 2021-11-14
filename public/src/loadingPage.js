
function hideLoading(){
    var loadingPage = document.getElementsByClassName("loadingPage")[0];
    setTimeout(()=>{
        loadingPage.style.display = "none";
        showName();
    },6000);
}