"use strict"

const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            }
            else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
            }
            else {
                this.value = "";
            }
        });
    });
}

document.getElementById("get-order").addEventListener("submit", (e) => {
    e.preventDefault()
    let userdata = {}

    Object.values(e.target).forEach(item => item.tagName !== "BUTTON" ? userdata[item.name] = item.value : false)
    let phoneValid = /^\+\d{11}$|^\d{11}$/.test(userdata.phone)
    let nameValid = /^[a-zA-Z-а-яёА-ЯЁ]{3,}$/.test(userdata.name)

    if (!nameValid) {
        return alert("Слишком короткое имя")
    }

    if (!phoneValid) {
        return alert("Неверно указан мобильный телефон")
    }

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: "POST", headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(userdata)
    })
        .then(response => response.json())
        .then(json => alert(JSON.stringify(json)))
})

setInputFilter(document.getElementById("phoneInput"), function (value) {
    return /^\+\d*\.?\d*$|^\d*\.?\d*$/.test(value);
});

setInputFilter(document.getElementById("nameInput"), function (value) {
    return /^[a-zA-Z-а-яёА-ЯЁ]*$/.test(value);
});

const countdownElem = document.getElementById("countdown")

let timerID

function countdown(timer, counter) {

    let currentTime = new Date().getTime()
    let time = (currentTime - timer) / 60000
    let [hours, minutes, seconds] = counter.split(":")

    if (time >= 30) {
        localStorage.setItem("counter", `00:00:00`)
        countdownElem.innerText = `00:00:00`
        timerID && clearTimeout(timerID)
        return
    }

    if (!+hours && !+minutes && !+seconds) return

    if (!+seconds && +minutes) {
        minutes = `${+minutes - 1}`;
        seconds = `59`;
    } else {
        seconds = +seconds - 1
    }

    +minutes < 10 ? minutes = "0" + +minutes : minutes;
    +seconds < 10 ? seconds = "0" + +seconds : seconds;

    localStorage.setItem("counter", `00:${minutes}:${seconds}`)
    countdownElem.innerText = `00:${minutes}:${seconds}`

    timerID && clearTimeout(timerID)
    timerID = setTimeout(() => countdown(timer, `00:${minutes}:${seconds}`), 1000)
}

const counter = localStorage.getItem("counter")
const timer = localStorage.getItem("timer")

if (timer && counter) {
    countdown(+timer, counter)
} else {
    const timerStart = new Date().getTime()
    localStorage.setItem("timer", timerStart)
    localStorage.setItem("counter", countdownElem.textContent)
    countdown(timerStart, countdownElem.textContent)

}

