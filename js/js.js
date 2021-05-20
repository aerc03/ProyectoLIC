var data = [
    {
        NoCuenta: "0587414365",
        pin: 1234,
        Nombre: "Antonio Perez", 
        Saldo: 800, 
        Abonos: 0, 
        Retiros: 0, 
        Descripcion: ""
    },
    {
        NoCuenta: "0865941205",
        pin: 9876,
        Nombre: "Eduardo Rivas", 
        Saldo: 600, 
        Abonos: 0, 
        Retiros: 0, 
        Descripcion: ""
    }
]

var cuenta = {
    Saldo: 0,
    Abonos: 0,
    Retiros: 0,
    Nombre: "",
    NoCuenta: "", 
    pin: 0,
    Descripcion: "",
    NRetiros: 0,
    NAbonos: 0,
    NServicios: 0,
    Abono: function(monto){
        this.Abonos += parseFloat((Math.round(monto * 100) / 100).toFixed(2));
        return this.Saldo += parseFloat((Math.round(monto * 100) / 100).toFixed(2));
            //parseFloat(monto);
    },
    Retiro: function(monto){
        this.Retiros -= parseFloat((Math.round(monto * 100) / 100).toFixed(2));
        return this.Saldo -= parseFloat((Math.round(monto * 100) / 100).toFixed(2));
            //parseFloat(monto);
    },
    porGastos: function(){
        var porcentajeG = ((this.Retiros * 100) / this.Abonos) * -1;
        return parseFloat((Math.round(porcentajeG * 100) / 100).toFixed(2));
        //porcentajeG;
    },
    detPorGasto: function(monto){
        var pg = parseFloat((monto * 100) / this.Abonos)
        return parseFloat((Math.round(pg * 100) / 100).toFixed(2));
        //parseFloat((monto * 100) / this.totalAbonado);
    }
};

var transacciones = [];
var contador = 0;

function IniciarSesion(){

    var pin = document.getElementById("login__password").value;
    for(var x = 0; x<data.length; x++)
    {
      
        if(data[x].pin==pin)
        {
            cuenta.Nombre = data[x].Nombre;
            cuenta.NoCuenta = data[x].NoCuenta;
            cuenta.pin = data[x].pin;
            cuenta.Saldo = data[x].Saldo;
            alert("Bienvenido " + data[x].Nombre)
            window.location.href = "index.html"

            break;
        }
    }

    localStorage.setItem('UserInfo', JSON.stringify(cuenta));

}

function CerrarSesion(){  
    localStorage.clear();
    window.location.href = "login.html";
}

function setPersonalData()
{
    var userData = JSON.parse(localStorage.getItem('UserInfo'));
    var nombreCuenta = document.getElementById("info");
    nombreCuenta.innerHTML = userData.Nombre + " - <span>" + userData.NoCuenta + "</span>";
}

function HacerMovimiento(Tipo){
    if(Tipo == 1){
        var valor = parseFloat(document.getElementById("monto").value);
        var desc = document.getElementById("comentario").value;
        if(!valor) {
            Swal.fire('Ingrese un número')
            return null;
        }
        
        cuenta.Descripcion = desc;
        cuenta.Abono(valor);
       
        Swal.fire({
            icon: 'success',
            title:"El monto abonado es: " +valor + " El saldo de la cuenta es: " + parseFloat(cuenta.Saldo),
            showConfirmButton: true
          })
        RegistrarHistorial("Ingreso", valor, cuenta.Descripcion);    
        document.getElementById("monto").value = "";
        document.getElementById("comentario").value = "";        
        
          cuenta.NAbonos++;

    }
    else if(Tipo == 2){
        
        var valor = parseFloat(document.getElementById("montoR").value);
        var desc = document.getElementById("comentarioR").value;
        if(!valor) {
            Swal.fire('Ingrese un número')
            return null;
        }
        if(cuenta.saldo < valor ) {

            Swal.fire({
                icon: 'warning',
                title: 'No tiene fondos suficientes',
              })
            return null;
        }
      
        cuenta.Descripcion = desc;
        cuenta.Retiro(valor);
        Swal.fire({
            icon: 'success',
            title:"El monto retirado es: " +valor + " El saldo de la cuenta es: " + parseFloat(cuenta.Saldo),
            showConfirmButton: true
          })
        RegistrarHistorial("Retiro", valor, cuenta.Descripcion);   
        document.getElementById("montoR").value = "";
        document.getElementById("comentarioR").value = "";
        cuenta.NRetiros++;
        
    }
    else if(Tipo == 3){
        
        var select = document.getElementById("Opciones");    
        var selectedValue = select.options[select.selectedIndex].text;
        var valor = parseFloat(document.getElementById("montoS").value);
        var desc = document.getElementById("comentarioS").value;
        if(!valor) {
            Swal.fire('Ingrese un número')
            return null;
        }
        if(cuenta.saldo < valor ) {
            Swal.fire({
                icon: 'warning',
                title: 'No tiene fondos suficientes',
              })
            return null;
        }
      
        cuenta.Descripcion = desc;
        cuenta.Retiro(valor);
        Swal.fire({
            icon: 'success',
            title:"El monto pagado es: " + valor + " El saldo de la cuenta es: " + parseFloat(cuenta.Saldo),
            showConfirmButton: true
          })
        RegistrarHistorial("Pago Servicio", valor, selectedValue);   

        document.getElementById("montoS").value = "";
        document.getElementById("comentarioS").value = "";  
        cuenta.NServicios++;
    }
    else{
        Swal.fire({
            icon: 'warning',
            title: 'Debe colocar un tipo de transacción',
          })
       
    }    

    LlenarHistorial();
    graficar();
}


function RegistrarHistorial(tipo, monto, descripcion){
    contador++;
    transacciones.push( {
        id: contador,
        tipoTransaccion: tipo, 
        monto: monto,
        descripcion: descripcion

    })
}

function LlenarHistorial()
{   
    var tabla = document.getElementById("Historial");   

    var contenido = "";

    for(var x = 0; x < transacciones.length; x++)
    {
        contenido += `
        <div class="col-lg-4 col-md-6 align-items-stretch">
          <div class="icon-box">
            <div class="icon">$${transacciones[x].monto}</div>
            <h4><a href="">${transacciones[x].tipoTransaccion}</a></h4>
            <p>${transacciones[x].descripcion}</p>
          </div>
        </div>
        `;
    }

    tabla.innerHTML = contenido;
   
}

function graficar()
{
var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ["Depositos", "Retiros", "Pagos"],
            datasets: [{
              backgroundColor: [
                "#2ecc71",
                "#f1c40f",
                "#e74c3c"
              ],
              data: [cuenta.NAbonos,cuenta.NRetiros,cuenta.NServicios]
            }]
          }
        });
}