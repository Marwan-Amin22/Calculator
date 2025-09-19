
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

        if (objArr[objArr.length - 1].id === "number") {

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

    if(newText)
    {
        objArr= [];
        newText = false;
    }

    if (objArr.length === 0) {

        objArr.push({
            content: str,
            id: "number",
            sign: "positive"
        });

    }
    else {

        if (objArr[objArr.length - 1].id === "number") {

            objArr[objArr.length - 1].content += str;
        }
        else if (objArr[objArr.length - 1].id === "operation") {

            objArr.push({
                content: str,
                id: "number",
                sign: "positive"
            });
        }
    }
}

function addOppToArray(str) {

    if(newText)
    {
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
                content: "power",
                id: "operation"
            }); break;
        default: break;
    }
}

function arrayToScreen() {

    screen.textContent = objArr.reduce((total, item) => total + item.content, "");
    if(objArr[0]&&objArr[0].id==="error")
        objArr.pop();
}

function checkSyntax() {

    if (objArr.length === 0) {
        return false;
    }
    if (objArr[0].id === "operation" && (objArr[0].content !== "+" || objArr[0].content !== "-")) {
        return false;
    }
    if (objArr[objArr.length - 1].id === "operation") {
        return false;
    }



    return true;
}

function cleanUpOperations() {


    for (let i = 0; i < objArr.length;) {

        if (objArr[i].id === "operation") {

            if (objArr[i + 1].id === "number") {
                i++;
                continue;
            }
            else if (objArr[i + 1].id === "operation" && (objArr[i + 1].content === "×" || objArr[i + 1].content === "÷")) {
                return false;
            }
            else if (objArr[i].content === "+" || objArr[i].content === "-") {

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
            else if (objArr[i].content === "×" || objArr[i].content === "÷") {

                if (objArr[i + 1].content === "+") {

                    objArr.splice(i + 1, 1);
                }
                else if (objArr[i + 1].content === "-") {
                    i++;
                }
            }
        }
        else {
            i++;
        }
    }




    return true;

}

function doOperation(lhs, rhs, type) {


    lhs = lhs.sign === "negative" ? -Number(lhs.content) : Number(lhs.content);
    rhs = rhs.sign === "negative" ? -Number(rhs.content) : Number(rhs.content);
    if (rhs === 0 && type === "÷") {
        objArr = [];
        return {
            content: "Division by zero",
            id: "error"
        };
    }
    let ans = 0;
    switch (type) {
        case "+": ans = lhs + rhs; break;
        case "-": ans = lhs - rhs; break;
        case "×": ans = lhs * rhs; break;
        case "÷": ans = lhs / rhs; break;
        default: break;
    }
    return {
        content: String(ans),
        id: "number",
        sign: "positive"
    };
}

function Calculate() {


    if (checkSyntax() && cleanUpOperations()) {

        if (objArr[0].content === "+") {
            objArr.splice(0, 1);
        }
        else if (objArr[0].content === "-") {
            if (objArr.length !== 1)
                objArr[1].sign = "negative";
        }

        if(objArr.length <2)
            return;

        for (let i = 0; i < objArr.length && objArr[i].id !== "error" && objArr.length>1;) {

            if (objArr[i].id === "number") {
                let lhs, rhs, type;
                lhs = objArr[i];
                type = objArr[i + 1].content;
                if (objArr[i + 2].id === "number") { }
                else if (objArr[i + 2].id === "operation" && objArr[i + 2].content === "-") {
                    objArr.splice(i + 2, 1);
                    objArr[i + 2].sign = "negative";//next obj now 
                }
                rhs = objArr[i + 2];

                const ansObj = doOperation(lhs, rhs, type);
                objArr.splice(i, 3);
                objArr.splice(i, 0, ansObj)

            }

        }

    }
    else {
        objArr = [];
        objArr.push({
            content: "Syntax Error",
            id: "error"
        });
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
            else if (b.id === "dot") {

            }
            else if (b.id === "equal") {
                Calculate();
                newText = true;
            }

            arrayToScreen();
            console.log(objArr.length);


        });
    });








