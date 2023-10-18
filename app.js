const app = require("http").createServer(response);
const fs = require("fs");
const io = require("socket.io")(app);
const usuarios = [];

app.listen(3000 || PORT);

console.log("Aplicação em execução");


function response(req, res) {
  let arquivo = " ";

  if (req.url == "/") {
    arquivo = __dirname + "/src/index.html";
  } else {
    arquivo = __dirname + req.url;
  }

  fs.readFile(arquivo, function (err, data) {
    if (err) {
      res.writeHead(404);
      return res.end("pagina ou arquivo nao encontrado !");
    }
    res.writeHead(200);
    res.end(data);
  });
}

io.on("connection", function (socket) {
  socket.on("entrar", function (apelido, callback) {
    if(apelido!=undefined && apelido !=""){
      if (!(apelido in usuarios)) {
        socket.apelido = apelido.toUpperCase();
        usuarios[apelido] = socket;
        io.sockets.emit("atualizar mensagens", "[ " + pegarDataAtual() + " ] " + socket.apelido + " acabou de entrar na sala");
        callback(true);
      } else callback(false);
    }
  });

  socket.on("enviar mensagem", function (mensagem_enviada, callback) {
    if(mensagem_enviada === ""){
      callback(false);
    }else{
      mensagem_enviada = "["+pegarDataAtual()+"]: - " + socket.apelido + " - : " + mensagem_enviada;
      io.sockets.emit("atualizar mensagens", mensagem_enviada);
      callback(true);
    }
  });
});

function pegarDataAtual() {
  let dataAtual = new Date();
  let dia = (dataAtual.getDate() < 10 ? "0" : "") + dataAtual.getDate();
  let mes =
    (dataAtual.getMonth() + 1 < 10 ? "0" : "") + (dataAtual.getMonth() + 1);
  let ano = dataAtual.getFullYear();
  let hora = (dataAtual.getHours() < 10 ? "0" : "") + dataAtual.getHours();
  let minuto =
    (dataAtual.getMinutes() < 10 ? "0" : "") + dataAtual.getMinutes();
  let segundo =
    (dataAtual.getSeconds() < 10 ? "0" : "") + dataAtual.getSeconds();

  let dataFormatada =
    dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
  return dataFormatada;
}
