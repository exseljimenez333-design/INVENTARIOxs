let editandoIndex = null;
let chart;
function filtrarTabla(){

    const texto =
    document.getElementById("buscador")
    .value
    .toLowerCase();

    const filas =
    document.querySelectorAll("#tablaBody tr");

    filas.forEach(fila => {

        const producto =
        fila.children[1]
        .innerText
        .toLowerCase();

        if(producto.includes(texto)){

            fila.style.display = "";

        }else{

            fila.style.display = "none";

        }

    });
}

let movimientos =
JSON.parse(localStorage.getItem("movimientos")) || [];

let inventario =
JSON.parse(localStorage.getItem("inventario")) || {};

renderTabla();
actualizarStats();
renderGrafica();
function guardarDatos(){

    localStorage.setItem(
        "movimientos",
        JSON.stringify(movimientos)
    );

    localStorage.setItem(
        "inventario",
        JSON.stringify(inventario)
    );
}
 function registrarEntrada(){

    const fecha =
    document.getElementById("fecha").value;

    const producto =
    document.getElementById("producto").value;

    const concepto =
    document.getElementById("concepto").value;

    const cantidad =
    parseFloat(
    document.getElementById("cantidad").value);

    const costo =
    parseFloat(
    document.getElementById("costo").value);

    if(
        !fecha ||
        !producto ||
        !concepto ||
        isNaN(cantidad) ||
        isNaN(costo)
    ){

        mostrarToast(
        "Completa todos los campos",
        "#ef4444"
        );

        return;
    }

    if(!inventario[producto]){

        inventario[producto] = {

            existencia:0,
            saldo:0,
            promedio:0

        };
    }

    let item = inventario[producto];

    const debe = cantidad * costo;

    item.existencia += cantidad;

    item.saldo += debe;

    item.promedio =
    item.saldo / item.existencia;

    if(editandoIndex !== null){

        movimientos.splice(editandoIndex, 1);

        recalcularInventario();
    }

    const movimiento = {

        fecha,
        producto,
        concepto,

        entrada:cantidad,
        salida:"",

        existencia:item.existencia,

        costo,

        promedio:item.promedio,

        debe,

        haber:"",

        saldo:item.saldo
    };
movimientos.push({

    fecha,
    producto,
    concepto,

    entrada:cantidad,
    salida:"",

    existencia:item.existencia,

    costo,

    promedio:item.promedio,

    debe,

    haber:"",

    saldo:item.saldo
});

guardarDatos();
renderTabla();

actualizarStats();

renderGrafica();

mostrarToast(
"Entrada registrada",
"#22c55e"
);

limpiarFormulario();
    
}
 function registrarSalida(){

    const fecha =
    document.getElementById("fecha").value;

    const producto =
    document.getElementById("producto").value;

    const concepto =
    document.getElementById("concepto").value;

    const cantidad =
    parseFloat(
    document.getElementById("cantidad").value);

    if(
        !fecha ||
        !producto ||
        !concepto ||
        isNaN(cantidad)
    ){

        mostrarToast(
        "Completa todos los campos",
        "#ef4444"
        );

        return;
    }

    if(!inventario[producto]){

        mostrarToast(
        "Producto no existe",
        "#ef4444"
        );

        return;
    }

    let item = inventario[producto];

    if(cantidad > item.existencia){

        mostrarToast(
        "Stock insuficiente",
        "#ef4444"
        );

        return;
    }

    const haber =
    cantidad * item.promedio;

    item.existencia -= cantidad;

    item.saldo -= haber;

    const movimiento = {

        fecha,
        producto,
        concepto,

        entrada:"",
        salida:cantidad,

        existencia:item.existencia,

        costo:"",

        promedio:item.promedio,

        debe:"",

        haber,

        saldo:item.saldo
    };
movimientos.push({

    fecha,
    producto,
    concepto,

    entrada:"",
    salida:cantidad,

    existencia:item.existencia,

    costo:"",

    promedio:item.promedio,

    debe:"",

    haber,

    saldo:item.saldo
});

guardarDatos();

    renderTabla();

    actualizarStats();

    renderGrafica();

    mostrarToast(
    "Salida registrada",
    "#3b82f6"
    );

    limpiarFormulario();
}
function actualizarStats(){

    document.getElementById(
        "productosCount"
    ).innerText =
    Object.keys(inventario).length;

    document.getElementById(
        "movimientosCount"
    ).innerText =
    movimientos.length;

    let total = 0;

    Object.values(inventario).forEach(item => {

        total += item.saldo;

    });

    document.getElementById(
        "inventarioTotal"
    ).innerText =
    "$" + total.toFixed(2);
}

