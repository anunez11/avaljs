var campanya=new Array();
var motivos=new Array();

var urlBase="http://172.23.81.6:8080/aval2/resources/";
var urlBaseWs="ws://172.23.81.6:8080/wsAval2/aval?userName=";
var urlServerCrm="http://172.23.81.10:8084/avalgestion/deudor-action.do?";


/*
var urlBase="https://192.168.100.163:8585/aval2/resources/";
var urlBaseWs="wss://192.168.100.163:8585/wsAval2/aval?userName=";
var urlServerCrm="https://172.23.1.18:8585/avalgestion/deudor-action.do?";
*/

var ws;

//ds=JSON.parse('{"contacto":{"nombre":"JUAN BONIFACIO GARAY MAUTINO","orden":"55","id":2227.0,"idLlamada":"1f64a8c000001bd45a9996a834c8000000000000","usuario":"426","cartera":"18930","deudor":"11506289","id_mailing":"238","monto":"1045.00","numero":"954180317"}}');
//console.log(ds.contacto.deudor);

var usuario=$("#usuario").val();

function iniciarPagina(){
	
	
	$.ajax({
         url: urlBase+'acciones/'+usuario+'/esatdoActual',
         type: 'GET',        
         dataType : "json",
		 contentType: "application/json",		 
         crossDomain: true,
        // beforeSend: function( xhr ) {  $.isLoading({ text: "Cargando" });},
         success:function(datos){ 
        	// $.isLoading('hide');
			   if(datos.estado=="ok"){
				   
				    iniFormulario(datos.estadoActual);
					
				   
			   }
			///iniciarPagina();
			
         },
         error: function(objeto, quepaso, otroobj){
         	//iniciarPagina();
         // $.isLoading('hide');
		  //console.log(objeto.responseJSON.message);
		  //alert(objeto.responseJSON.message);
         	
         },
         timeout: 3000000
         }) ; 
	
	      
	
}


function iniFormulario(obj){
	
	console.log(obj);
	
	$("#anexo").val(obj.anexo);
	$("#clave").val(obj.clave);
	
	$("#session").html(obj.conectado);
	$("#status").html(obj.disponible);
	
	
	        if(obj.campanya.length>0) $(".abrir").attr("disabled",false);
			else  $(".abrir").attr("disabled",true);
			
			
			
			for(i=0;i<obj.campanya.length;i++){				
				
			   if(!$("#campanya option[value="+obj.campanya[i].id+"]").is("option"))	$("#campanya").append('<option value="'+obj.campanya[i].id+'">'+obj.campanya[i].name+'</option>');				
			}
	
	
	
	        if(obj.listaCampanyaAbierta.length>0) $(".cerrar").attr("disabled",false);
			else  $(".cerrar").attr("disabled",true);
			
			for(i=0;i<obj.listaCampanyaAbierta.length;i++){	
			
			if(!$("#campanya2 option[value="+obj.listaCampanyaAbierta[i].id+"]").is("option"))	$("#campanya2").append('<option value="'+obj.listaCampanyaAbierta[i].id+'">'+obj.listaCampanyaAbierta[i].name+'</option>');				
				
			}
	
	
			for(i=0;i<obj.motivoPausaLista.length;i++){				
				motivo=obj.motivoPausaLista[i]==obj.motivoPausa ? ' selected ' : '' ;				
				
				if(!$("#motivos_pausa option[value="+obj.motivoPausaLista[i]+"]").is("option")) $("#motivos_pausa").append('<option '+motivo+' value="'+obj.motivoPausaLista[i]+'">'+obj.motivoPausaLista[i]+'</option>');				
			}
 	
	         if($("#div_msg").find(".msgEvento").length!=obj.mensajes.length){
				 
				 			for(i=0;i<obj.mensajes.length;i++){	
			
				$("#div_msg").html("");		
				$("#div_msg").prepend('<div class="msgEvento">'+obj.mensajes[i]+'</div>');					
				
			}
				 
				 
				 
			 }

	
	
	
	
	 //  eventos 
	 
	 if(obj.enLlamada==true){
		 
		 llamarFormularioAval({contacto:obj.contacto})
		 
		 
	 }else{
		 	$("#id_llamar").show();
	        $("#id_colgar").hide();
	 } 
	 
	  setNumero(obj);  // he agregado esot sete el numero
	 
	 if(obj.conectado=='CONECTADO') {
		$(".login").attr("disabled",true);
        $(".logout").attr("disabled",false);		
		$("#div_session").removeClass('bg-gray').addClass('bg-green');
		// ws=WebSocketAval(usuario);
		
	 } 
	 
	 if(obj.disponible=='DISPONIBLE') {
		$(".pausar").attr("disabled",false);
        $(".iniciar").attr("disabled",true);		
		
		$(".abrir").attr("disabled",true);
		$(".cerrar").attr("disabled",true);
		
			$("#div_status").removeClass('bg-red').addClass('bg-green');
		
	 } else{
		 
		    	$("#div_status").removeClass('bg-green').addClass('bg-red');
		 
		 	$(".pausar").attr("disabled",true);
			
				
			
			
			if(obj.campanya.length>0) $(".abrir").attr("disabled",false);
			else  $(".abrir").attr("disabled",true);
			
			
			
			if(obj.listaCampanyaAbierta.length>0){ $(".cerrar").attr("disabled",false);$(".iniciar").attr("disabled",false);	}
			else  $(".cerrar").attr("disabled",true);
		 
	 }
	 
	
	
	
	
}








