const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// --- MIDDLEWARE (Configuración) ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cors());

// --- CONEXIÓN BASE DE DATOS ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gimnasio'
});

db.connect(err => {
    if (err) {
        console.error("❌ Error conectando a BD:", err);
    } else {
        console.log("✅ Conectado a la Base de Datos MySQL");
    }
});

// --- 1. RUTAS DE PÁGINAS (Frontend) ---
app.get('/socios', (req, res) => res.sendFile(__dirname + '/public/socios.html'));
app.get('/actividades', (req, res) => res.sendFile(__dirname + '/public/actividades.html'));


// --- 2. API SOCIOS (BUSCAR POR ID) ---
// CORREGIDO: Aquí estaba el error. Cambié 'id_socio' por 'id'.
app.get('/api/socios/:id', (req, res) => {
    const { id } = req.params;

    // Usamos 'id' que es como se llama en tu base de datos
    const sql = "SELECT * FROM socios WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Error SQL:", err.sqlMessage);
            return res.status(500).json({ error: "Error en la base de datos" });
        }
        
        if (result.length > 0) {
            res.json(result[0]); // ¡Encontrado!
        } else {
            res.status(404).json({ error: "No encontrado" });
        }
    });
});


// --- 3. API ACTIVIDADES (Para llenar el select) ---
app.get('/api/obtener-actividades', (req, res) => {
    db.query("SELECT * FROM actividades", (err, result) => {
        if (err) {
            console.error("Error obteniendo actividades:", err);
            res.status(500).send("Error");
        } else {
            res.json(result);
        }
    });
});


// --- 4. API RESERVAS (Con Validación de Cupo) ---
app.post('/api/reservas', (req, res) => {
    const { socio_id, actividad_id, fecha, hora } = req.body;

    if (!socio_id || !actividad_id) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    // PASO 1: Averiguar cuál es el CUPO MÁXIMO de la actividad elegida
    db.query("SELECT cupo_maximo FROM actividades WHERE id = ?", [actividad_id], (err, resultAct) => {
        if (err) return res.status(500).json({ mensaje: "Error al consultar actividad" });
        
        // Guardamos el tope máximo (ej: 10)
        const cupoMaximo = resultAct[0].cupo_maximo;

        // PASO 2: Contar cuántas reservas hay YA para ese día y esa actividad
        const sqlContar = "SELECT COUNT(*) as total FROM reservas WHERE id_actividad = ? AND fecha = ?";
        
        db.query(sqlContar, [actividad_id, fecha], (err, resultCount) => {
            if (err) return res.status(500).json({ mensaje: "Error al contar cupos" });

            const totalReservados = resultCount[0].total;

            // PASO 3: EL MOMENTO DE LA VERDAD (Comparación)
            if (totalReservados >= cupoMaximo) {
                // SI ESTÁ LLENO:
                return res.status(400).json({ 
                    mensaje: `⛔ ¡Lo sentimos! El cupo para esta actividad está completo por hoy (${cupoMaximo} turnos ocupados). Por favor, elija otra fecha.` 
                });
            }

            // PASO 4: SI HAY LUGAR, GUARDAMOS LA RESERVA (El código de siempre)
            const sqlInsert = "INSERT INTO reservas (id_socio, id_actividad, fecha, hora) VALUES (?, ?, ?, ?)";
            db.query(sqlInsert, [socio_id, actividad_id, fecha, hora], (err, result) => {
                if (err) return res.status(500).json({ mensaje: "Error al guardar en BD" });
                
                // Éxito
                res.json({ ok: true, id_reserva: result.insertId, mensaje: "Reserva exitosa" });
            });
        });
    });
});

// --- 5. RUTAS CLÁSICAS (Guardar Socio y Actividad) ---

app.post('/guardar-socio', (req, res) => {
    const { nombre, dni, telefono, email, direccion, nacimiento } = req.body;
    
    db.query("SELECT * FROM socios WHERE dni = ?", [dni], (err, result) => {
        if (err) return res.send("Error al verificar DNI: " + err.sqlMessage);
        
        if (result.length > 0) {
            return res.send(`<h3 style="color:red">Error: El socio con DNI ${dni} ya existe.</h3><a href="/socios">Volver</a>`);
        }

        const sqlInsert = "INSERT INTO socios (nombre, dni, telefono, email, direccion, nacimiento) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sqlInsert, [nombre, dni, telefono, email, direccion, nacimiento], (err, result) => {
            if (err) return res.send("Error al guardar socio: " + err.sqlMessage);
            
            res.send(`
                <div style="text-align:center; margin-top:50px;">
                    <h1 style="color:green">¡Socio Guardado!</h1>
                    <h3>Su Nro de Socio (ID) es: ${result.insertId}</h3>
                    <a href="/socios">Cargar otro</a> | <a href="/">Ir a Reservar</a>
                </div>
            `);
        });
    });
});

app.post('/guardar-actividad', (req, res) => {
    const { nombre, cupo_maximo } = req.body;
    
    const sql = "INSERT INTO actividades (nombre, cupo_maximo) VALUES (?, ?)";
    db.query(sql, [nombre, cupo_maximo], (err, result) => {
        if (err) return res.send("Error al guardar actividad: " + err.sqlMessage);
        
        res.send(`<h1>Actividad Guardada</h1><a href="/actividades">Volver</a>`);
    });
});


// --- ARRANQUE DEL SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});