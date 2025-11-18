const supabase = require('../config/supabase');

//creo un nuevo usuario
const createUser = async(req,res)=>{
    try{
        const {password,nombre,cuil,mail} = req.body;

        const{data:authData,error:authError} = await supabase.auth.admin.createUser({
            mail: mail,  
            password: password,
            mailConfirm: true
        });

        if(authError) throw authError;

        //le doy un id
        const idUser = authData.user.id;

        //guardar datos
        const{error: profileError} = await supabase
        .from('Clientes')
        .insert([
            {
                id: idUser,
                cuil: cuil,
                nombre: nombre,
                mail: mail
            }
        ]);

        if(profileError) throw profileError;

        res.status(201).json({message: 'Usuario creado', user: authData.user});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const getAllUsers = async(req,res)=>{
    try{
        const{data,error} = await supabase
        .from('Clientes')
        .select('*');

        if(error) throw error;
        //envio la lista de usuarios
        res.status(200).json(data);

    }catch(error){
        res.status(500).json({error: error.message});
    }
}
    



module.exports = {createUser, getAllUsers};