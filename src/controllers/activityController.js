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
            .select('*') // Traemos todas las columnas de las tareas
            .eq('id_contrato', contractId) // Filtramos por el ID del contrato
            .order('id', { ascending: true }); // Opcional: ordenar por fecha de creación

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
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

module.exports = { createActivity,getActivitiesByContract, toggleActivityStatus };