function loguear(){
	
	
	
	clave=$("#clave").val();
	anexo=$("#anexo").val();
   //  ws=WebSocketAval(usuario);
    if(!validar("loginform")) return false;
	 
	data={agente:usuario,password:clave,anexo:anexo}
	
	
		$.ajax({
         url: urlBase+'acciones/login',
         type: 'POST',
        
		 contentType: "application/json",
         dataType : "json",                    
         crossDomain: true,
		  data: JSON.stringify(data),
           beforeSend: function( xhr ) {
        	
            $.isLoading({ text: "Cargando" });
            $(".login").attr("disabled",true);
            
        }, 
         success:function(datos){ 
        	 
			listarCampanya(usuario);
			listarMotivo(usuario);
			 $.isLoading('hide');
			 $(".logout").attr("disabled",false);
			 $(".abrir").attr("disabled",false);
			
         },
         error: function(objeto, quepaso, otroobj){
         	ws=null;
			$.isLoading('hide');
			$(".login").attr("disabled",false);			
			console.log(objeto.responseJSON.message);
			alert(objeto.responseJSON.message);
     
         	
         },
         timeout: 3000000
         }) ; 
	
	
}

	function WebSocketAval(usuario){
		
		 var url=urlBaseWs+usuario;
		 ws= new WebSocket(url);
		 ws.onopen=function (){		
			   console.log("conectado....");		
		 }
		 
		 ws.onclose=function (){		
		       console.log("desconectado....");
				   
	     }

		 ws.onmessage=function (e){	
	           console.log("msg....");
		       console.log(e);	
			   obj=JSON.parse(e.data);
			   HandlerEvento(obj.events);
			   if(obj.events=='MENSAJE')$("#div_msg").prepend('<div class="msgEvento">'+obj.data.mensage+'</div>');		
			    if(obj.events=='COLGAR'){
					$("#id_llamar").show();
	                $("#id_colgar").hide();
				}

                if(obj.events=='LLAMADA'){
					$("#id_llamar").hide();
	                $("#id_colgar").show();
				}				
			  // if(obj.events=='AGENDA') $("#div_agendados").prepend('<div class="msgEvento">'+obj.data.agendado+'</div>');	
			  if(obj.events=='CONTACTO') llamarFormularioAval(obj.data); //$("#id_contacto").html(JSON.stringify(obj.data));	
			  
			  
			  if(obj.events=='NUMERO'){
				   
				   setNumero(obj.data);   
			   }
			   
			   //else $("#div_log").prepend('<div class="msgEvento">'+obj.message+'</div>');  muesta el log...  de los eventos
			   
		 }

	}

    
	
	
	
    

	function HandlerEvento(evento){
		
		
		switch(evento){
			
			case 'LOGIN' : $("#div_session").removeClass('bg-gray').addClass('bg-green');
			                $("#session").html("CONECTADO");
			break; 
			
			case 'LOGOUT' : $("#div_session").removeClass('bg-green').addClass('bg-gray');
							$("#session").html("NO CONECTADO");
			break;
			
			case 'DISPONIBLE' :  $("#div_status").removeClass('bg-red').addClass('bg-green');
			                     $("#status").html("DISPONIBLE");
			break;
			
			case 'NODISPONIBLE' : $("#div_status").removeClass('bg-green').addClass('bg-red');
			                      $("#status").html(" NO DISPONIBLE");
			break;
			
			
		}
	}
	
	

