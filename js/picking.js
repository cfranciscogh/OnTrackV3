var rutaWS = "http://ontrack.tmeridian.com.pe:9002/api/";
var totalCheck = 0;
var countCheck = 1;
$(document).ready(function(e) {  
	getProgramaciones();
	
	 $("form").keypress(function(e) {
        if (e.which == 13) {
            return false;
        }
    }); 
	
	setIncidencias_Tracking($.QueryString["empresa"],8);
	
	
	$("#actualizar").click(function(e) {
		var IDPedido = "";
		$("#listProgramacion input").each(function(index, element) {
			if ( $(this).is(":checked") ){
				  IDPedido = IDPedido + "," + $(this).data("pedido");
			}
    	});
		
		$("#listProgramacionDAD input").each(function(index, element) {
			if ( $(this).is(":checked") ){
				  IDPedido = IDPedido + "," + $(this).data("pedido");
			}
    	});
		 
		if ( IDPedido == ""){
		    alerta('Debe seleccionar 1 o m\u00E1s registros');
			return;	
		}
		
		
		
		$.mobile.loading('show');
		$.ajax({
		    url: rutaWS + "Operaciones/Chofer.asmx/PickingPedido",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
		data : '{"IDPedidos":"' + IDPedido + '"}',
        //contentType: "xml",
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
		resultado = $.parseJSON(data.d);
			console.log(resultado);
			$.mobile.loading('hide');
			if ( resultado == 1 ){
			    alerta("Picking realizado con \u00E9xito");
				$("#myPopup").popup("close");
				getProgramaciones();
				//alert(resultado[0].mensaje);
			}
        },

        error : function(jqxhr) 
        {
		   console.log(jqxhr);	
           alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });	
	   
    });
	
	
	$("#enruta").click(function (e) {
	    var IDPedido = "";
	    $("#listProgramacion input").each(function (index, element) {
	        if ($(this).is(":checked")) {
	            IDPedido = IDPedido + "," + $(this).data("pedido");
	        }
	    });

	    if (IDPedido == "") {
	        alerta('Debe seleccionar 1 o m\u00E1s registros');
	        return;
	    }

	    totalCheck = $("#listProgramacion input:checked").length;
	    // alert(totalCheck);
	    $.mobile.loading('show');

	    $("#listProgramacion input").each(function (index, element) {
	        if ($(this).is(":checked")) {

	            var date=new Date();
	            hour=date.getHours();
	            min=date.getMinutes(); 
	            if ((String(hour)).length == 1)
	                hour = '0' + hour;
	            if ((String(min)).length == 1)
	                min = '0' + min;
                    
	            dateT = hour + ':' + min;
	            alert(dateT);

	            IDPedido = $(this).data("pedido");	       
	            var parametros = new Object();
	            parametros.IDTranking = 0;
	            parametros.IDPedido = IDPedido;
	            parametros.TiempoAproxLlegada = dateT;
	            parametros.Recepcionado = 0;
	            parametros.Nombre = "";
	            parametros.DNI = "";
	            parametros.IDEstado = 4;
	            parametros.Observacion = "";
	            parametros.Latitud = "";
	            parametros.Longitud = "";
	            parametros.Incidencia = 0;
	            parametros.FlagMail = 1;
	            parametros.HoraInicio = "";
	            parametros.HoraFin = "";
	            parametros.HoraLlegada = "";
	            parametros.ParcialGrupo = 0;
	            console.log(parametros);

	            $.ajax({
	                url: rutaWS + "Operaciones/Chofer.asmx/GenerarTrakingV3",
	                type: "POST",
	                dataType: "json",
	                data: JSON.stringify(parametros),
	                contentType: "application/json; charset=utf-8",
	                success: function (data, textStatus, jqXHR) {
	                    resultado = $.parseJSON(data.d);
	                    console.log(resultado);
	                    $.mobile.loading('hide');
	                    //alert(countCheck);
	                    if (resultado.code == 1) {
	                        if (totalCheck == countCheck) {
	                            alerta(resultado.message);
	                            getProgramaciones();
	                        }
	                    }
	                    countCheck++;
	                },

	                error: function (jqxhr) {
	                    console.log(jqxhr);
	                    alerta('Error de conexi\u00f3n, contactese con sistemas!');
	                }

	            });
	            
	        }
	    });

	    

	});


	 
	$("#liberar").click(function(e) {
		var IDPedido = "";
		$("#listProgramacion input").each(function(index, element) {
			if ( $(this).is(":checked") ){
				  IDPedido = IDPedido + "," + $(this).data("pedido");
			}
    	});
		
		$("#listProgramacionDAD input").each(function(index, element) {
			if ( $(this).is(":checked") ){
				  IDPedido = IDPedido + "," + $(this).data("pedido");
			}
    	});
		 
		if ( IDPedido == ""){
			alerta('Debe seleccionar 1 o mas OC');
			return;	
		}
		
		if ( $("#incidencia").val() == "0" ){
			alerta("Seleccionar incidencia");
			$("#incidencia").focus();
			return;
		}
		
 
		$.mobile.loading('show');
		$.ajax({
		    url: rutaWS + "Operaciones/Chofer.asmx/LiberarPedidoTracking",
		//url :  "http://localhost:34927/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/LiberarPedidoTracking",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
		data : '{"IDPedidos":"' + IDPedido + '", "IDIncidencia" : ' + $("#incidencia").val() + ' }',       
        //contentType: "xml",
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
		resultado = $.parseJSON(data.d);
			//console.log(resultado);
			$.mobile.loading('hide');
			if ( resultado == 1 ){
			    alerta("Se libero con \u00E9xito");
				getProgramaciones();
				$("#myPopup").popup("close");
			}
        },

        error : function(jqxhr) 
        {
		   console.log(jqxhr);	
           alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });	
	   
    });
	
	
	
		
	
	 
	var pageReturn = window.localStorage.getItem("page");
	//$("#regresarEmpresa").attr("href","empresa.html?idChofer=" + $.QueryString["idChofer"]);
	$("#irTracking").attr("href","panel.html?idChofer=" + $.QueryString["idChofer"] +'&empresa='+ $.QueryString["empresa"] );
	
	 
	
});


