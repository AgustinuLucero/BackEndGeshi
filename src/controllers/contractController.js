const supabase = require('../config/supabase');

//crear contrato
const createContract = async(req,res)=>{
    try{

        console.log("Datos recibidos:", req.body);

        const{usuario_id, numero_contrato, modulos, inicio, fin} = req.body;

        //validaciones
        if( !usuario_id || !inicio || !fin){
            return res.status(400).json({error: 'Faltan datos obligatorios'})
        }

        const{data, error} = await supabase
        .from('Contratos')
        .insert([
            {
                usuario: usuario_id,
                modulos: modulos,
                inicio: inicio, 
                fin:fin
                
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

const uploadContractReport = async (req, res) => {
    try {
        const { contratoId } = req.body; 
        const file = req.file;          

        if (!file || !contratoId) {
            return res.status(400).json({ error: 'Falta el archivo PDF o el ID del contrato.' });
        }

        // lo subo al storage
        const fileName = `contrato-${contratoId}-${Date.now()}.pdf`;
        const { error: uploadError } = await supabase.storage
            .from('informes')
            .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (uploadError) throw uploadError;

        // obtengo la url
        const { data: urlData } = supabase.storage.from('informes').getPublicUrl(fileName);
        const fileUrl = urlData.publicUrl;

        // con el nuevo URL actualizo la tabla contratos con el url
        const { data, error } = await supabase
            .from('Contratos')
            .update({ url_informe: fileUrl })
            .eq('id', contratoId) // seria la fila del contrato
            .select();

        if (error) throw error;
        
        // por si no se actualizan las filas, o sea el contrato seria incorrecto
        if (data.length === 0) {
            return res.status(404).json({ error: 'Contrato no encontrado o ID inválido.' });
        }

        res.json({ message: 'Informe final subido y contrato actualizado con éxito.', data: data[0] });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports={createContract, getAllContracts,getMyContracts,uploadContractReport };