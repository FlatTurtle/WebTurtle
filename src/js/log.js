
window.Log = (function() {

    /**
    * Log info message
    */
    function info(message)
    {
        console.log(message);
    }

    /**
    * Log debug message
    */
    function debug(message)
    {
        if (App.debug) console.log(message);
    }

    /**
    * Log error message
    */
    function error(message)
    {
        console.error(message);
    }

    return {
        debug: debug,
        info: info,
        error: error
    }

}());
