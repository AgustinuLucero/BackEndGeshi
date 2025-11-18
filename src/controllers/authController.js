const supabase = require('../config/supabase');

//funcion del login
const loginUser = async(req,res)=>{
    try{

        

        const{email,password} = req.body;

        const{data,error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if(error){
            throw error;
        }

        res.status(200).json({
            message: 'Login exitoso',
            session: data.session,
            user: data.user
        });

    }catch(error){
        res.status(401).json({
            error: 'Credenciales invalidas',
            message: error.message
        });
    }
}

module.exports = {loginUser}