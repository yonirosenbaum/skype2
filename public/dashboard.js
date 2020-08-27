
console.log('script deferred')
const selectAllSearches = document.querySelectorAll('.addClickEvent')
const selectAllSearchesArray = [...selectAllSearches]
for(let i=0; i<selectAllSearchesArray.length; i++){
selectAllSearchesArray[i].addEventListener('click', e => handleUserAdd(e))
}
function handleUserAdd(e){
console.log('addededede')
if(!e.currentTarget.classList.contains('status4') && !e.currentTarget.classList.contains('status2')){
      console.log('line 183 clickeedd')
    
          var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/addfriend", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(`username=${iconWrapperArray[i]}&id=${document.body.id}`);
  xhttp.onreadystatechange = function() {
  console.log('xhr ready state change')
  //based on what is returned
if (xhttp.readyState === 4 && xhttp.response == 'user_added') {
  iconWrapperArray[i] += ' search__result_pending'
  iconWrapperArray[i].textContent = ''
  const icon = document.createElement('i')
  iconWrapperArray[i].appendChild(icon);
  icon.classList += 'fas fa-address-book';

}
}
      
    }}
