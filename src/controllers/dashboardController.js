const supabase = require('../config/supabase');

const getDashboardStats = async(req,res) =>{
    try{
        const[clientes, contratos, actividades, actividadesCompletas] = await Promise.all([
            //contar clientes
            supabase.from('Clientes').select('id',{count:'exact', head:true}),

            //contar contratos
            supabase.from('Contratos').select('id',{count:'exact', head:true}),

            //contar actividades
            supabase.from('Actividades').select('id',{count:'exact', head:true}),

            //actividades completadas 
            supabase.from('Actividades')
                .select('id', { count: 'exact', head: true })
                .eq('completado', true)
        ]);


        if (clientes.error) throw clientes.error;
        if (contratos.error) throw contratos.error;
        if (actividades.error) throw actividades.error;

        //calculo el porcentaje
        const totalAct = actividades.count || 0;
        const completas = actividadesCompletas.count || 0;

        //evito la division por cero
        let porcentaje = 0;
        if (totalAct > 0) {
            porcentaje = Math.round((completas / totalAct) * 100);
        }

        res.status(200).json({
            totalClientes: clientes.count,
            totalContratos: contratos.count,
            totalActividades: actividades.count,
            porcentajeGlobal: porcentaje
        });


    }catch(error){
        console.error("❌ BACKEND CRASH - Dashboard Stats:", error.message);
        console.error("Stack Trace:", error);

        res.status(500).json({ error: error.message });
    }

}

const  getClientsStats = async (req,res)=>{
    try{
        const userId = req.user.id;

        //cuento los contratos del usuario
        const contratos = await supabase.from('Contratos')
        .select('id', {count: 'exact', head: true})
        .eq('usuario', userId)

        //contar actividades pendientes
        const pendientes = await supabase.from('Actividades')
        .select('id, Contratos!inner(usuario)', {count: 'exact', head: true})
        .eq('Contratos.usuario', userId)

        //contar actividades listos
        const completadas = await supabase.from('Actividades')
        .select('id, Contratos!inner(usuario)', {count: 'exact', head: true})
        .eq('Contratos.usuario', userId)
        .eq('completado', true);

        res.json({
            totalContratos: contratos.count,
            tareasPendientes: pendientes.count,
            tareasListas: completadas.count
        });

    }catch(err){
        res.status(500).json({ error: error.message });
    }
    

}


module.exports = {getDashboardStats, getClientsStats};