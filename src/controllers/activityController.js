const supabase = require('../config/supabase');

const createActivity = async(req,res) =>{
    
    try {
        const { contratoId, descripcion } = req.body;

        if (!contratoId || !descripcion) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (contratoId y descripción).' });
        }

        const { data, error } = await supabase
            .from('Actividades')
            .insert([{ 
                id_contrato: contratoId, 
                nombre: descripcion,
                completado: false
            }]);

        if (error) throw error;
        res.json({ message: 'Tarea agregada', data });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getActivitiesByContract = async (req, res) => {
    try {
        
        const { contractId } = req.params; 

        if (!contractId) {
            return res.status(400).json({ error: 'Falta el ID del contrato.' });
        }

        const { data, error } = await supabase
            .from('Actividades')
            .select(`
                id, 
                nombre, 
                completado, 
                id_contrato, 
                Contratos!id_contrato!inner(usuario, modulos, inicio, fin)
            `) // Traemos todas las columnas de las tareas
            .eq('id_contrato', contractId) // Filtramos por el ID del contrato
            .order('id', { ascending: true }); // Opcional: ordenar por fecha de creación

        if (error) throw error;

        console.log("ACTIVIDADES OBTENIDAS:\n", JSON.stringify(data, null, 2));
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMyActivities = async (req, res) => {
    try {
        const userId = req.user.id;

        //busco acyividades donde el contrato tenga asociado al dueño o sea el usuario
        const { data, error } = await supabase
            .from('Actividades')
            .select(`
                id, 
                nombre, 
                completado, 
                id_contrato, 
                Contratos!id_contrato!inner(usuario, modulos, inicio, fin)
            `)
            .eq('Contratos.usuario', userId) // filtro por usuario
            .order('id', { ascending: true });

        if (error) throw error;

        res.status(200).json(data);

    } catch (error) {
        console.error("Error getMyActivities:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const toggleActivityStatus = async(req,res) =>{
    try{
        const { activityId } = req.params;
        const { completado } = req.body;

        const { data, error } = await supabase
            .from('Actividades')
            .update({ completado: completado })
            .eq('id', activityId)
            .select();

        if(error){
            throw error;
        }

        res.json({message: 'Estado actualizado', data: data[0]});


    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createActivity,getActivitiesByContract,getMyActivities ,toggleActivityStatus };