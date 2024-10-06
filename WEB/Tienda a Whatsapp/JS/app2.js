
function generarCupon() {
    var longitud = 8; // Reducimos la longitud a 8 porque añadiremos 'r' al principio y '10' al final
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var cupon = 'E'; // Inicializamos el cupón con 'r'
    for ( var i = 0; i < longitud; i++ ) {
      cupon += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    cupon += '35'; // Añadimos '10' al final
    return cupon;
  }
  
  // Obtén los elementos del DOM
  const cuponElement = document.getElementById('cupon');
  const discountCode = document.getElementById('discountCode');
  
  // Obtén el modal
  var modal = document.getElementById('anuncio-modal');
  
  // Cuando se muestra el modal, genera un nuevo código de cupón
  modal.addEventListener('shown.bs.modal', function () {
    // Genera un nuevo código de cupón
    var nuevoCupon = generarCupon();
  
    // Actualiza el valor del cupón en el modal
    if (cuponElement) {
      cuponElement.value = nuevoCupon;
    }
  });
  
  // Añade un evento de clic al botón de copiar
  document.querySelector('#anuncio-modal .btn-primary').addEventListener('click', function() {
    // Copia el valor del cupón
    cuponElement.select();
    document.execCommand('copy');
  
    // Inserta el valor del cupón en el campo de entrada discountCode
    discountCode.value = cuponElement.value;
  });
  
  const headerMenu = document.querySelector('.hm-header');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 80) {
      headerMenu.classList.add('header-fixed');
    } else {
      headerMenu.classList.remove('header-fixed');
    }
  });
  
  if (document.querySelector('.hm-tabs')) {
    const tabLinks = document.querySelectorAll('.hm-tab-link');
    const tabsContent = document.querySelectorAll('.tabs-content');
  
    tabLinks[0].classList.add('active');
  
    if (document.querySelector('.tabs-content')) {
      tabsContent[0].classList.add('tab-active');
    }
  
    for (let i = 0; i < tabLinks.length; i++) {
      tabLinks[i].addEventListener('click', () => {
        tabLinks.forEach((tab) => tab.classList.remove('active'));
        tabLinks[i].classList.add('active');
        tabsContent.forEach((tabCont) => tabCont.classList.remove('tab-active'));
        tabsContent[i].classList.add('tab-active');
      });
    }
  }
  
  const menu = document.querySelector('.icon-menu');
  const menuClose = document.querySelector('.cerrar-menu');
  
  menu.addEventListener('click', () => {
    document.querySelector('.header-menu-movil').classList.add('active');
  });
  
  menuClose.addEventListener('click', () => {
    document.querySelector('.header-menu-movil').classList.remove('active');
  });
  
  var icono = document.querySelector(".hm-icon-cart a");
  
  icono.addEventListener("click", function (e) {
    e.preventDefault();
    var modal = document.getElementById("cartModal");
    modal.modal("show");
  });
  
  
  //----------------------------------------------------------------------------------------------------
  
  
  document.addEventListener('DOMContentLoaded', function () {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
  
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
  
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function (event) {
        event.preventDefault();
  
        const productCard = this.closest('.product-item');
        const productName = productCard.querySelector('h3').textContent;
        const productImage = productCard.querySelector('.card-img-top').src;
        const productPriceText = productCard.querySelector('.precio span').textContent.trim();
  
        const productPrice = extractPrice(productPriceText);
  
        addToCart(productName, productImage, productPrice);
      });
    });
  
    function extractPrice(priceText) {
      const currencySymbols = ['S/', '$', '€'];
      const priceArray = priceText.split(' ');
  
      let price = 0;
  
      for (const item of priceArray) {
        if (!isNaN(parseFloat(item))) {
          price = parseFloat(item);
          break;
        } else {
          for (const symbol of currencySymbols) {
            if (item.includes(symbol)) {
              const number = item.replace(symbol, '');
              price = parseFloat(number);
              break;
            }
          }
        }
      }
  
      return price;
    }
  
    function addToCart(productName, productImage, productPrice) {
      if (cartItems[productName]) {
        cartItems[productName].quantity++;
        cartItems[productName].totalPrice = cartItems[productName].quantity * productPrice;
      } else {
        cartItems[productName] = {
          image: productImage,
          quantity: 1,
          price: productPrice,
          totalPrice: productPrice
        };
      }
  
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCart();
    }
  
    function updateCart() {
      const cartList = document.querySelector('.cart-list');
      const cartTotal = document.querySelector('.cart-total');
      cartList.innerHTML = '';
  
      let grandTotal = 0;
  
      for (const productName in cartItems) {
        const {
          image,
          quantity,
          price,
          totalPrice
        } = cartItems[productName];
  
        const li = document.createElement('li');
        li.classList.add('cart-item');
        li.innerHTML = `
                  <img src="${image}" alt="${productName}" class="cart-item-image">
                  <span class="cart-item-name">${productName}</span>
                  <span class="cart-item-quantity">
                      <button class="cart-item-decrease">-</button>
                      ${quantity}
                      <button class="cart-item-increase">+</button>
                  </span>
                  <span class="cart-item-total-price">$ ${totalPrice.toFixed(2)} us</span>
                  <button class="cart-item-remove">X</button>
              `;
  
        cartList.appendChild(li);
  
        grandTotal += totalPrice;
      }
  
      cartTotal.textContent = `Total: $ ${grandTotal.toFixed(2)} us`;
  
      const cartCounter = document.querySelector('.hm-icon-cart .badge');
      const totalCount = Object.values(cartItems).reduce((acc, item) => acc + item.quantity, 0);
      cartCounter.textContent = totalCount;
    }
  
    const clearCart = () => {
      cartItems = {};
      localStorage.removeItem('cartItems');
      updateCart();
    };
  
    const removeProduct = (productName) => {
      delete cartItems[productName];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCart();
    };
  
    const clearCartButton = document.getElementById("clearCart");
    clearCartButton.addEventListener("click", clearCart);
  
    const cartList = document.querySelector(".cart-list");
    cartList.addEventListener("click", function (event) {
      if (event.target.classList.contains("cart-item-remove")) {
        const productCard = event.target.closest(".cart-item");
        const productName = productCard.querySelector(".cart-item-name").textContent;
        removeProduct(productName);
      } else if (event.target.classList.contains("cart-item-increase")) {
        const productCard = event.target.closest(".cart-item");
        const productName = productCard.querySelector(".cart-item-name").textContent;
        increaseQuantity(productName);
      } else if (event.target.classList.contains("cart-item-decrease")) {
        const productCard = event.target.closest(".cart-item");
        const productName = productCard.querySelector(".cart-item-name").textContent;
        decreaseQuantity(productName);
      }
    });
  
  //--------------------------------------------------------------------------
  
    const sendToWhatsApp = () => {
      const cartItems = document.querySelectorAll('.cart-item');
      let cartProducts = '';
    
      cartItems.forEach(item => {
        const quantity = item.querySelector('.cart-item-quantity').textContent.trim().split('\n')[1].trim();
        const name = item.querySelector('.cart-item-name').textContent.trim();
        cartProducts += `${quantity} ${name}\n`;
      });
    
      const cartTotal = document.querySelector('.cart-total').textContent.trim().split(':')[1].trim();
    
      const discountCode = document.querySelector('#discountCode').value.trim();
    
      const name = document.querySelector('#name').value.trim();
      const recipient = document.querySelector('#recipient').value.trim();
      const recipientPhone = document.querySelector('#recipient-phone').value.trim();
      const street = document.querySelector('#street').value.trim();
      const between = document.querySelector('#between').value.trim();
      const number = document.querySelector('#number').value.trim();
    
      let message = `Hola desde la Cafetería Doña Lucía,\n`;
      message += `Mi nombre es ${name} y he realizado un pedido de:\n`;
      message += `${cartProducts}`;    
      
      message += `Con un total de: ${cartTotal}.\n`;
      
      message += `Mi dirección es: Calle ${street}, entre ${between}, #${number}.\n`;
      message += `Espero su respuesta... saludos.\n`;
    
      const whatsappLink = `https://api.whatsapp.com/send?phone=5363658636&text=${encodeURIComponent(message)}`;
    
      window.open(whatsappLink, '_blank');
    };
    
    const sendButton = document.querySelector('.btn-primary[type="submit"]');
    sendButton.addEventListener('click', sendToWhatsApp);
  
  
  
    const increaseQuantity = (productName) => {
      cartItems[productName].quantity++;
      cartItems[productName].totalPrice = cartItems[productName].quantity * cartItems[productName].price;
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCart();
    };
  
    const decreaseQuantity = (productName) => {
      cartItems[productName].quantity--;
      cartItems[productName].totalPrice = cartItems[productName].quantity * cartItems[productName].price;
      if (cartItems[productName].quantity === 0) {
        delete cartItems[productName];
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCart();
    };
  
    // Cargar los datos del carrito desde el almacenamiento local cuando se carga la página
    updateCart();
  });
  
  //-------------------------------------------------------------------------------------------------------
  
  // funciones con el contador
  
  if(localStorage.getItem('visitCount')) {
    let count = parseInt(localStorage.getItem('visitCount'));
    count++;
    localStorage.setItem('visitCount', count);
    
    if (count > 1) {
      document.getElementById('visit-count').textContent = `¡Bienvenido de nuevo! Nos has visitado ${count} veces. Nos alegra poder ayudarte.`;
    } else {
      document.getElementById('visit-count').textContent = `¡Bienvenido! Esta es tu segunda visita.`;
    }
  
    if (count == 3) {
      // Redirige a la página de registro en la tercera visita
      window.location.href = '';
    } else if (count == 1) {
      // Activar el otro modal en la cuarta visita
      var otroModal = new bootstrap.Modal(document.getElementById('anuncio-modalimagen'), {});
      otroModal.show();
    } else if (count == 4) {
      // Activar el otro modal en la cuarta visita
      var otroModal = new bootstrap.Modal(document.getElementById('anuncio-modalimagen'), {});
      otroModal.show();
    }
  } else {
    localStorage.setItem('visitCount', 1);
  }
  
  function resetCounter() {
    var personalCode = document.getElementById('personalCode').value;
    if(personalCode === predefinedCode) {
      // Reinicia el contador
      localStorage.setItem('visitCount', 0);
      alert("El contador de la página se ha reiniciado.");
      // Actualiza la página
      location.reload();
    } else {
      alert("El código personal ingresado no es correcto.");
    }
  }
  
  //---------------------------------------------------------------------------
  
  // Selecciona todos los elementos que tienen la clase add-to-cart
  var elementos = document.querySelectorAll(".add-to-modal");
  
  // Recorre cada elemento y añade un evento de clic
  elementos.forEach(function(elemento) {
    elemento.addEventListener("click", function(evento) {
      // Evita el comportamiento por defecto del enlace
      evento.preventDefault();
      // Obtiene la imagen del producto
      var imagen = elemento.querySelector("img");
      // Obtiene el atributo src de la imagen
      var src = imagen.getAttribute("src");
      // Obtiene el modal por su id
      var modal = document.getElementById("product-modal");
      // Obtiene la imagen del modal por su id
      var modalImagen = document.getElementById("product-modal-image");
      // Asigna el src de la imagen del producto al src de la imagen del modal
      modalImagen.setAttribute("src", src);
      // Muestra el modal usando el método modal de Bootstrap
      $(modal).modal("show");
    });
  });
  
  //----------------------------------------------------------------------------------------------------------------------------------
  
  /*$(document).ready(function() {
    $('.icon-link').on('click', function(e) {
        e.preventDefault(); // Evita que el enlace se siga como un enlace normal
  
        var url = window.location.href; // obtén la URL del producto
        var title = document.title; // obtén el título del producto
  
        // URLs de compartir para diferentes redes sociales
        var facebookUrl = 'https://www.facebook.com/sharer.php?u=' + url;
        var twitterUrl = 'https://twitter.com/share?url=' + url + '&text=' + title;
        var whatsappUrl = 'https://api.whatsapp.com/send?text=' + title + ' ' + url;
  
        // abre las URLs de compartir en una nueva ventana
        window.open(facebookUrl, '_blank');
        window.open(twitterUrl, '_blank');
        window.open(whatsappUrl, '_blank');
    });
  });*/
  $(document).ready(function() {
    $('.bi-share').click(function(event) {
        event.preventDefault();
  
        var productItem = $(this).closest('.product-item');
        var productName = productItem.find('h3').text();
        var productPrice = productItem.find('.product-price').text();
        var productImage = productItem.find('.card-img-top').attr('src');
        var productUrl = productItem.find('.add-to-modal').attr('href');
  
        $('head').append('<meta property="og:title" content="' + productName + '">');
        $('head').append('<meta property="og:description" content="' + productPrice + '">');
        $('head').append('<meta property="og:image" content="' + productImage + '">');
        $('head').append('<meta property="og:url" content="' + productUrl + '">');
  
        // Aquí puedes agregar tu código para compartir el producto
        // Por ejemplo, puedes abrir una nueva ventana con la URL de compartir de Facebook
         window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(productUrl));
    });
  });
  