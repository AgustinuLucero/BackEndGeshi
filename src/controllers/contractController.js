const supabase = require('../config/supabase');

//crear contrato
const createContract = async(req,res)=>{
    try{
        const{id,modulo, inicio,fin,usuario} = req.body;

        //validaciones
        if(!id || !usuario || !inicio || !fin){
            return res.status(400).json({error: 'Faltan datos obligatorios'})
        }

        const{data, error} = await supabase
        .from('Contratos')
        .insert([
            {
                id:id,
                modulo: modulo,
                inicio: inicio, 
                fin:fin,
                usuario: usuario
            }
        ])
        .select();

        if(error) throw error;

        res.status(201).json({message: 'Contrato creado con exito', data: data[0]});


    }catch(error){
        res.status(500).json({error: error.message});
    }
}

//obtener contratos
const getAllContracts = async(req, res) =>{
    try{
        const { data, error } = await supabase
        .from('Contratos')
        .select('*');

        if (error) throw error;

        res.status(200).json(data);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}


const getMyContracts = async(req,res)=>{
    try{
        const userId = req.user.id;

        const {data,error} = await supabase.from('Contratos')
        .select('*')
        .eq('usuario', userId);

        if(error) throw error;

        res.status(200).json(data);

    }catch(error){
        res.status(500).json({error: error.message});
    }
};

module.exports={createContract, getAllContracts,getMyContracts};