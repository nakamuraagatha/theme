var variants = {},
defaultVariant = null,
addVariant = function(variant){
  variant.key = '';
  $.each(variant.options, function(key, value) {
    var norm_value = value.replace(/ |\//g, '');
    variant.key += norm_value;
    $('select.' + key).filter(function(select) {
      return $(this).find("option." + norm_value).length !== 1;
    })
      .append('<option class="' + norm_value +'" value="' + norm_value + '">' + value + '</option>')
      .each(function(select) {
        var toggle = $(this).find("option").size() > 1;
        $(this).parent('li').toggle(toggle);
      });
  });
  variants[variant.key] = variant;
},
showVariantDetails = function(event, variant) {
  if(variant) {
    $(this).val(variant.id);
    $('form').toggleClass('unavailable', !variant.available);
    $('.product-price').html(variant.price);
  }
  else {
    $('form').addClass('unavailable');
  }
};

$('#options select.option').on('change', function(event){
  var key = $('#options select.option').map(function(index, option) {
    return $(this).val();
  }).toArray().join('');
  $('#product-select').trigger('changeVariant', variants[key]);
});


$('#product-select').on('change', function(event, variant) {
  var select = $(this),
  id = select.val();
  $.each(variants, function(key, variant) {
    if(variant.id == id) {
      select.trigger('changeVariant', variant);
    }
  });
}).on('changeVariant', showVariantDetails);
