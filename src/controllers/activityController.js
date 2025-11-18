const supabase = require('../config/supabase');

const createActivity = async(req,res) =>{
    try{
        //obtener datos del formulario
        const {id, descripcion,} = req.body;

        //aca se obtiene el archivo de la peticion
        const file = req.file;

        //subir el archivo a supabase storage
        const fileName = `${Date.now()}-${file.originalname}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('informes') // el nombre del bucket
            .upload(fileName, file.buffer, {
            contentType: file.mimetype
        });

        if(uploadError) throw uploadError;

        //obtengo la url publica del archivo
        const { data: urlData } = supabase.storage
        .from('informes')
        .getPublicUrl(fileName);
        
        const fileUrl = urlData.publicUrl;

        //guarda la informacion en actividades
        const { data: dbData, error: dbError } = await supabase
        .from('Actividades')
        .insert([
            {
            id: id,
            descripcion: descripcion,
            url_pdf: fileUrl 
            }
        ]);

        if (dbError) throw dbError;

        res.status(201).json({ message: 'Actividad y PDF subidos con éxito', data: dbData });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

const getMyActivities = async(req,res)=>{
    try{
        const userId = req.user.id;

        const{data, error} = await supabase.from('Actividades')
        .select('*, Contratos(usuario)')
        .eq('Contratos.usuario', userId);

        if(error) throw error;

        res.status(200).json(data);
    }catch(error){
        res.status(500).json({error: error.messsage});
    }
}

module.exports = { createActivity, getMyActivities };