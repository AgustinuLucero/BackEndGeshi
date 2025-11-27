const supabase = require('../config/supabase');

const globalSearch = async(req,res) =>{
    try{
        //obtener el termino de la busqueda de la url
        
        const{q} = req.query;

        if(!q){
            return res.status(400).json({error: 'Por favor ingresa un termino de busqueda'});
        }

        const isNumeric = !isNaN(q) && isFinite(q); 
        const numberQuery = isNumeric ? parseInt(q, 10) : 0;
        //preparo el termino para la busqueda parcial como texto
        const searchTerm = `%${q}%`;

        //busco en paralelo
        const[clientes,contratos,actividades] = await Promise.all([
            //busco en clientes
            supabase.from('Clientes')
            .select('*')
            .or(`nombre.ilike.${searchTerm},mail.ilike.${searchTerm}`), //ilike para que no importen mayusculas o minusculas

            //busco en contratos
            supabase.from('Contratos')
                .select('id, modulos, Clientes!usuario(nombre)')
                .or(
                    isNumeric ? `modulos.eq.${numberQuery}` : `modulos.ilike.${searchTerm}`
                ),

            //busco en actividades
            supabase.from('Actividades')
            .select('id, nombre, Contratos(id)')
            .ilike('nombre', searchTerm)
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
        console.error("Search Error:", error.message);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { globalSearch };