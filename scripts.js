
const btn = document.querySelectorAll("button");
const screen = document.querySelector(".screen");

let objArr = []

let newText = false;

function removeFromArray(str) {


    if (objArr.length === 0)
        return;


    if (str === "clear") {
        objArr = [];
    }
    else if (str === "delete") {

        if (newText)
            objArr = [];

        else if (objArr[objArr.length - 1].id === "number") {

            if (objArr[objArr.length - 1].content.length === 1)
                objArr.pop();
            else
                objArr[objArr.length - 1].content = objArr[objArr.length - 1].content.slice(0, -1);
        }
        else if (objArr[objArr.length - 1].id === "operation") {

            objArr.pop();
        }
        else {
            objArr = [];
        }
    }

}

function addNumToArray(str) {

    if (newText) {
        objArr = [];
        newText = false;
    }

    if (objArr.length === 0) {

        objArr.push({
            content: str,
            id: "number"
        });

    }
    else {

        if (objArr[objArr.length - 1].id === "number") {

            objArr[objArr.length - 1].content += str;
        }
        else if (objArr[objArr.length - 1].id === "operation") {

            objArr.push({
                content: str,
                id: "number"
            });
        }
    }
}

function addOppToArray(str) {

    if (newText) {
        newText = false;
    }
    switch (str) {
        case "add":
            objArr.push({
                content: "+",
                id: "operation"
            }); break;
        case "subtract":
            objArr.push({
                content: "-",
                id: "operation"
            }); break;
        case "multiply":
            objArr.push({
                content: "×",
                id: "operation"
            }); break;
        case "divide":
            objArr.push({
                content: "÷",
                id: "operation"
            }); break;
        case "power":
            objArr.push({
                content: "^",
                id: "operation"
            }); break;
        default: break;
    }
}

function arrayToScreen() {

    screen.textContent = objArr.reduce((total, item) => total + item.content , "");
    if (objArr[0] && objArr[0].id === "error")
        objArr.pop();
}

function checkSyntax() {

    if (objArr.length === 0) {
        return false;
    }
    if (objArr[0].id === "operation" && (objArr[0].content === "÷" || objArr[0].content === "×" || objArr[0].content === "^")) {
        return false;
    }
    if (objArr[objArr.length - 1].id === "operation") {
        return false;
    }


    return true;
}

function cleanUpOperations() {

    if (!checkSyntax()) {
        return false;
    }

    for (let i = 0; i < objArr.length;) {

        if (objArr[i].id === "operation") {

            if (objArr[i + 1] && objArr[i + 1].id === "number") {
                i++;
                continue;
            }
            else if (objArr[i + 1] && objArr[i + 1].id === "operation" && (objArr[i + 1].content === "×" || objArr[i + 1].content === "÷" || objArr[i + 1].content === "^")) {
                return false;
            }
            else if (objArr[i].content === "+" || objArr[i].content === "-" ) {

                if (objArr[i].content === objArr[i + 1].content) {
                    // ++ or --
                    objArr.splice(i, 2);
                    objArr.splice(i, 0, {
                        content: "+",
                        id: "operation"
                    });

                }
                else if (objArr[i].content !== objArr[i + 1].content) {
                    //+- or -+
                    objArr.splice(i, 2);
                    objArr.splice(i, 0, {
                        content: "-",
                        id: "operation"
                    });
                }

            }
            else if (objArr[i].content === "×" || objArr[i].content === "÷" || objArr[i].content === "^") {

                if (objArr[i + 1] && objArr[i + 1].content === "+") {

                    objArr.splice(i + 1, 1);
                }
                else if (objArr[i + 1] && objArr[i + 1].content === "-") {
                    i++;
                }
            }
        }
        else {
            i++;
        }
    }


    if (objArr[0].content === "+") {
        objArr.splice(0, 1);
    }
    else if (objArr[0].content === "-") {
        if (objArr.length > 1) {
            objArr.splice(0, 1);
            objArr[0].content = String(-Number(objArr[0].content));

        }

    }


    return true;

}

