const supabase = require('../config/supabase');

const checkAuth = async(req,res,next)=>{
    try{
        //obtener token de la cabecera
        const authHeader = req.headers.authorization;

        //veo su la cabecera existe con el formato correcto
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({error: 'No autorizado, token no proporcionado'});
        }

        //extraigo el token
        const token = authHeader.split(' ')[1];

        const {data: {user}, error} = await supabase.auth.getUser(token);

        if(error){
            throw error;
        }

        //exito
        req.user = user;

        //voy al otro controlador
        next();
    }catch(error){
        res.status(401).json({ 
            error: 'No autorizado, token invalido.', 
            message: error.message 
        });
    }
}

module.exports= {checkAuth};