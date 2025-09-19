
const btn = document.querySelectorAll("button");
const screen = document.querySelector(".screen");


function enterToScreen(int){

    screen.textContent +=int;

}

function removeFromScreen(str){

    if(str === "clear"){
        screen.textContent = "";
    }
    else if(str ==="delete"){
        screen.textContent = screen.textContent.slice(0,-1);
    }

}

btn.forEach((item)=>{

    item.addEventListener("click",(event)=>{

        if(event.target.className ==="number")
        {
            enterToScreen(+item.id);
        }
        else if(event.target.id ==="clear" || event.target.id ==="delete")
        {
            removeFromScreen(event.target.id);
        }
    });
});