function desloguear(){
	
	$.ajax({
         url: urlBase+'acciones/'+usuario+'/logout',
         type: 'POST',
         data: JSON.stringify({}),
         dataType : "json",
		 contentType: "application/json",		 
         crossDomain: true,
         beforeSend: function( xhr ) {  $.isLoading({ text: "Cargando" });},
         success:function(datos){ 
        	
			 location.reload();
			
         },
         error: function(objeto, quepaso, otroobj){
         	
          $.isLoading('hide');
		  console.log(objeto.responseJSON.message);
		  alert(objeto.responseJSON.message);
         	
         },
         timeout: 3000000
         }) ; 
	
}


function agendar(user,fecha){
	
	$.ajax({
         url: urlBase+'acciones/'+usuario+'/agendar',
         type: 'POST',
         data: JSON.stringify({agente:user,fecha:fecha}),
         dataType : "json",
		 contentType: "application/json",		 
         crossDomain: true,
         beforeSend: function( xhr ) {  $.isLoading({ text: "Cargando" });},
         success:function(datos){ 
        	 $.isLoading('hide');
			// location.reload();
			
         },
         error: function(objeto, quepaso, otroobj){
         	
            $.isLoading('hide');
         	console.log(objeto.responseJSON.message);
			alert(objeto.responseJSON.message);
			
         },
         timeout: 3000000
         }) ; 
	
}



function colgar(){
	
	$.ajax({
         url: urlBase+'acciones/'+usuario+'/colgar',
         type: 'POST',
         data: JSON.stringify({}),
         dataType : "json",
		 contentType: "application/json",		 
         crossDomain: true,
         beforeSend: function( xhr ) {  $.isLoading({ text: "Cargando" });},
         success:function(datos){ 
        	 $.isLoading('hide');
			// location.reload();
				$("#id_llamar").show();
	            $("#id_colgar").hide();
			
         },
         error: function(objeto, quepaso, otroobj){
         	
            $.isLoading('hide');
		  	console.log(objeto.responseJSON.message);
			alert(objeto.responseJSON.message);
         	
         },
         timeout: 3000000
         }) ; 
	
}

function llamarDiscar(){
	
	$.ajax({
         url: urlBase+'acciones/'+usuario+'/llamar',
         type: 'POST',
         data: JSON.stringify({numero:$("#numero_call").html()}),
         dataType : "json",
		 contentType: "application/json",		 
         crossDomain: true,
         beforeSend: function( xhr ) {  $.isLoading({ text: "Cargando" });},
         success:function(datos){ 
        	 $.isLoading('hide');
			// location.reload();
			
				$("#id_llamar").hide();
	            $("#id_colgar").show();
			
         },
         error: function(objeto, quepaso, otroobj){
         	
          $.isLoading('hide');
		  console.log(objeto.responseJSON.message);
		  alert(objeto.responseJSON.message);
         	
         },
         timeout: 3000000
         }) ; 
	
}



function finalizar(name,resultado,descripcion,estadoNegocio){
	
	$.ajax({
         url: urlBase+'acciones/'+usuario+'/resultados',
         type: 'POST',
         data: JSON.stringify({name:name,value:resultado,descripcion:descripcion,estadoNegocio:estadoNegocio}),
         dataType : "json",
		 contentType: "application/json",		 
         crossDomain: true,
         beforeSend: function( xhr ) {  $.isLoading({ text: "Cargando" });},
         success:function(datos){ 		 
        	  $.isLoading('hide');
			  $("#id_formulario").attr("src","");
			  $("#numero_call").html("");
			  $("#id_contacto").html("");
			  $("#evento_llamada").hide();
			  $("#id_finalizar").hide();
		 },
         error: function(objeto, quepaso, otroobj){
         
            $.isLoading('hide');
         	console.log(objeto.responseJSON.message);
			alert(objeto.responseJSON.message);	
         },
         timeout: 3000000
         }) ; 
	
}

function listarCampanya(usuario){
	
	
	$.ajax({
         url: urlBase+'acciones/'+usuario+'/campanyas',
         type: 'GET',
         //data:data,
         dataType : "json",
         contentType: "application/json",		 
         crossDomain: true,
         beforeSend: function( xhr ) {  $.isLoading({ text: "Cargando" });},
         success:function(datos){ 
        	  $.isLoading('hide');
			campanya=datos.listar;
			
            if(campanya.length>0) $(".abrir").attr("disabled",false);
			else  $(".abrir").attr("disabled",true);
			
			for(i=0;i<campanya.length;i++){
				
				$("#campanya").append('<option value="'+campanya[i].id+'">'+campanya[i].name+'</option>');
				
			}
			
			
         },
         error: function(objeto, quepaso, otroobj){
         	  $.isLoading('hide');
              console.log(objeto.responseJSON.message);
			  alert(objeto.responseJSON.message);
         	
         },
         timeout: 3000000
         }) ; 
	
	
	
	
	
}

