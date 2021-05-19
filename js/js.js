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
    Abono: function(monto){
        this.totalAbonado += parseFloat((Math.round(monto * 100) / 100).toFixed(2));
        return this.saldo += parseFloat((Math.round(monto * 100) / 100).toFixed(2));
            //parseFloat(monto);
    },
    Retiro: function(monto){
        this.totalRetirado -= parseFloat((Math.round(monto * 100) / 100).toFixed(2));
        return this.saldo -= parseFloat((Math.round(monto * 100) / 100).toFixed(2));
            //parseFloat(monto);
    },
    porGastos: function(){
        var porcentajeG = ((this.totalRetirado * 100) / this.totalAbonado) * -1;
        return parseFloat((Math.round(porcentajeG * 100) / 100).toFixed(2));
        //porcentajeG;
    },
    detPorGasto: function(monto){
        var pg = parseFloat((monto * 100) / this.totalAbonado)
        return parseFloat((Math.round(pg * 100) / 100).toFixed(2));
        //parseFloat((monto * 100) / this.totalAbonado);
    }
};

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