function limpiarFormulario(){

    document.getElementById("producto").value = "";
    document.getElementById("concepto").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("costo").value = "";
}
function mostrarToast(mensaje, color){

    Toastify({

        text: mensaje,

        duration: 3000,

        gravity: "top",

        position: "right",

        style: {

            background: color,
            borderRadius: "10px"

        }

    }).showToast();
}
function renderGrafica(){

    const ctx =
document.getElementById(
"graficaInventario"
).getContext("2d");

    const nombres =
    Object.keys(inventario);

    const valores =
    Object.values(inventario)
    .map(item => item.saldo);

    if(chart){

        chart.destroy();

    }

    chart = new Chart(ctx, {

        type:"bar",

        data:{

            labels:nombres,

            datasets:[{

                label:"Valor Inventario",

                data:valores,

                borderWidth:1

            }]
        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    labels:{
                        color:"white"
                    }
                }

            },

            scales:{

                x:{
                    ticks:{
                        color:"white"
                    }
                },

                y:{
                    ticks:{
                        color:"white"
                    }
                }

            }

        }

    });
}
function renderTabla(){

    const tabla =
    document.getElementById("tablaBody");

    tabla.innerHTML = "";

    movimientos.forEach((m, index) => {

        tabla.innerHTML += `

        <tr>

            <td>${m.fecha}</td>

            <td>
                <span class="badge bg-primary">
                    ${m.producto}
                </span>
            </td>

            <td>${m.concepto}</td>

            <td>${m.entrada}</td>

            <td>${m.salida}</td>

            <td>${m.existencia}</td>

            <td>
                ${m.costo ? "$"+(m.costo || 0).toFixed(2) : ""}
            </td>

            <td>
                $${(m.promedio || 0).toFixed(2)}
            </td>

            <td>
                ${m.debe ? "$"+(m.debe || 0).toFixed(2) : ""}
            </td>

            <td>
                ${m.haber ? "$"+(m.haber || 0).toFixed(2) : ""}
            </td>

            <td>
                $${(m.saldo || 0).toFixed(2)}
            </td>
           <td class="d-flex gap-2">

    <button
    class="btn btn-warning btn-sm"
    onclick="editarMovimiento(${index})">

        <i class="fa-solid fa-pen"></i>

    </button>

    <button
    class="btn btn-danger btn-sm"
    onclick="eliminarMovimiento(${index})">

        <i class="fa-solid fa-trash"></i>

    </button>

</td>
        </tr>

        `;
    });
}
function exportarExcel(){

    if(movimientos.length === 0){

        mostrarToast(
        "No hay datos para exportar",
        "#ef4444"
        );

        return;
    }

    const datos = movimientos.map(m => ({

        Fecha: m.fecha,

        Producto: m.producto,

        Concepto: m.concepto,

        Entrada: m.entrada,

        Salida: m.salida,

        Existencia: m.existencia,

        Costo: m.costo,

        Promedio: m.promedio,

        Debe: m.debe,

        Haber: m.haber,

        Saldo: m.saldo

    }));

    const hoja =
    XLSX.utils.json_to_sheet(datos);

    const libro =
    XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        libro,
        hoja,
        "Inventario"
    );

    XLSX.writeFile(
        libro,
        "inventario.xlsx"
    );

    mostrarToast(
    "Excel exportado",
    "#22c55e"
    );
}
function eliminarMovimiento(index){

    movimientos.splice(index, 1);

    recalcularInventario();

    guardarDatos();

    renderTabla();

    actualizarStats();

    renderGrafica();

    mostrarToast(
    "Movimiento eliminado",
    "#ef4444"
    );
}
function recalcularInventario(){

    inventario = {};

    movimientos.forEach(m => {

        if(!inventario[m.producto]){

            inventario[m.producto] = {

                existencia:0,
                saldo:0,
                promedio:0

            };
        }

        let item = inventario[m.producto];

        if(m.entrada){

            const debe =
            m.entrada * m.costo;

            item.existencia += m.entrada;

            item.saldo += debe;

            item.promedio =
            item.saldo / item.existencia;

        }

        if(m.salida){

            const haber =
            m.salida * item.promedio;

            item.existencia -= m.salida;

            item.saldo -= haber;
        }

    });
}
function editarMovimiento(index){

    const m = movimientos[index];

    document.getElementById("fecha").value =
    m.fecha;

    document.getElementById("producto").value =
    m.producto;

    document.getElementById("concepto").value =
    m.concepto;

    document.getElementById("cantidad").value =
    m.entrada || m.salida;

    document.getElementById("costo").value =
    m.costo || "";

    editandoIndex = index;

    mostrarToast(
    "Modo edición activado",
    "#f59e0b"
    );
}
function iniciarEscaner() {

    const html5QrCode = new Html5Qrcode("reader");

    const config = {

        fps: 20,

qrbox: {
    width: 320,
    height: 320
},
  aspectRatio: 1.777,
        formatsToSupport: [

            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.UPC_A,

        ]
    };
    html5QrCode.start(

    { facingMode: "environment" },

    config,
    
    (decodedText, decodedResult) => {

        console.log("CODIGO LEIDO:", decodedText);

        alert("Código leído: " + decodedText);

        document.getElementById("producto").value = decodedText;

        mostrarToast(
            "Escaneado: " + decodedText,
            "#22c55e"
        );

        html5QrCode.stop();
 }

);

}
