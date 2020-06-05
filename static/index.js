document.addEventListener('DOMContentLoaded', () => {

  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // Check User in Local Storage & Charge Modal
  if (!localStorage.getItem('User')){
    $('#newUserModal').modal({
      backdrop: 'static',
      keyboard: false
    })
    document.querySelector('#newUserButton').disabled = true;
  }else{
  //definir funcion de cargar Perfil
    load_profile();
  }

  //Modal Confirm New User
  document.querySelector('#newUserForm').onsubmit = () => {
      const newUserName = document.querySelector('#newUserName').value;
      localStorage.setItem('User',newUserName);
      $("#newUserModal").modal('hide');
      //Formatting Own Messages
      load_profile();
      // Stop form from submitting
      return false;
  };

  //Check Lenght of Username
  document.querySelector('#newUserName').onkeyup = () => {
    if (document.querySelector('#newUserName').value.length>2 && document.querySelector('#newUserName').value.length < 12) {
      document.querySelector('#newUserButton').disabled = false;
    }else{
      document.querySelector('#newUserButton').disabled = true;
    }
  };

  // Scrol at end chat window
  var div = document.getElementById("chatWindow");
  div.scrollTop = div.scrollHeight;

  // When connected, configure input
  socket.on('connect', () => {
    // Each button should emit a "submit vote" event
    document.querySelector('#newMessage').onsubmit = () => {      
      if (document.querySelector('#messageContent').value.length > 0){
        const newMessage = document.querySelector('#messageContent').value;
        const author= localStorage.getItem('User')
        socket.emit('submit message', {'newMessage': newMessage, 'author': author});
        // Clear input field
        document.querySelector('#messageContent').value = '';
      }
      // Stop form from submitting
      return false;
    }; 
  });

  // When a new vote is announced, add to the unordered list
  socket.on('announce message', data => {
      const li = document.createElement('li');
      li.innerHTML = `<h5>${data.newMessage[0]}_${data.newMessage[2]}:</h5><p>${data.newMessage[1]}</p>`;
      document.querySelector('#chat').append(li);
      document.querySelectorAll("li").forEach(li => {
        own_message(li);  
      });
      // Chat Window scroll botton
      div.scrollTop = div.scrollHeight;
      });

  socket.on('announce login', data => {
    const li = document.createElement('li');
    li.innerHTML = `<h5>${data.newLogin[0]} is connected now :${data.newLogin[1]}</h5>`;
    document.querySelector('#chat').append(li);
    document.querySelectorAll("li").forEach(li => {
      li.style.backgroundColor= "none";
      li.style.border= "none";
    });
    // Chat Window scroll botton
    div.scrollTop = div.scrollHeight;
    });
});

function load_profile() {
  document.querySelector('#userInBanner').innerHTML = localStorage.getItem("User");
  document.querySelectorAll("li").forEach(li => {
    own_message(li)
  });
}

function own_message (li) {
  if (li.innerHTML.includes(localStorage.User)){
    li.style.backgroundColor = "green";
    li.style.borderColor = "green";
    li.style.marginLeft = "auto";
  }
}