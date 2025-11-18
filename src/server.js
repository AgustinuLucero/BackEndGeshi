const express = require('express');
const cors = require('cors');
require('dotenv').config();

//importa tabla de supabase
const supabase = require('./config/supabase')

const app = express();
app.use(cors());
app.use(express.json());

//rutas
const contractRutes = require('./routes/contractRoutes');
const activityRoutes = require('./routes/activityRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

//conectar las rutas
app.use('/api/contracts',contractRutes);
app.use('/api/activities',activityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API funcionando. Usa las rutas /api/...' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log('Servidor corriendo...');
});
