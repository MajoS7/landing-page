exports.handler = async (event, context)=>{
    switch(event.httpMethod){
        case 'POST':
            const params = JSON.parse(event.body);
            console.log("Recibi una solicitud", params)
            return;
        default:
            return{
                statusCode:405, 
                message: "Metodo no soportado"
            }
    }
}