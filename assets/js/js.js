const ancho_pantalla = $(window).width();
const year           = new Date().getFullYear();
const alto_cabecera  = $('header').outerHeight(true);

$(document).ready(function(){

    /*** PARA SEPARAR EL NAV DEL PIE ***/
    if( ancho_pantalla > 767 )
    {
        let alto_nav = $('.menu').outerHeight(true);
        $('body').css('padding-bottom', alto_nav+'px');
    }

    /** CARRUSEL/SLIDER - SOBRE MI */
    $('.carrusel_bienvenida .contiene_carrusel').owlCarousel({
        autoplay       : true,
        autoplayTimeout: 7000,
        loop           : true,
        margin         : 0,
        mouseDrag      : false,
        touchDrag      : false,
        pullDrag       : false,
        animateIn      : 'fadeIn',
        animateOut     : 'fadeOut',
        nav            : false,
        dots           : false,
        items          : 1,
    });

    // Fijamos el año
    $('#year').html(year);

    // Opciones del menú cabecera
    $('.menu li').click(function(){
        id      = $(this).attr('id');
        destino = id.substr(3);

        smoothScrollTo(destino);

        $('.menu li').removeClass('active');
        $(this).addClass('active');

        if( ancho_pantalla < 768 )
            $('.menu').removeClass('on');
    });

    // Alto foto contacto
    altoFotoContacto();

    // Submit contacto
    $('#submit').click(function(){
        validarContacto();
    });

    // Pop política
    $('#abrir_politica').click(function(e){
        // // Para evitar que abrir la política marque/desmarque el check
        e.stopPropagation();
        e.preventDefault();

        $('body').addClass('popuped');
    });

    $('.cerrar_popup').click(function(){
        $('body').removeClass('popuped');
    });

    // PARA MÓVIL
    if( ancho_pantalla < 768 )
    {
        /*** FIX PARA EL ZOOM DE BANNER BIENVENIDA **/
        let alto_imagenes_bienvenida = $('.carrusel_bienvenida .contiene_carrusel .img').outerHeight(true);
        $('.carrusel_bienvenida .contiene_carrusel').css('max-height', alto_imagenes_bienvenida+'px');


        /** CARRUSEL/SLIDER - SERVICIOS */
        $('.contiene_artistas').addClass('owl-carousel');
        $('.contiene_artistas').owlCarousel({
            autoplay       : true,
            autoplayTimeout: 7000,
            loop           : true,
            margin         : 0,
            nav            : false,
            dots           : true,
            items          : 1,
        });

        $('.toggle_menu').click(function(){
            $('.menu').addClass('on');
        });

        $('.cerrar_menu').click(function(){
            $('.menu').removeClass('on');
        });
    }
    else
    {
        /*** FIX PARA EL ZOOM DE BANNER BIENVENIDA **/
        $('.carrusel_bienvenida .contiene_carrusel').css('max-height', 'none');

        if( $('.contiene_artistas').hasClass('owl-carousel') )
        {
            $('.contiene_artistas').owlCarousel('destroy'); 
            $('.contiene_artistas').owlCarousel({touchDrag: false, mouseDrag: false});
        }

        $('.menu').removeClass('on');
    }

});

$(window).on('load', function(){ 
    setTimeout(function(){
        $('.loader').fadeOut('slow');
    }, 900);
});

$(window).scroll(function (event) {
    // GESTIÓN DE OPCIONES DEL MENÚ
    let scroll = $(window).scrollTop();
    let opcion = '';
    
    // Posiciones de los contenidos
    inicio   = 0;
    about    = $('#sobre').offset().top;
    artists  = $('#artistas').offset().top;
    trabajos = $('#trabajos').offset().top;
    contact  = $('#contacto').offset().top;

    // Esta referencia es para activar la opción de los proyectos
    alto_ventana   = $(window).outerHeight(true);
    alto_documento = $(document).outerHeight(true);
    offset_bottom  = alto_documento - alto_ventana;

    if( scroll < about )
        opcion = 'go_inicio';
    else if( scroll >= about && scroll < artists )
        opcion = 'go_sobre';
    else if( scroll >= artists && scroll < trabajos )
        opcion = 'go_artistas';
    else if( scroll >= trabajos && scroll < contact && scroll < offset_bottom )
        opcion = 'go_trabajos';
    else
        opcion = 'go_contacto';

    $('.menu li').removeClass('active');
    $('#'+opcion).addClass('active');

    // HSCROLL
    let max_scroll     = $(document).height() - $(window).height();
    let current_scroll = $(window).scrollTop();
    let perc_fill      = (current_scroll * 100) / max_scroll;
    $('.hscroll').css('width', perc_fill + '%');
});

