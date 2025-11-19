const supabase = require('../config/supabase');

const globalSearch = async(req,res) =>{
    try{
        //obtener el termino de la busqueda de la url
        const{q} = req.query;

        if(!q){
            return res.status(400).json({error: 'Por favor ingresa un termino de busqueda'});
        }

        //preparo el termino para la busqueda parcial como texto
        const searchTerm = `%${q}%`;

        //busco en paralelo
        const[clientes,contratos,actividades] = await Promise.all([
            //busco en clientes
            supabase.from('Clientes')
            .select('*')
            .or(`nombre.ilike.${searchTerm},cuil.ilike.${searchTerm}`), //ilike para que no importen mayusculas o minusculas

            //busco en contratos
            supabase.from('Contratos')
            .select('*, Clientes(nombre)')
            .ilike('id',searchTerm),

            //busco en actividades
            supabase.from('Actividades')
            .select('*, Contratos(Contratos())')
            .ilike('descripcion', searchTerm)
        ]);

        //armo la respuesta combinada
        res.status(200).json({
            query: q,
            results: {
                clientes: clientes.data || [],
                contratos: contratos.data || [],
                actividades: actividades.data || []
            }
        });

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

module.exports = { globalSearch };