function listarMotivo(usuario){
	
	
	$.ajax({
         url: urlBase+'acciones/'+usuario+'/motivos',
         type: 'GET',
         //data:data,
         dataType : "json",
         contentType: "application/json",		 
         crossDomain: true,
         beforeSend: function( xhr ) {  $.isLoading({ text: "Cargando" });},
         success:function(datos){ 
        	  $.isLoading('hide');
			motivos=datos.listar;
			for(i=0;i<motivos.length;i++){
				
				$("#motivos_pausa").append('<option value="'+motivos[i]+'">'+motivos[i]+'</option>');
				
			}
			
			
         },
         error: function(objeto, quepaso, otroobj){
         	  $.isLoading('hide');
              console.log(objeto.responseJSON.message);
			  alert(objeto.responseJSON.message);
         	
         },
         timeout: 3000000
         }) ; 
	
	
	
	
	
}



function cerrarCampayaAjax(id,nombre){
	
	$.ajax({
         url: urlBase+'acciones/'+usuario+'/campanyas/'+id+'/cerrar',
         type: 'POST',
         data: JSON.stringify({}),
		 contentType: "application/json",
         dataType : "json",                    
         crossDomain: true,
         beforeSend: function( xhr ) {  $.isLoading({ text: "Cargando" });},
         success:function(datos){ 
        	
				$("#campanya").append('<option value="'+id+'">'+nombre+'</option>');
				
				  $.isLoading('hide');

			$('#campanya2 option').each(function() {
				if ( $(this).val() == id ) $(this).remove();		
			});
			
				if($('#campanya').find("option").length>0) $(".abrir").attr("disabled",false);
				else  $(".abrir").attr("disabled",true);
				
				if($('#campanya2').find("option").length>0) $(".cerrar").attr("disabled",false);
				else {
					
					$(".cerrar").attr("disabled",true);
					$(".iniciar").attr("disabled",true);
				} 
			
         },
         error: function(objeto, quepaso, otroobj){
         	
            $.isLoading('hide');
         	console.log(objeto.responseJSON.message);
			alert(objeto.responseJSON.message);
         },
         timeout: 3000000
         }) ; 
	
	
	
}



function abrirCampayaAjax(id,nombre){
	
	$.ajax({
         url: urlBase+'acciones/'+usuario+'/campanyas/'+id+'/abrir',
         type: 'POST',
		 contentType: "application/json",
         data: JSON.stringify({}),
		 contentType: "application/json",
         dataType : "json",                    
         crossDomain: true,
         beforeSend: function( xhr ) { $.isLoading({ text: "Cargando" });},
         success:function(datos){ 
        	     $.isLoading('hide');
				$("#campanya2").append('<option value="'+id+'">'+nombre+'</option>');
			    $('#campanya option').each(function() {
				   if ( $(this).val() == id ) $(this).remove();		
			    });
				
				if($('#campanya').find("option").length>0) $(".abrir").attr("disabled",false);
				else  $(".abrir").attr("disabled",true);
				
				if($('#campanya2').find("option").length>0){
					 $(".iniciar").attr("disabled",false);
					 $(".cerrar").attr("disabled",false);
				} 
				else  $(".cerrar").attr("disabled",true);
				
         },
         error: function(objeto, quepaso, otroobj){
         	
             $.isLoading('hide');
			 console.log(objeto.responseJSON.message);
			 alert(objeto.responseJSON.message);
         	
         },
         timeout: 3000000
         }) ; 
	
	
	
}



function iniciarCampanyaAjax(idCampanya){
	$.ajax({
         url: urlBase+'acciones/'+usuario+'/campanyas/'+idCampanya+'/iniciar',
         type: 'POST',
         data: JSON.stringify({}),
         dataType : "json",
         contentType: "application/json",		 
         crossDomain: true,
         beforeSend: function( xhr ) {$.isLoading({ text: "Cargando" });},
         success:function(datos){ 
        	
			$.isLoading('hide');
			$(".iniciar").attr("disabled",true);
			$(".pausar").attr("disabled",false);
			
			$(".abrir").attr("disabled",true);
			$(".cerrar").attr("disabled",true);
			
         },
         error: function(objeto, quepaso, otroobj){
         	
               $.isLoading('hide');
			   console.log(objeto.responseJSON.message);
			   alert(objeto.responseJSON.message);
         	
         },
         timeout: 3000000
         }) ; 
}


