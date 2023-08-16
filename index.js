const app = require('./config/app');
const db = require('./config/database');
const router = require('./routes/routes');

app.use('/api/v1', router);

const PORT = process.env.PORT ?? 3000

function main() {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando...http://localhost:${PORT}/`);
    })
    db.connect((err) => {
        if (err) throw err;
        console.log('DataBase Connected');
    });

}
main();


router.get('/pacientes', (req, res) => {
    const getQuery = `select * from paciente`;
    db.query(getQuery, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
})

router.get('/:dni', (req, res) => {
    const { dni } = req.params;
    const getQuery = `select * from paciente where dni = ?`;
    const query = db.format(getQuery, [dni]);
    db.query(query, (err, result) => {
        if (err) throw err;
        res.json(result);

    })
})

router.get('/pacientes/detalles', (req, res) => {
    const getQuery = 
    `select p.nombre, p.apellido, p.dni, c.fecha,  c.hora, c.receta_medica 
    from paciente  p 
    inner join cita  c 
    on p.id = c.id_paciente`;

    db.query(getQuery, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
})

router.get('/pacientes/:dni', (req, res) => {
    const { dni } = req.params;
    const getQuery = 
    `select p.nombre, p.apellido, p.dni, c.fecha,  c.hora, c.receta_medica 
    from paciente  p 
    inner join cita  c 
    on p.id = c.id_paciente 
    where dni  = ? `;
    const query = db.format(getQuery, [dni]);
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json(result);
    })
})

router.post('/', (req, res) => {
    const { nombre, apellido, dni, direccion, telefono } = req.body;
    const createQuery = `insert into paciente (nombre, apellido, dni, direccion, telefono) value (?,?,?,?, ?)`;
    const query = db.format(createQuery, [nombre, apellido, dni, direccion, telefono]);
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('paciente creado')
    })

})

router.put('/:documentoIdentidad', (req, res) => {
    const { documentoIdentidad } = req.params;
    const { nombre, apellido, dni, direccion, telefono } = req.body;
    const updateQuery = `update paciente set  nombre = ?, apellido = ?, dni = ?, direccion = ?, telefono = ?  where dni = ?`;
    const query = db.format(updateQuery, [nombre, apellido, dni, direccion, telefono, documentoIdentidad]);

    db.query(query, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('paciente actualizado con DNI');
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const deleteQuery = `delete from paciente where id = ?`
    const query = db.format(deleteQuery, [id]);
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log(result);

        res.send('paciente eliminado');
    })


})