function MarcarTodos() {
    $("#listProgramacion input").each(function (index, element) {
        $(this).prop("checked", true).checkboxradio("refresh");
    });
}

function setIncidencias_Tracking(empresa, idestado){
		
	$("#incidencia").html("<option value='0'>Seleccionar Incidencia</option>");
	//$.mobile.loading('show'); 
	$.ajax({
	    url: rutaWS + "Operaciones/Chofer.asmx/Obtener_IncidenciaPorEstado",
        type: "POST",
		cache: false,
		//crossDomain: true,
        dataType : "json",
        data : '{"Empresa":"'+empresa+'", "IDEstado" : '+idestado+'}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			//console.log(data.d);
			resultado = $.parseJSON(data.d);
			$.mobile.loading('hide');			 
			if ( resultado.length > 0 ){				
				for (var i = 0; i<resultado.length;i++){					
					$("#incidencia").append("<option value='"+resultado[i].IDIncidencia+"'>"+resultado[i].Descripcion+"</option>");					
				}
				$("#incidencia").selectmenu('refresh', true);
			}
			else{
			}
        },

        error : function(jqxhr) 
        {	
          alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		 
	
}

function actualizarChofer_borrar(IDPedido,IDChofer){
	
	$.mobile.loading('show');
			$.ajax({
			    url: rutaWS + "Operaciones/Chofer.asmx/actualizarChofer",
				type: "POST",
				//crossDomain: true,
				dataType : "json",
				data : '{"IDPedido":"' + IDPedido + '","IDChofer":"' + IDChofer + '"}',
				//contentType: "xml",
				contentType: "application/json; charset=utf-8",
				success : function(data, textStatus, jqXHR) {
				resultado = $.parseJSON(data.d);
					console.log(resultado);
					$.mobile.loading('hide');
					if ( resultado == 1  ){
						alerta('OC agregada con exito.');
						$("#myPopup").popup("close");
						getProgramaciones();
					}
				},	
				error : function(jqxhr) 
				{
				   console.log(jqxhr);	
				   alerta('Error de conexi\u00f3n, contactese con sistemas!');
				}			
			});
	
}


function alertDismissed(){
}
//

function getProgramaciones(){
	
	
	
	$.mobile.loading('show');
	//alert($.QueryString["idChofer"]);   
	$("#listProgramacion").html("");  
	$("#listProgramacionDAD").html("");  
	$.ajax({
	    url: rutaWS + "Operaciones/Chofer.asmx/ConsultarPedidosPicking",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : '{"IDChofer":"'+$.QueryString["idChofer"]+'", "Empresa":"'+$.QueryString["empresa"]+'"}',
        //contentType: "xml",
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
		resultado = $.parseJSON(data.d);
		
			//console.log(resultado);
			$.mobile.loading('hide');
			if ( resultado.length > 0 ){
				$("#contentProgramaciones").find("h3").remove();
				$("#contentProgramaciones #divTABS").fadeIn("fast");
				var count = 0;
				for (var i = 0; i<resultado.length;i++){
					
					var grupo = "";					
					if ( resultado[i].GrupoTracking  != "" )
						grupo = "[Grupo: #" + resultado[i].GrupoCode + "] <br>";

						//alert(resultado[i].IDEstado);
						if (  resultado[i].IDEstado == 1 )
							$("#listProgramacion").append('<input data-pedido="' + resultado[i].IDPedido +  '" disabled="disabled" type="checkbox" name="checkbox-' + i + '" id="checkbox-' + i + '"><label for="checkbox-' + i + '">'+ grupo + resultado[i].NroOrdenCompra + ' - ' + resultado[i].NombreCliente +'</label> ');
						else {
							 
				 													 
							$("#listProgramacion").append('<input data-pedido="' + resultado[i].IDPedido +  '" type="checkbox" name="checkbox-' + i + '" id="checkbox-' + i + '"><label for="checkbox-' + i + '">'+ grupo + resultado[i].NroOrdenCompra + ' - ' + resultado[i].NombreCliente +'</label> ');								 
						}
						
						$("#listProgramacion input").checkboxradio().checkboxradio("refresh");
						//$("#listProgramacion").find("input").last().checkboxradio().checkboxradio("refresh");
					 
					
				}
				//$( "#listProgramacion" ).listview( "refresh" );
				//$( "#listProgramacionDAD" ).listview( "refresh" );
			}
			else{
				
				$("#contentProgramaciones").find("h3").remove();
				$("#contentProgramaciones").append("<h3>No se encontraron programaci&oacute;nes para el dia de hoy</h3>").hide().fadeIn("fast");
				 
				
			}
        },

        error : function(jqxhr) 
        {
		   //console.log(jqxhr);	
           alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		 
	
}


function alerta(mensaje){
	if ( navigator.notification == null)
		alert(mensaje);
 	else
	 navigator.notification.alert(
            mensaje,  // message
            alertDismissed,         // callback
           'Informaci\u00f3n',            // title
            'Aceptar'                  // buttonName
        	);
	
}
