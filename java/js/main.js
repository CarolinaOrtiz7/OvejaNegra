
class Remera {

  constructor(obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.price = parseFloat(obj.price);
      this.extra = [];
      this.info = obj.info;
      this.imgRoute = obj.imgRoute;
  }
}

const PREFIX = "productoID";

//funcion para guardar el localStorage

const saveLocal = (key, value) => { localStorage.setItem(key, value) };

//declaro variables globales

let cart = [];
let producto = [];

//obtengo el elemento donde irán las cards con el producto

let remeraSection = document.getElementById("producto-items");

//Me fijo si quedaron items en el local Storage y se los paso al carrito.

function getCartFromLocal() {

  if (localStorage.getItem("cart")) {
      const almacenados = JSON.parse(localStorage.getItem("cart"));
      for (const item of almacenados) {
          let localRemera = new Remera(item);

          
          let alreadyInCart = false;
          for (const item of cart) {
              if (item.id == localRemera.id) {
                  alreadyInCart = true;
              }
          }
          
          if (!alreadyInCart) {
              let cartDiv = document.getElementById("cart");
              cartDiv.appendChild(createCartItem(item));
              addCartItemListener(new Remera(item));
              
          } else {
              let number = document.getElementById(localRemera.id + "number");
              number.innerHTML = ((parseInt(number.innerHTML)) + 1).toString();
              updateTotal();
          }

          cart.push(localRemera);
      }
  }
}

//Recorro el menu en data.js y creo una card por cada item dentro de el

for (const remera of CATALOGO) {
  let remeraObject = new Remera(remera);
  producto.push(remeraObject);
}

producto.sort(compareAZ);

function compareAZ(a, b) {
  if (a.name < b.name) {
      return -1;
  }
  if (a.name > b.name) {
      return 1;
  }
  return 0;
}


//plantilla para la card del catalogo

    for (const remera of producto) {
        $("#producto-items").append(
           `<div class='card-body'> 
       <div class='clothes-image' style="background-image: url('${remera.imgRoute}')"></div> <h5 class='card-title'>${remera.name}</h5> <p class='card-text'> <div class='price-box'> <p id='item-price'>$${remera.price}</p> </div> <button type="button" class="addToCartButton" value="${remera.id}">Agregar al carrito</button> </div> </div>`);
        
   
    }



          

//le agrego un event listener a cada botón de las cards


function addMenuListener() {
  let addToCartButton = document.getElementsByClassName("addToCartButton");
  for (var i = 0; i < addToCartButton.length; i++) {
      addToCartButton[i].addEventListener("click", addProduct);
  }

}

addMenuListener();


//FUNCION AGREGAR PRODUCTO

function addProduct(e) {
  let cartDiv = document.getElementById("cart");

  
  let remera;
  for (const it of producto) {
      if (it.id == e.target.value) {
          remera = it;
      }
  }


  let alreadyInCart = false;
  cart.forEach(it => {
      if (remera.id == it.id) {
          alreadyInCart = true;
      }
  });


  if (!alreadyInCart) {
      cartDiv.appendChild(createCartItem(remera));
      cart.push(remera);
      alert("Se ha agregado un " + remera.name + " a tu orden.");
      addCartItemListener(remera); 


  } else { 
      cart.push(remera);
      let number = document.getElementById(remera.id + "number");
      number.innerHTML = ((parseInt(number.innerHTML)) + 1).toString();
  }
  updateTotal();
  saveLocal("cart", JSON.stringify(cart));

}

