const socketio = require('socket.io')
const parseStringAsArray = require ('./utils/parseStringAsArray')
const calculateDistance = require('./models/utils/calculateDistance');

let io;
const connections = []; // Salvar o num de conexões, correto seria em um Database

exports.setupWebsocket = (server) => {
    io = socketio(server);    

    io.on('connection', socket => {
       const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id:socket.id,
            coordinates:{
                latitude:Number(latitude),
                longitude:Number(longitude),
            },
            techs: parseStringAsArray(techs),
        });
    });
};

exports.findConnections = ( coordinates, techs ) => {
    return connections. filter(connection =>{
        return calculateDistance(coordinates, connection.coordinates) < 10 // Verificar se a distância é de 10k
        && connection.techs.some(item => techs.includes(item)) // Verificar se pelo menos uma das techs é igual a tech digitada pelo user

    })

}

exports.sendMessage =(to, message, data) =>{
    to.forEach(connection =>{
        io.to(connection.id).emit(message, data);
    })
}