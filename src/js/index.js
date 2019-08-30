import 'bootstrap';

import '../scss/index.scss';
$(function(){
  $('#alert').click(() => {
    alert('jQuery works!');
    $("#loading").load("../routes/tempalte.html")
  });
  $("#clickMe").click(()=>{
    console.log(11111)
    alert("xxxxxxxxxxx")
  })
})

function ClickMe(){
  alert("1234")
}

const clickMeOne= ()=>{
 
}

// Your jQuery code
