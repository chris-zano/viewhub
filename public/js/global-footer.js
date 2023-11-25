//const hover = document.getElementById("fit")//

//for ()
 //var icos =  document.getElementById("fit").addEventListener("mouseover",function(e){
    //e.target.style="none"
  var icons = document.querySelectorAll(".fit")
  icons.forEach(icon => {
     icon.addEventListener('mouseover',function(){
         //alert('mouse entered')
         //icon.classList.remove('fit')
         if (icon.id ==="wat"){
            icon.classList.add("wat")
         }
         if (icon.id ==="ig"){
            icon.classList.add("ig")
         }
         if (icon.id ==="twit"){
            icon.classList.add("twit")
         }
         if (icon.id ==="git"){
            icon.classList.add("git")
         }
         if (icon.id ==="ytb"){
            icon.classList.add("ytb")
         }
     })
  });

  //leaves
  icons.forEach(icon => {
    icon.addEventListener('mouseout',function(){
        //alert('mouse entered')
        //icon.classList.remove('fit')
        if (icon.id ==="wat"){
           icon.classList.remove("wat")
        }
        if (icon.id ==="ig"){
           icon.classList.remove("ig")
        }
        if (icon.id ==="twit"){
           icon.classList.remove("twit")
        }
        if (icon.id ==="git"){
           icon.classList.remove("git")
        }
        if (icon.id ==="ytb"){
           icon.classList.remove("ytb")
        }
    })
 });
//})
// var ytb = document.getElementById('ytb')
// ytb.onmouseover=function(){
//     ytb.style.color = '#d90222'
//     ytb.style.backgroundColor= 'white'
//     ytb.style.borderRadius='12px'
//     ytb.style.border='1px solid black'
//     ytb.style.border='none'
//     ytb.style.outline='none';
// } 





