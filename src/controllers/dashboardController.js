const supabase = require('../config/supabase');

const getDashboardStats = async(req,res) =>{
    try{
        const[clientes, contratos, actividades] = await Promise.all([
            //contar clientes
            supabase.from('Clientes').select('id',{count:'exact', head:true}),

            //contar contratos
            supabase.from('Contratos').select('id',{count:'exact', head:true}),

            //contar actividades
            supabase.from('Actividades').select('id',{count:'exact', head:true})

        ]);

        if (clientes.error) throw clientes.error;
        if (contratos.error) throw contratos.error;
        if (actividades.error) throw actividades.error;

        res.status(200).json({
            totalClientes: clientes.count,
            totalContratos: contratos.count,
            totalActividades: actividades.count
        });


    }catch(error){
        res.status(500).json({ error: error.message });
    }

}

module.exports = {getDashboardStats};