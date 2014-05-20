// Generated by CoffeeScript 1.6.3
var began_with, data, endsWith, killed, learn, make_suffix, min_count, min_percentage, nice, original, rules, test_accuracy;

min_count = 8;

min_percentage = 70;

require("dirtyjs");

data = require("./data").data;

original = JSON.parse(JSON.stringify(data));

began_with = data.length;

make_suffix = function(str, k) {
  if (k == null) {
    k = 3;
  }
  return str.substr(str.length - k, str.length);
};

endsWith = function(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

rules = [];

learn = function(size, min_count, min_percentage) {
  var found, killed, obj, remains, values;
  if (size == null) {
    size = 3;
  }
  if (min_count == null) {
    min_count = min_count;
  }
  if (min_percentage == null) {
    min_percentage = min_percentage;
  }
  obj = {};
  data.forEach(function(a) {
    var suf;
    suf = make_suffix(a[0], size);
    if (suf.length === size) {
      if (!obj[suf]) {
        obj[suf] = [];
      }
      return obj[suf].push(a[1]);
    }
  });
  values = [];
  Object.keys(obj).forEach(function(k) {
    obj[k] = obj[k].topkp();
    return obj[k].forEach(function(o) {
      o.confidence = o.percent * o.count;
      o.percent = parseInt(o.percent);
      o.count = parseInt(o.count);
      o.key = k;
      o.size = size;
      return values.push(o);
    });
  });
  values = values.filter(function(o) {
    return o.key && o.value && o.percent > min_percentage && o.count > min_count;
  });
  values = values.sort(function(a, b) {
    return b.confidence - a.confidence;
  });
  rules = rules.concat(values);
  found = values.reduce(function(h, o) {
    h[o.key] = true;
    return h;
  }, {});
  remains = data.filter(function(arr) {
    var suf;
    suf = make_suffix(arr[0], size);
    return !found[suf];
  });
  killed = data.length - remains.length;
  console.log("size: " + size + "  - killed-off " + killed + "(" + (parseInt((killed / began_with) * 100)) + "%) with new " + values.length + " rules");
  data = remains;
  return values;
};

min_count = parseInt(began_with * 0.01);

console.log(min_count);

learn(3, min_count, 90);

learn(2, min_count, 90);

min_count = 10;

learn(4, min_count, min_percentage);

learn(3, min_count, min_percentage);

learn(2, min_count, min_percentage);

learn(1, min_count, min_percentage);

test_accuracy = function() {
  var arr, caught, r, right, wrong, _i, _j, _len, _len1;
  right = 0;
  wrong = 0;
  caught = 0;
  for (_i = 0, _len = original.length; _i < _len; _i++) {
    arr = original[_i];
    for (_j = 0, _len1 = rules.length; _j < _len1; _j++) {
      r = rules[_j];
      if (endsWith(arr[0], r.key)) {
        caught += 1;
        if (r.value === arr[1]) {
          right += 1;
        } else {
          wrong += 1;
        }
        break;
      }
    }
  }
  return console.log("cought " + caught + " of " + began_with + " rows(" + ((caught / began_with).toFixed(2)) + "% recall)  - " + right + " right, " + wrong + " wrong -  (" + ((right / caught).toFixed(2)) + "% accuracy)");
};

killed = began_with - data.length;

console.log("found " + rules.length + " rules, kills " + killed + " (" + (parseInt((killed / began_with) * 100)) + "%)");

test_accuracy();

nice = {};

rules.forEach(function(r) {
  return nice[r.key] = r.value;
});

console.log(JSON.stringify(nice, null, 2));
