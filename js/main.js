// Primitive webppl sleep function.
// Don't hog the CPU, yield to let some rendering happen.
// Trampoline the rest of the program after the timeout.
function sleep(store, cc, address, ms) {
  window.setTimeout(function() {
    var trampoline = cc(store, null);
    while(trampoline) { trampoline = trampoline(); }
  }, ms);
}

function readSleep() {
  return parseInt($("#sleep").val());
}

$(function() {
  plot = initPlot(600, 400, [-1,4], [-1,7]);

  plotData = function(data) {
    plot.plotPoints(_.map(data, function(xy) { return {x: xy[0], y: xy[1]}; }));
  };

  plotLinearFunction = function(m, b, klass) {
    plot.plotFunction(function(x) { return m * x + b }, klass);
  };

  samplerCallback = function(val, accepted) {
    plot.clearLines();
    if(accepted) {
      plotLinearFunction(val[0], val[1], "accepted");
    } else {
      plotLinearFunction(val[0], val[1], "rejected");
    }
  };

  var sleepInput = $("#sleep")
  sleepInput.on("change", function(event) {
    $("#currentSleep").val(sleepInput.val());
  });

  $("#run").on("click", function(event) {
    var code = $("#code").val();
    var compiled = webppl.compile(code, true);
    console.log(compiled);
    $("#run").attr("disabled", true);
    eval.call(window, compiled)({}, function(s,val) {
      console.log(val);
      $("#run").attr("disabled", false);
      }, '');
  });

});