function addCartItemListener(remera) {

    
    let plusIcon = $("#sumar" + remera.id);
    plusIcon.on("click", function sumarProducto(e) {
        let remera;
        
        for (const it of producto) {
            if (it.id == e.currentTarget.value) {
                remera = it;
            }
        }
        cart.push(remera);

        let number = document.getElementById(remera.id + "number");
        number.innerHTML = ((parseInt(number.innerHTML)) + 1).toString();
        updateTotal();
        console.log("sumado un" + remera.name);
        console.log(cart);
        saveLocal("cart", JSON.stringify(cart));
    });

    
    let minusIcon = $("#restar" + remera.id);
    minusIcon.on("click", function restarProducto(e) {
        let remera;
        
        for (const it of producto) {
            if (it.id == e.currentTarget.value) {
                remera = it;
            }
        }

     
        let deleted = false;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id == remera.id && !deleted) {
                console.log("borrado un" + remera.name);
                cart.splice(i, 1);
                saveLocal("cart", JSON.stringify(cart));
                deleted = true;
                break;
            }
        }

        console.log(cart);

      
        let number = document.getElementById(remera.id + "number");
        if (number.innerHTML == 1) {
            console.log(remera.id);
            let cardToDelete = document.getElementById("productoID" + remera.id);
            cardToDelete.parentElement.removeChild(cardToDelete);
        } else {
            number.innerHTML = ((parseInt(number.innerHTML)) - 1).toString();
        }

        updateTotal();
        saveLocal("cart", JSON.stringify(cart));
    });

}





function createCartItem(remera) {
    let cartDiv = document.createElement("div");
    cartDiv.id = `productoID${remera.id}`;
    cartDiv.className = "cartItem-container";
    cartDiv.innerHTML =
        `<div class="cartItem">
      <div class="cartItem-right">
        <div class="controls">
            <button id="restar${remera.id}" value="${remera.id}"><i class="fas fa-minus fa-xs"></i></button>
            <button id="sumar${remera.id}" value="${remera.id}"><i class="fas fa-plus fa-xs"></i></button>
        </div>
            <strong><p id="${remera.id}number">1</p></strong>
            <p>${remera.name}</p>
      </div>
      <div class="cartItem-left">
            <p>$${remera.price}</p>
      </div>
    </div>`;
    return cartDiv;

}


//cierro carrito

let closeCartButton = document.getElementById("close-cart");
closeCartButton.addEventListener("click", function closeCart() {
    let cartDiv = document.getElementById("cart-container");
    cartDiv.style.display = "none";
});
//abro carrito

let showCartButton = document.getElementById("show-cart");
showCartButton.addEventListener("click", function showCart() {
    let cartDiv = document.getElementById("cart-container");
    cartDiv.style.display = "flex";
})

//ver el total
function updateTotal() {
    let total = 0;
    for (let product of cart) {
        total += product.price;
    }
    let outputTotal = document.getElementById("total");
    outputTotal.innerText = "$" + total;
}

let checkoutDiv = document.getElementById("checkout-container");

let checkoutButton = document.getElementById("checkout");
checkoutButton.addEventListener("click", function checkout() {

    if (cart.length == 0) {
        alert("Aún no tienes productos en tu carrito");
    } else {
        let cartDiv = document.getElementById("cart-container");
        cartDiv.style.display = "none";
        checkoutDiv.style.display = "flex";
    }

})

let closeCheckOut = document.getElementById("close-checkout");
closeCheckOut.addEventListener("click", function closeCheckOut() {

    checkoutDiv.style.display = "none";
    let form = document.getElementById("form");
    form.style.display = "block";

})

let submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", function submit(e) {
    e.preventDefault();
    let form = document.getElementById("form");
    form.style.display = "none";

})

function compareAZ(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

function compare01(a, b) {
    if (a.price < b.price) {
        return -1;
    }
    if (a.price > b.price) {
        return 1;
    }
    return 0;
}

function compare10(a, b) {
    if (a.price < b.price) {
        return 1;
    }
    if (a.price > b.price) {
        return -1;
    }
    return 0;
}






$("h2").fadeOut("slow",function(){

    $("h2").fadeIn(2000);
});



$(document).ready(function(){

    const APIURL = 'https://jsonplaceholder.typicode.com/posts';

    const infoPost = {email:"123@gmail.com"}

    $("#suscripcion").click(() => {

        
 $.ajax({

method:"POST",
url:APIURL,
data:infoPost,

success: function (data) { alert('Datos enviados'); } 




       }) 
       
     
    })

})
