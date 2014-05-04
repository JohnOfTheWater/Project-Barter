(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#loginPanel').hide();
    $('#myItemsPanel').hide();
    $('.sdescription').hide();
    $('#loginButton').click(showLogin);
    $('#userButton').click(showUserPanel);
    $('#myItems').click(showMyItems);
    //$('#login').click(loginUser);
    $('#close').click(closeUserPanel);
    $('#closeMI').click(closeMyItemsPanel);
    $('#bidButton').click(goBid);
    $('.spicture').mouseenter(showDescription);
    $('.spicture').mouseleave(hideDescription);
    hideWelcome();
    getMyItems();
  }

  //---------IndexPage-------------------------//


  //---------IndexPage-------------------------//
  //---------Animation-------------------------//

  function showDescription(){
    $('.sdescription').fadeIn();
  }

  function hideDescription(){
    $('.sdescription').fadeOut();
  }

  function hideWelcome(){
    $('.welcome').fadeOut(4000);
    $('.welcome2').fadeOut(4000);
  }

  function showMyItems(){
    $('#myItemsPanel').fadeIn('slow');
    $('#search').focus();
    getMyItems();
  }

  function showUserPanel(){
    //var text = $('#userButton').text();
    //if(text === 'Giovanni'){
    //$('#userButton').text('close');
    //}else{
    //$('#userButton').text('Giovanni');
    //}
    //$('#userPanel').fadeToggle('slow');
    $('#userPanel').animate({margin:'+0 +0 +0 +620'},1000);
    $('#search').focus();
    var user = $(this).text();
    getUser(user);
  }

  function closeMyItemsPanel(){
    $('#myItemsPanel').fadeOut('slow');
    $('#search').focus();
  }

  function closeUserPanel(){
    //$('#userPanel').fadeToggle('slow');
    $('#userPanel').animate({margin:'+0 +0 +0 +0'},1000);
    $('#search').focus();
  }


  function showLogin(){
    var text = $('#loginButton').text();
    if(text === 'Register/Login'){
      $('#loginButton').text('close');
    }else{
      $('#loginButton').text('Register/Login');
    }
    $('#loginPanel').fadeToggle('slow');
    $('#userName').focus();
  }
  //---------getMyItems-------------------------//

  function getMyItems(){
    //$.hide();
    //$.remove();
    //var item = actualItem;
    var user = $('#userButt').text();
    //$.replace(/\s/g, '-');
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/myItems/' + user;
    $.getJSON(url, displayMyItems);
  }

  function displayMyItems(data){
    $('.MI').remove();
    for(var i = 0; i < data.items.length; i++){
      appendMyItems(data.items[i]);
    }
  }

  function appendMyItems(item){

    var $name = $('<option>');

    $name.text(item.name).addClass('MI').attr('data-id', item._id);

    $('#select').append($name);
    getBids();
  }

  function getBids(){
    debugger;
    var id = $('.sitem').attr('val');
    $('#searchBidss').fadeIn('slow');
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/searchByBids/'+id;
    $.getJSON(url, displaySearch);
  }

  function displaySearch(data){
    debugger;
    $('.nomeB').remove();
    for(var i = 0; i < data.items.bids.length; i++){
      appendMySearch(data.items.bids[i]);
    }
  }

  function appendMySearch(item){
    debugger;
    //$('.nomeB').remove();

    //var $photo = $('<div>');
    var $name = $('<div>');
    //var $cost = $('<div>');
    //var $owner = $('<div>');


    //$photo.css('background-image', 'url("'+item.photo+'")').attr('data-id', item._id).addClass('fotoS');
    $name.text('- '+item).addClass('nomeB').attr('data-id', item._id);
    //$cost.text('Cost: $'+item.cost).addClass('costoS').attr('data-id', item._id);
    //$owner.text('Owner: '+item.owner).addClass('ownerS').attr('data-id', item._id);

    $('#searchBidss').append($name);
    //$photo.append($name);
    //$name.append($owner);
    //$owner.append($cost);
  }

  //---------getUser-------------------------//

  function getUser(user){
    console.log(user);
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/showuser/' + user;
    $.getJSON(url, displayUser);
  }

  function displayUser(data){
    console.log(data.user.name);
    console.log(data.user.email);
    console.log(data.user.photo);

    $('.photo').remove();
    $('.name').remove();
    $('.email').remove();

    var $photo = $('<div>');
    var $name = $('<div>');
    var $email = $('<div>');

    $photo.css('background-image', 'url("'+data.user.photo+'")').attr('data-id', data.user._id).addClass('photo');
    $name.text('User Name: '+data.user.name).addClass('name').attr('data-id', data.user._id);
    $email.text('Email: '+data.user.email).addClass('email').attr('data-id', data.user._id);

    $('#userP').append($photo);
    $('#userN').append($name);
    $('#userE').append($email);
  }

  //---------goBid-------------------------//

  function goBid(){
    var _id = $('.sitem').attr('val');
    //var name = $('.snome').text();
    var user = $('#userButt').text();
    var bids = $('#select').val();
    //var photo = $('#logo').attr('val');
    //var year = $('.syear').text();
    //year = year.substr(6);
    //var cost = $('.scost').text();
    //cost = cost.substr(7);
    //var description = $('.sdescription').text();
    //description = description.substr(13);
    //var owner = $('.sowner').text();
    //owner = owner.substr(7);
    var data = {_id:_id, bids:bids};
    var url = '/bidItem/'+user;
    var type = 'POST';
    var success = redirect;
    $.ajax({url:url, type:type, data:data, success:success});
  }

  function redirect(data){
    alert('You sussesfully Bid for this Item!');
    var user = data.userName;
    window.location.replace('/user/'+user);
  }

//---------Register/Login----------------------//
/*
  function registerNewUser(event){
    debugger;
    var url = '/register';
    var type = 'POST';
    var data = $('#loginPanel').serialize();
    var success = returnHome;
    $.ajax({url:url, type:type, data:data, success:success});
    event.preventDefault();
  }


  function returnHome(data){
    debugger;
    if (data.error === undefined){
      window.location.replace('/');
    }else{
      alert(data.error);
      $('#userName2').focus();
    }
  }
*/
})();


