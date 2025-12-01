const supabase = require('../config/supabase');

//funcion del login
const loginUser = async(req,res)=>{
    try{
        const{email, cuil,password} = req.body;

        let loginEmail = email; //por si viene del admin

        if ((!email && !cuil) || !password) { 
            return res.status(400).json({ error: 'Faltan credenciales (Email/CUIL y contraseña).' });
        }

        //por si uso el cuil
        if (cuil) {
            // busco el mail asociado
            const { data: userProfile, error: searchError } = await supabase
                .from('Clientes')
                .select('mail') 
                .eq('cuil', cuil) 
                .single();

            if (searchError || !userProfile) {
                return res.status(401).json({ error: 'CUIL no encontrado o no registrado.' });
            }
            
            // asigno el email encontrado para el login
            loginEmail = userProfile.mail;
        }
        

        //login con mail
        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginEmail, // uso el email encontrado o el email que vino directo
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