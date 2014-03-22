require.config({
  paths: {
    "jquery":    "vendor/jquery",
    "bootstrap": "vendor/bootstrap",
  },

  shim: {
    "bootstrap": {
      deps: ["jquery"],
      exports: "$.fn.popover"
    }
  }
});
