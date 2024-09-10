(async () => {
  console.log("All the code in an IIFE :blehhh:")
  function showNotification(message, color = "white", duration = 1000) {
    // console.log('Showing notification:', message);

    var notificationContainer = document.querySelector('.notification-container');
    var notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.color = color
    notificationContainer.appendChild(notification);

    setTimeout(function() {
      notification.style.opacity = 1;
      setTimeout(function() {
        notification.style.opacity = 0;
        setTimeout(function() {
          notificationContainer.removeChild(notification);
          // console.log('Notification removed:', message);
        }, 500);
      }, duration);
    }, 100);
  }
  showNotification("Welcome to 2 Minute Wordle!", "lime", 4000)


  async function game() {
    let startDate = new Date(2024, 5, 13);
    let lastMinutes = Math.abs(0 - Math.floor((new Date() - startDate) / (1000 * 60 * 2)));
    console.log(lastMinutes)

    document.getElementById("wordNum").textContent = lastMinutes

    let words = await fetch("words.txt")
    words = await words.text()
    words = words.split("\n")

    let word = words[lastMinutes % words.length].toUpperCase()
    // console.log(word)

    let keyboard = document.getElementById("keyboard")
    let rowsEl = document.getElementById("rows")

    keyboard.innerHTML = ""
    rowsEl.innerHTML = ""

    let curRow = 0
    let curLetter = 0

    var keyLetters = "QWERTYUIOPASDFGHJKLZXCVBNM"
    var keys = {}
    var rows = []



    Array.from(keyLetters).forEach((e) => {
      let temp = [document.createElement("span"), e, false]
      temp[0].classList.add("key")
      temp[0].innerHTML = e
      keys[e] = temp

      let clickedKey = () => {
          if (keys[temp[1]][2] == true) {
            showNotification("That letter is invalid!", "red", 2000)

            return
          }
          if (typeof (rows[curRow][1][curLetter]) == "undefined") {
            showNotification("No more space for letters!", "red", 2000)
            return
          }
          rows[curRow][1][curLetter][0].innerHTML = temp[1]
          rows[curRow][1][curLetter][1] = temp[1]

          rows[curRow][1][curLetter][0].classList.remove("letterSelected")
        
          curLetter++
        rows[curRow][1][curLetter][0].classList.add("letterSelected")

        }
      
      temp[0].onclick = clickedKey
      window.addEventListener("keydown", (e) =>{
        if(!e.repeat&&e.key.toUpperCase() == temp[1]){
          clickedKey()
        }
      })

      keyboard.appendChild(temp[0])
    })

    

    var curWord = ""
    const getCurWord = () => {
      curWord = ""
      for (let i = 0; i < 5; i++) {
        curWord += rows[curRow][1][i][1]
      }
      return curWord
    }

    function didntGetIt(){
      for (let i = 0; i < 5; i++) {
        rows[curRow][1][i][0].classList.add("bozo")
      }
    }

    let deleteKey = [document.createElement("span"), "Delete", false]
    deleteKey[0].classList.add("key")
    deleteKey[0].classList.add("fitContent")
    deleteKey[0].innerHTML = "Delete"
    keyboard.appendChild(deleteKey[0])

    let deletePress = () => {
      let a = false
        if (curLetter > 0) {
          if(typeof(rows[curRow][1][curLetter])=="undefined"){
            curLetter--
            a=true
          }
          rows[curRow][1][curLetter][0].classList.remove("letterSelected")
          if(a==false)curLetter--
          rows[curRow][1][curLetter][0].classList.add("letterSelected")
          rows[curRow][1][curLetter][0].innerHTML = ""
          rows[curRow][1][curLetter][1] = ""
        } else {
          showNotification("Cannot delete any characters!", "red", 1000)
        }
      }

    window.addEventListener("keydown",(e)=>{
      if(!e.repeat&&e.key=="Backspace"){
        deletePress()
      }
    })
    
    deleteKey[0].onclick = deletePress

    let enterKey = [document.createElement("span"), "Enter", false]
    enterKey[0].classList.add("key")
    enterKey[0].classList.add("fitContent")
    enterKey[0].innerHTML = "Enter"
    keyboard.appendChild(enterKey[0])

    let enterPress = () => {
        console.log(getCurWord())
      showNotification("That word isn't long enough!", "red", 1000)
      if(curWord.length != 5){
        return
      }
        if (!words.find(e => e.toUpperCase() == curWord)) {
          showNotification("That isn't in this game's dictionary.", "red", 2000)
          return
        }

        let correct = 0
        for (let i = 0; i < 5; i++) {
          let keyChar = rows[curRow][1][i][1]
          if (word.includes(keyChar)&&keyChar!="") {
            rows[curRow][1][i][0].classList.add("wrongSpot")
            if (word[i] == rows[curRow][1][i][1]) {
              correct++
              rows[curRow][1][i][0].classList.add("rightSpot")
            }

          } else {
            // This is commented out to disable used keys
            keys[rows[curRow][1][i][1]][0].classList.add("disabledKey")
            //keys[rows[curRow][1][i][1]][2] = true
          }

        }

        curLetter = 0
        curRow++

        if (correct == 5) {
          showNotification("You got the word guessed correctly!", "lime", 10000)
        }
        if(curRow>=6){
          didntGetIt()
          showNotification("The word was: "+word,"red",60*1000*5)  
        }
      }

    enterKey[0].onclick = enterPress
    window.addEventListener("keydown",(e)=>{
      if(!e.repeat&&e.key=="Enter"){
        enterPress()
      }
    })

    let giveupKey = [document.createElement("span"), "Give Up", false]
    giveupKey[0].classList.add("key")
    giveupKey[0].classList.add("fitContent")
    giveupKey[0].innerHTML = "Give up"
    keyboard.appendChild(giveupKey[0])

    giveupKey[0].onclick = ()=>{
      didntGetIt()
      curRow = 100;
      showNotification("The word was: "+word,"red",60*1000*5)


    }
    
    for (let i = 0; i < 6; i++) {
      let row = [document.createElement("div"), []]
      row[0].classList.add("row")
      for (let i = 0; i < 5; i++) {
        let temp = [document.createElement("span"), ""]
        temp[0].classList.add("letter")

        row[1].push(temp)
        row[0].appendChild(temp[0])
      }

      rows.push(row)
      rowsEl.appendChild(row[0])
    }


  }
  game()


})()