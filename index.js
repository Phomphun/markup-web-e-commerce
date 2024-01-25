var product = [{
    id: 1,
    img: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2031&q=80',
    name: 'White shoe',
    price: 1500,
    description: ' White shoe description ',
    type: 'shoe'
}, {
    id: 2,
    img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
    name: 'White shirt',
    price: 750,
    description: ' white shirt description ',
    type: 'shirt'
}, {
    id: 3,
    img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1036&q=80',
    name: 'White hat',
    price: 500,
    description: ' white hat description ',
    type: 'hat'
}];

$(document).ready(() => {                  /*show product*/
    var html = '';
    for (let i = 0; i < product.length ; i++){
        html += `<div onclick="opencard(${i})" class="content-item ${product[i].type}">
                    <img class="content-img" src="${product[i].img}" alt="">
                    <p style="font-size: 1.2vw;">${product[i].name}</p>
                    <p style="font-size: 0.9vw;">${numberWithCommas(product[i].price)} THB</p>
                 </div>`;
    }
    $("#productlist").html(html);
})

function numberWithCommas(x) {  
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function searchmenu(elem){                      /*search product*/
    var valua = $(`#`+elem.id).val()    

    var html = '';
    for (let i = 0; i < product.length ; i++){
        if( product[i].name.includes(valua) ){
        html += `<div opencard(${i}) class="content-item ${product[i].type}">
                    <img class="content-img" src="${product[i].img}" alt="">
                    <p style="font-size: 1.2vw;">${product[i].name}</p>
                    <p style="font-size: 0.9vw;">${numberWithCommas(product[i].price)} THB</p>
                 </div>`;
    }
    if(html == ''){
        $("#productlist").html('<p>Not found</p>')
    }else{
        $("#productlist").html(html);
    }   
}
}

function searchproduct(param){                              /*search type of product*/
    $(".content-item").css('display','none')
    if(param == 'all'){
        $(".content-item").css('display','block')
    }else{
        $("."+param).css('display','block')
    }
}

var productindex = 0;
function opencard(index){                                       /*open product modal*/
    productindex = index;
    $("#modalDesc").css("display","flex")
    $("#mdd-img").attr('src',product[index].img);
    $("#mdd-name").text(product[index].name);
    $("#mdd-price").text(numberWithCommas(product[index].price) + ' THB');
    $("#mdd-desc").text(product[index].description);
}

function closeModal(){
    $(".modal").css("display","none")
}

var cart = [];
function addtocart() {                  /*add product to cart*/
    var pass = true;

    for (let i = 0; i < cart.length; i++) {
        if( productindex == cart[i].index ) {
            console.log('found same product')
            cart[i].count++;
            pass = false;
        }
    }

    if(pass) {
        var obj = {
            index: productindex,
            id: product[productindex].id,
            name: product[productindex].name,
            price: product[productindex].price,
            img: product[productindex].img,
            count: 1
        };
        cart.push(obj)
    }
    console.log(cart)

    Swal.fire({                                           /*Alert add product to cart success*/                      
        icon: 'success',
        title: 'Add ' + product[productindex].name + ' to cart !'
    })
    $("#cartcount").css('display','flex').text(cart.length)
}

function opencart(){                                        /*open cart*/  
    $('#modalCart').css('display','flex')
    rendercart()
}

function rendercart(){                                      /*render cart*/  
    if(cart.length > 0){
        var html = '';
        for (let i = 0;i < cart.length; i++ ){
            html += `<div class="cartlist-item">
                            <div class="cartlist-left">
                                <img src="${cart[i].img}" alt="">
                                <div class="cartlist-detail">
                                    <p style="font-size: 1.5vm;">${cart[i].name}</p>
                                    <p style="font-size: 1.2vm;">${numberWithCommas(cart[i].price * cart[i].count)}</p>
                                </div>
                            </div>
                            <div class="cartlist-right">
                                <p onclick="deinitems('-',${i})" class="btnc">-</p>
                                <p id="countitems"${i} style="margin: 0 20px;">${cart[i].count}</p>
                                <p onclick="deinitems('+',${i})" class="btnc">+</p>
                            </div>
                    </div>`;
        }
        $("#mycart").html(html)
    }else{
        $("#mycart").html(`<p>Not found product list</p>`)
    }
}

function deinitems(action, index) {                                 /*decrease,increase item in cart*/  
    if(action == '-') {
        if(cart[index].count > 0) {
            cart[index].count--;
            $("#countitems"+index).text(cart[index].count)

            if(cart[index].count <= 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Are you sure to delete?',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel'
                }).then((res) => {
                  if(res.isConfirmed) {
                     cart.splice(index, 1) 
                     console.log(cart)
                     rendercart();
                     $("#cartcount").css('display','flex').text(cart.length)
                     
                     if(cart.length <= 0) {                                    /*delete item in cart*/
                        $("#cartcount").css('display','none')
                     }
                  }  
                  else {
                    cart[index].count++;
                    $("#countitems"+index).text(cart[index].count)
                    rendercart();
                  }
                })
            }
            rendercart();
        }
        
    }
    else if(action == '+') {                                        /*increase item in cart*/
        cart[index].count++;
        $("#countitems"+index).text(cart[index].count)
        rendercart();
    }
}