var socket = io();

$('#message').keydown(function(key) {
  if (key.keyCode == 13)
    $('#send').click();
});

$('#send').click(function() {

  var bidValue = parseFloat(parseFloat($('#bid').val()).toFixed(2));
  if (isNaN(bidValue)) {
    alert('Place a bid!')
    return;
  }
  var url = '/api' + window.location.pathname + '/placeBid'

  $.ajax({
    url: url,
    type: 'post',
    dataType: 'json',
    data: $('form#bidForm').serialize(),
    success: function(highestBid) {
      renderBid(highestBid);
    }
  });
});

socket.on('highest-bid', function(highestBid) {
  renderBid(highestBid);
});

function renderBid(bid) {
  $('#value').html(bid.value);
  $('#client #name').html(bid.client.username);
  $('#client #country').html(bid.client.country);

}