$(window).on('orientationchange', function(){
    if( ancho_pantalla > 767 )
    {
        let alto_nav = $('.menu').outerHeight(true);
        $('body').css('padding-bottom', alto_nav+'px');
    }
});

$(window).on('resize', function(){
    if( ancho_pantalla > 767 )
    {
        let alto_nav = $('.menu').outerHeight(true);
        $('body').css('padding-bottom', alto_nav+'px');
    }
});

const smoothScrollTo = (destino) => {

    if( destino == 'inicio' )
        scroll = 0;
    else
        scroll  = $('#'+destino).position().top + 1;

    $('html, body').animate({
        scrollTop: scroll
    }, 800);
}

const altoFotoContacto = () => {

    let alto_form = $('#contacto form').outerHeight(true);
    $('.foto_contacto img').css('height', alto_form+'px');

    if( ancho_pantalla < 1024 )
        $('.foto_contacto img').css('height', 'auto');

}

const validarContacto = () => {

    let nombre   = $('#contacto input[name="nombre"]');
    let telefono = $('#contacto input[name="telefono"]');
    let email    = $('#contacto input[name="email"]');
    let mensaje  = $('#contacto textarea[name="mensaje"]');
    let politica = $('#contacto input[name="politica"]');

    // Nombre
    if( nombre.val() == '' || nombre.val().length < 2 )
    {
        nombre.addClass('errored');
        nombre.parent().append('<span class="error_form">Introduce tu nombre</span>');
    }
    else
        nombre.removeClass('errored');

    // Teléfono
    if( telefono.val().length > 0 && telefono.val().length < 9 )
    {
        telefono.addClass('errored');
        telefono.parent().append('<span class="error_form">El teléfono no es válido</span>');
    }
    else
        telefono.removeClass('errored');

    // Email
    if( email.val() == '' )
    {
        email.addClass('errored');
        email.parent().append('<span class="error_form">Introduce tu email</span>');
    }
    else
    {
        emailValido = validEmail(email.val());
        if( !emailValido.valid )
        {
            email.parent().append('<span class="error_form">'+ emailValido.msg +'</span>');
            email.addClass('errored');
        }
        else
            email.removeClass('errored'); 
    }

    // Mensaje
    if( mensaje.val() == '' && mensaje.val().length < 5 )
    {
        mensaje.addClass('errored');
        mensaje.parent().append('<span class="error_form">El mensaje es obligatorio (Min. 5 caracteres)</span>');
    }
    else
        mensaje.removeClass('errored');

    // Política
    if( !politica.prop('checked') )
        politica.siblings('.checkbox').addClass('errored');
    else
        politica.siblings('.checkbox').removeClass('errored');

    // Limpiamos los errores flotantes al cabo de 4 segundos
    if( $('.error_form').length > 0 )
    {
        setTimeout(function(){
            $('.error_form').remove();
            $('#contacto input').removeClass('errored');
            $('#contacto textarea').removeClass('errored');
            $('#contacto .checkbox').removeClass('errored');
        }, 4000);
    }
    else
        $('#form_contacto').submit();
}

const validEmail = (email) => {

    let resp = {
        valid: true,
        msg  : ''
    };

    if( email.length < 7 )
        resp.valid = false;
    else
    {
        let index_arroba = email.indexOf('@');
        let index_punto  = email.indexOf('.');

        if( index_arroba === -1 || index_punto === -1 )
            resp.valid = false;
        else
        {
            let division = email.split('@');
            if( division[1].indexOf('.') === -1 )
                resp.valid = false;
        }
    }

    if( !resp.valid )
        resp.msg = 'Email no válido';

    return resp;
}