(function(e){
    e.closest = e.closest || function(css){
      var node = this;
      
      while (node) {
         if (node.matches(css)) return node;
         else node = node.parentElement;
      }
      return null;
    }
   })(Element.prototype);
   var d = document,
       itemBox = d.querySelectorAll('.item_box'), 
       cartCont = d.getElementById('cart_content'); 
   function addEvent(elem, type, handler) {
       if (elem.addEventListener) {
           elem.addEventListener(type, handler, false);
       } else {
           elem.attachEvent('on' + type, function() {
               handler.call(elem);
           });
       }
       return false;
   }
   function getCartData() {
       return JSON.parse(localStorage.getItem('cart'));
   }
   function setCartData(o) {
       localStorage.setItem('cart', JSON.stringify(o));
       return false;
   }
   function addToCart(e) {
       this.disabled = true; 
       var cartData = getCartData() || {}, 
           parentBox = this.parentNode, 
           itemId = this.getAttribute('data-id'), 
           itemTitle = parentBox.querySelector('.item_title').innerHTML, 
           itemPrice = parentBox.querySelector('.item_price').innerHTML, 
                                   itemAmount = +(parentBox.querySelector('.amount').value || 1); 
                   if (!itemId) {
                           var param = parentBox.querySelector('input[type=radio]:checked');
                           if (!param) {
                                   alert('Выберите тип товара');
                                   return false;
                           }
                           itemId = param.value;
                           itemTitle += ' (' + param.getAttribute('data-param') + ')';                    
                   }
       if (cartData.hasOwnProperty(itemId)) {
           cartData[itemId][2] += itemAmount;
       } else {
           cartData[itemId] = [itemTitle, itemPrice, itemAmount];
       }
       if (!setCartData(cartData)) { 
           this.disabled = false;
       }
       var cartData = getCartData(), 
           totalItems = '',
           totalCount = 0,
           totalSum = 0;
       if (cartData !== null) {
           totalItems = '<table class="shopping_list"><tr><th>Наименование</th><th>Цена</th><th>Кол-во</th><th></th></tr>';
           for (var items in cartData) {
               totalItems += '<tr>';
               for (var i = 0; i < cartData[items].length; i++) {
                   if (i == 1) {
                       totalItems += '<td align="right">' + cartData[items][i] + '</td>';
                   } else {
                       totalItems += '<td>' + cartData[items][i] + '</td>';
                   };
               }
               totalSum += cartData[items][1] * cartData[items][2];
               totalCount += cartData[items][2];
               totalItems += '<td><span class="del_item" data-id="' + items + '"></span></td>';
               totalItems += '</tr>';
           }
           totalItems += '<tr><td><strong>Итого</strong></td><td align="right"><span id="total_sum">' + totalSum + '</span>грн.</td><td><span id="total_count">' + totalCount + '</span> шт.</td><td></td></tr>';
           totalItems += '</table>';
           cartCont.innerHTML = totalItems;
       } else {
           cartCont.innerHTML = '   В корзине пусто!';
       }
       return false;
   }
   for (var i = 0; i < itemBox.length; i++) {
       addEvent(itemBox[i].querySelector('.add_item'), 'click', addToCart);
   }
   function openCart(e) {
       var cartData = getCartData(), 
           totalItems = '',
           totalCount = 0,
           totalSum = 0;
       if (cartData !== null) {
           totalItems = '<table class="shopping_list"><tr><th>Товары в корзине</th><th>Цена</th><th>Кол-во</th><th></th></tr>';
           for (var items in cartData) {
               totalItems += '<tr>';
               for (var i = 0; i < cartData[items].length; i++) {
                   if (i == 1) {
                       totalItems += '<td align="right">' + cartData[items][i] + '</td>';
                   } else {
                       totalItems += '<td>' + cartData[items][i] + '</td>';
                   };
               }
               totalSum += cartData[items][1] * cartData[items][2];
               totalCount += cartData[items][2];
               totalItems += '<td><span class="del_item" data-id="' + items + '"></span></td>';
               totalItems += '</tr>';
           }
           totalItems += '<tr><td><strong>Итого</strong></td><td align="right"><span id="total_sum">' + totalSum + '</span>грн.</td><td><span id="total_count">' + totalCount + '</span> шт.</td><td></td></tr>';
           totalItems += '</table>';
           cartCont.innerHTML = totalItems;
       } else {
           cartCont.innerHTML = '   В корзине пусто!';
       }
       return false;
   }
   addEvent(d.getElementById('checkout'), 'click', openCart);
   addEvent(d.getElementById('clear_cart'), 'click', function(e) {
       localStorage.removeItem('cart');
       cartCont.innerHTML = 'Корзина очишена.';
   });
   [].forEach.call(document.querySelectorAll('.item_box input[type=radio]'), function(inp){
           addEvent(inp, 'change', function(){
                   var parentBox = this.closest('.item_box');
                   parentBox.querySelector('.item_price').textContent = this.getAttribute('data-price');
                   parentBox.querySelector('.amount').value = 1;
           })
   });



   