function doOperation(lhs, rhs, type) {



    lhs = Number(lhs.content);
    rhs = Number(rhs.content);

    if (rhs === 0 && type === "÷" || lhs === 0 && rhs === 0 && type === "^") {
        objArr = [];
        return {
            content: "Math Error",
            id: "error"
        };
    }
    let ans = 0;
    switch (type) {
        case "+": ans = lhs + rhs; break;
        case "-": ans = lhs - rhs; break;
        case "×": ans = lhs * rhs; break;
        case "÷": ans = lhs / rhs; break;
        case "^": ans = lhs ** rhs; break;
        default: break;
    }
    ans = Number(ans.toFixed(10));
    return {
        content: String(ans),
        id: "number"
    };
}
function loopForPow() {

    //  loop 1 for ^
    for (let i = 0; i < objArr.length && objArr[i].id !== "error" && objArr.length > 1;) {



        if (objArr[i].id === "number" && i !== objArr.length - 1) {

            let lhs, rhs, type;
            lhs = objArr[i];
            type = objArr[i + 1].content;
            if (type === "^") {

                if (objArr[i + 2].id === "number") { }
                else if (objArr[i + 2].id === "operation" && objArr[i + 2].content === "-") {
                    objArr.splice(i + 2, 1);

                    objArr[i + 2].content = String(-Number(objArr[i + 2].content));//next obj now 
                }
                rhs = objArr[i + 2];

                const ansObj = doOperation(lhs, rhs, type);
                objArr.splice(i, 3);
                objArr.splice(i, 0, ansObj);
            }
            else {
                i++;
            }

        }
        else {
            i++;
        }
    }
}
function loopForMulDiv() {

    //  loop 2 for × and ÷
    for (let i = 0; i < objArr.length && objArr[i].id !== "error" && objArr.length > 1;) {



        if (objArr[i].id === "number" && i !== objArr.length - 1) {

            let lhs, rhs, type;
            lhs = objArr[i];
            type = objArr[i + 1].content;
            if (type === "×" || type === "÷") {

                if (objArr[i + 2].id === "number") { }
                else if (objArr[i + 2].id === "operation" && objArr[i + 2].content === "-") {
                    objArr.splice(i + 2, 1);

                    objArr[i + 2].content = String(-Number(objArr[i + 2].content));//next obj now 
                }
                rhs = objArr[i + 2];

                const ansObj = doOperation(lhs, rhs, type);
                objArr.splice(i, 3);
                objArr.splice(i, 0, ansObj);
            }
            else {
                i++;
            }

        }
        else {
            i++;
        }
    }
}
function loopForAddSub() {

    //  loop 3 for + and -
    for (let i = 0; i < objArr.length && objArr[i].id !== "error" && objArr.length > 1;) {


        if (objArr[i].id === "number") {
            let lhs, rhs, type;
            lhs = objArr[i];
            type = objArr[i + 1].content;
            if (objArr[i + 2].id === "number") { }
            else if (objArr[i + 2].id === "operation" && objArr[i + 2].content === "-") {
                objArr.splice(i + 2, 1);

                objArr[i + 2].content = String(-Number(objArr[i + 2].content));//next obj now 
            }
            rhs = objArr[i + 2];

            const ansObj = doOperation(lhs, rhs, type);
            objArr.splice(i, 3);
            objArr.splice(i, 0, ansObj);
        }
        else {
            i++;
        }
    }
}
function Calculate() {



    if (cleanUpOperations()) {

        if (objArr.length === 0)
        {
            return
        }
        if (objArr.length === 1)
        {
            // have to be number
            objArr[0].content = String(Number(objArr[0].content));
            return
        }

        loopForPow();
        loopForMulDiv();
        loopForAddSub();

    }
    else {
        objArr = [];
        objArr.push({
            content: "Syntax Error",
            id: "error"
        });
    }
}


function makeDecimal() {
    if(objArr.length === 0){
        addNumToArray("0.");
    }
    else if(objArr[objArr.length-1].id === "operation"){
        addNumToArray("0.");
    }
    else if(objArr[objArr.length-1].id === "number"){

        if(objArr[objArr.length-1].content.includes(".")){
            return;
        }
        else{
            objArr[objArr.length-1].content +=".";
        }
    }
}



btn.forEach((item) => {

    item.addEventListener("click", (event) => {

        const b = event.currentTarget;
        if (b.className === "number") {
            addNumToArray(event.target.id);
        }
        else if (b.className === "operation") {
            addOppToArray(event.target.id);
        }
        else if (b.id === "clear" || event.target.id === "delete") {
            removeFromArray(event.target.id);
        }
        else if (b.id === ".") {
            makeDecimal();
        }
        else if (b.id === "equal") {
            Calculate();
            newText = true;
        }

        arrayToScreen();


    });
});

