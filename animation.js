$(document).ready(function() {
    var btn = $('.button')
    btn.click(function() {
      btn.toggleClass('paused')
      return false
    })
  })