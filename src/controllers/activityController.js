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
                contrato_id: contratoId, 
                descripcion: descripcion,
                completada: false
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
            .eq('contrato_id', contractId) // Filtramos por el ID del contrato
            .order('created_at', { ascending: true }); // Opcional: ordenar por fecha de creación

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createActivity,getActivitiesByContract };