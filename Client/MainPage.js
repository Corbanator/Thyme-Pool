async function makeRoom(){
    const response = await fetch("http://localhost:8080/Room",
    {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body:`{
            "user":"7"
        }`
    });
    response.json().then(data =>{
        var code = data.Code;
        joinRoom(code);
    });
}

async function joinRoom(code){
    location.assign("http://localhost:8080/Room/" + code);
}