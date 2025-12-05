const supabase = require('../config/supabase');

//creo un nuevo usuario
const createUser = async(req,res)=>{
    try{
        const {password,nombre,cuil,email} = req.body;

        const{data:authData,error:authError} = await supabase.auth.admin.createUser({
            email: email,  
            password: password,
            email_confirm: true
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
                mail: email
            }
        ]);

        if(profileError) throw profileError;

        res.status(201).json({message: 'Usuario creado', user: authData.user});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

//elimino el usuario
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params; // recibo el id

        // borro de la tabla clientes
        const { error: profileError } = await supabase
            .from('Clientes')
            .delete()
            .eq('id', userId);

        if (profileError) throw profileError;

        // borrar el login
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        
        if (authError) throw authError;

        res.status(200).json({ message: "Usuario eliminado correctamente" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//traigo a los usuarios
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
    



module.exports = {createUser, getAllUsers, deleteUser};