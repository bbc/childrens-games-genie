module.exports = {
    "source": "./src",
    "destination": "./docs/api",
    "excludes": ["lib(\\\\|/)lodash", "lib(\\\\|/)phaser.js", "components(\\\\|/)test-harness"],
    "plugins": [
        {
        "name": "esdoc-standard-plugin"
        },
        //Note below plugin is deprecated
        //{
        //   "name": "esdoc-plugin-enhanced-navigation",
        //   "option":
        //   {
        //      "showAllFiles": "true"
        //   }
        //}
    ],
    "applicationName": "Demo",
    "disqus": "",
    "googleAnalytics": "",
    "openGraph": {
        "title": "",
        "type": "website",
        "image": "",
        "site_name": "",
        "url": ""
    },
}