function pausarCampanyaAjax(idCampanya,motivo){
		$.ajax({
         url: urlBase+'acciones/'+usuario+'/campanyas/'+idCampanya+'/pausar',
         type: 'POST',
         data: JSON.stringify({motivo:motivo}),
         dataType : "json",  
         contentType: "application/json",		 
         crossDomain: true,
         beforeSend: function( xhr ) {		
           $.isLoading({ text: "Cargando" });		 
		 },
         success:function(datos){ 		
            $.isLoading('hide');
		   $(".iniciar").attr("disabled",false);
			$(".pausar").attr("disabled",true);	

                if($('#campanya').find("option").length>0) $(".abrir").attr("disabled",false);
				else  $(".abrir").attr("disabled",true);
				
				if($('#campanya2').find("option").length>0)$(".cerrar").attr("disabled",false);				
				else  $(".cerrar").attr("disabled",true);
				

			
         },
         error: function(objeto, quepaso, otroobj){
			 $.isLoading('hide');
			 console.log(objeto.responseJSON.message);
			 alert(objeto.responseJSON.message);
         },
         timeout: 3000000
         }) ; 
}


function llamar(){
	
	$("#modal_llamada").modal({backdrop:'static'})
    $("#modal_llamada").modal("show");
    $("#modal_llamada").on('hidden.bs.modal', function (e) {
    	
  	 }) 
				
}

function setNumero(data){
	console.log(data);
	$("#numero_call").html(data.numero);				
}

function setContacto(data){
	console.log(data);
	$("#id_contacto").html(data.contacto.nombre);
}


function abrir(){
	
	$("#campanya").find("option:selected").each(function(i,e){				
		abrirCampayaAjax($(e).val(),$(e).html());		
	});
	
	
}

function cerrar(){
	
	$("#campanya2").find("option:selected").each(function(i,e){				
		cerrarCampayaAjax($(e).val(),$(e).html());		
	});
	
	
}

function llamarFormularioAval(o){
	$("#evento_llamada").show();
	$("#id_finalizar").show();
    setContacto(o);
	
	$("#id_llamar").hide();
	$("#id_colgar").show();
	if($("#id_formulario").attr("src")=="") $("#id_formulario").attr("src",urlServerCrm+"deudor="+o.contacto.deudor+"&cartera="+o.contacto.cartera+"&usuario="+o.contacto.usuario+"&method=mostrarGestionAltitude&tipoLlamada=&id_llamada="+o.contacto.idLlamada+"&cNro_Telef="+o.contacto.numero+"&altitudeInt=1");
	
}


function iniciar(){
	
	
	
	$("#campanya2").find("option").each(function(i,e){
		iniciarCampanyaAjax($(e).val());
	});
	
	
}

function pausar(){
		
	if(!notSelect($("#motivos_pausa"))){alert("seleccione un motivo de pausa"); return false;   } 
	idMotivo=$("#motivos_pausa").val();
	$("#campanya2").find("option").each(function(i,e){	
     	 pausarCampanyaAjax($(e).val(),idMotivo);
	});
	
	
}

function notNull(obj){
	
	if($.trim(obj.val())=="")return false; 
    else return true;
}

function notSelect(obj){
	if($.trim(obj.find("option:selected").val())!="") return true;
    else return false ;
}

function validar(clase){
	r=true;
	val=0;
	$("."+clase).find(".validar").each(function(i,e){
		
	           if($(e).is("input") && !$(e).attr("disabled")  ){ //  valores no null texto
	              if(!notNull($(e))){  val++ ; alert(eval($(e).attr('data-msg'))+""); $(e).focus() ;  return false ;}               
	           }
	          
				
	           if(!$(e).is("select") && !$(e).attr("disabled")  ){ //  valores no null texto
			      if(notSelect($(e))){  val++ ; alert(eval($(e).attr('data-msg'))+""); $(e).focus() ;  return false ;}    
	                         
	           }
	});
	if(val>0) return false;
    return r;
	
}


 
  setInterval(function(){ iniciarPagina(); }, 1000);

$(".logout").attr("disabled",true);
$(".abrir").attr("disabled",true);
$(".cerrar").attr("disabled",true);
$(".iniciar").attr("disabled",true);
$(".pausar").attr("disabled",true);

$("#evento_llamada").hide();
$("#id_finalizar").hide();
 //$(".dateTimeMask").inputmask("dd/mm/yyyy" );
  $('.dateTimeMask').mask('00/00/0000 00:00:00');
/*========================  MESAJES DE VALIDACION ======================== */
msg1="El campo usuario es requerido";
msg2="El campo clave es requerido";
msg3="El campo anexo es requerido";
msg4="El campo motovos de pausa es requerido";