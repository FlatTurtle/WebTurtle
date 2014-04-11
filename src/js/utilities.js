
/**
 * Set a default timeout of 15 seconds for all ajax requests
 */
$.ajaxSetup({
    timeout: 15000
});

/**
 * A friendly time format function
 *
 * {Y} - 4 digit year
 * {m} - month with leading zero
 * {d} - day with leading zero
 * {H} - hours with leading zero
 * {h} - hours without leading zero
 * {M} - minutes with leading zero
 * {i} - minutes without leading zero
 * {S} - seconds with leading zero
 */
Date.prototype.format = function(format) {

    var date = this;

    // 4 digit year
    format = format.replace('{Y}', function() {
        return date.getFullYear();
    });

    // 4 digit year
    format = format.replace('{y}', function() {
        return date.getFullYear() % 100;
    });

    // month with leading zero
    format = format.replace('{m}', function() {
        var month = date.getMonth() + 1;
        return (month < 10 ? "0" : "") + month;
    });

    // day with leading zero
    format = format.replace('{d}', function() {
        var day = date.getDate();
        return (day < 10 ? "0" : "") + day;
    });

    // hours with leading zero
    format = format.replace('{H}', function() {
        var hours = date.getHours();
        return (hours < 10 ? "0" : "") + hours;
    });

    // hours without leading zero
    format = format.replace('{h}', function() {
        return date.getHours();
    });

    // minutes with leading zero
    format = format.replace('{M}', function() {
        var minutes = date.getMinutes();
        return (minutes < 10 ? "0" : "") + minutes;
    });

    // minutes without leading zero
    format = format.replace('{i}', function() {
        return date.getMinutes();
    });

    // seconds with leading zero
    format = format.replace('{S}', function() {
        var seconds = date.getSeconds();
        return (seconds < 10 ? "0" : "") + seconds;
    });

    return format;
}

// Roman digit regepx
var detectRomanNumber = new RegExp('^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$');

/**
 * Capitalize every word of a string
 */
String.prototype.capitalize = function()
{
    return this.replace(/(\w)(\w*)/g, function(g0,g1,g2)
    {
        // Filter roman numbers
        if (g2.match(detectRomanNumber))
        {
            g2 = g2.toUpperCase();
        } else
        {
            g2 = g2.toLowerCase();
        }

        return g1.toUpperCase() + g2;
    });
}

/**
 * Get URL parameters
 */
$.parameter = function(name)
{
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);

    if (results == null)
    {
       return null;
    }
    else
    {
       return results[1] || 0;
    }
}
