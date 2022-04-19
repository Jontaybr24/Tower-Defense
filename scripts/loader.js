MyGame = {
    systems: {},
    render: {},
    assets: {},
    screens: {},
    input: {},
    objects: {},
    sounds: {},
    data: {},
};

//------------------------------------------------------------------
//
// Purpose of this code is to bootstrap (maybe I should use that as the name)
// the rest of the application.  Only this file is specified in the index.html
// file, then the code in this file gets all the other code and assets
// loaded.
//
//------------------------------------------------------------------
MyGame.loader = (function () {
    'use strict';
    let scriptOrder = [{
        scripts: ['sounds'],
        message: 'Sound Manager loaded',
        onComplete: null
    },
    {
        scripts: ['game'],
        message: 'Game Scene selector loaded',
        onComplete: null
    },
    {
        scripts: ['render/core'],
        message: 'Rendering core loaded',
        onComplete: null
    },
    {
        scripts: ['kb-input'],
        message: 'Keyboard Input loaded',
        onComplete: null
    },
    {
        scripts: ['mouse-input'],
        message: 'Mouse Input loaded',
        onComplete: null
    },
    {
        scripts: ['objects/gameboard'],
        message: 'Gameboard Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/magic'],
        message: 'Gameboard Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/particles'],
        message: 'Particles Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/info'],
        message: 'Info Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/cursor'],
        message: 'Cursor Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/enemies'],
        message: 'Enemies Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/towers'],
        message: 'Towers Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/path'],
        message: 'Path Loaded',
        onComplete: null
    },
    {
        scripts: ['screens/mainmenu'],
        message: 'Main menu loaded',
        onComplete: null
    },
    {
        scripts: ['screens/settings'],
        message: 'Settings loaded',
        onComplete: null
    },
    {
        scripts: ['screens/about'],
        message: 'About Page loaded',
        onComplete: null
    },
    {
        scripts: ['screens/gameplay'],
        message: 'Game loop and model loaded',
        onComplete: null
    }];

    let assetOrder = [{
        key: 'grass',
        source: '/assets/grass.png'
    }, {
        key: 'wall',
        source: '/assets/wall.png'
    }, {
        key: 'coin',
        source: '/assets/coin.png'
    },{
        key: 'life',
        source: '/assets/life.png'
    },{
        key: 'tower_base',
        source: '/assets/tower-base.png'
    },{
        key: 'turret_1',
        source: '/assets/basic-turret-1.png'
    },{
        key: 'turret_2',
        source: '/assets/basic-turret-2.png'
    },{
        key: 'turret_3',
        source: '/assets/basic-turret-3.png'
    },{
        key: 'turret_4',
        source: '/assets/basic-turret-4.png'
    },{
        key: 'turret_preview',
        source: '/assets/basic-turret-preview.png'
    },{
        key: 'menu_hover',
        source: '/soundFX/menu-hover.wav'
    },
    ];

    //------------------------------------------------------------------
    //
    // Helper function used to load scripts in the order specified by the
    // 'scripts' parameter.  'scripts' expects an array of objects with
    // the following format...
    //    {
    //        scripts: [script1, script2, ...],
    //        message: 'Console message displayed after loading is complete',
    //        onComplete: function to call when loading is complete, may be null
    //    }
    //
    //------------------------------------------------------------------
    function loadScripts(scripts, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (scripts.length > 0) {
            let entry = scripts[0];
            require(entry.scripts, function () {
                console.log(entry.message);
                if (entry.onComplete) {
                    entry.onComplete();
                }
                scripts.shift();    // Alternatively: scripts.splice(0, 1);
                loadScripts(scripts, onComplete);
            });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // Helper function used to load assets in the order specified by the
    // 'assets' parameter.  'assets' expects an array of objects with
    // the following format...
    //    {
    //        key: 'asset-1',
    //        source: 'asset/.../asset.png'
    //    }
    //
    // onSuccess is invoked per asset as: onSuccess(key, asset)
    // onError is invoked per asset as: onError(error)
    // onComplete is invoked once per 'assets' array as: onComplete()
    //
    //------------------------------------------------------------------
    function loadAssets(assets, onSuccess, onError, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (assets.length > 0) {
            let entry = assets[0];
            loadAsset(entry.source,
                function (asset) {
                    onSuccess(entry, asset);
                    assets.shift();    // Alternatively: assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                },
                function (error) {
                    onError(error);
                    assets.shift();    // Alternatively: assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // This function is used to asynchronously load image and audio assets.
    // On success the asset is provided through the onSuccess callback.
    // Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
    //
    //------------------------------------------------------------------
    function loadAsset(source, onSuccess, onError) {
        let xhr = new XMLHttpRequest();
        let fileExtension = source.substr(source.lastIndexOf('.') + 1);    // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

        if (fileExtension) {
            xhr.open('GET', source, true);
            xhr.responseType = 'blob';

            xhr.onload = function () {
                let asset = null;
                if (xhr.status === 200) {
                    if (fileExtension === 'png' || fileExtension === 'jpg') {
                        asset = new Image();
                    } else if (fileExtension === 'mp3' || fileExtension === 'wav') {
                        asset = new Audio();
                    } else {
                        if (onError) { onError('Unknown file extension: ' + fileExtension); }
                    }
                    if (xhr.responseType === 'blob') {
                        if (fileExtension === 'mp3'|| fileExtension === 'wav') {
                            asset.oncanplaythrough = function () {
                                window.URL.revokeObjectURL(asset.src);
                                if (onSuccess) { onSuccess(asset); }
                            };
                        }
                        else {  // not terrific assumption that it has an 'onload' event, but that is what we are doing
                            asset.onload = function () {
                                window.URL.revokeObjectURL(asset.src);
                                if (onSuccess) { onSuccess(asset); }
                            };
                        }
                        asset.src = window.URL.createObjectURL(xhr.response);
                    }
                } else {
                    if (onError) { onError('Failed to retrieve: ' + source); }
                }
            };
        } else {
            if (onError) { onError('Unknown file extension: ' + fileExtension); }
        }

        xhr.send();
    }

    function loadData() {
        let savedData = localStorage.getItem('data');
        if (savedData !== null) {
            MyGame.data = JSON.parse(savedData);
        }
        else {
            MyGame.data = {
                controls: {
                    grid: { label: 'Toggle Grid', key: 'g' },
                    spawnEnemy: { label: 'spawn enemy', key: ' ' },
                    testKey2: {label: 'test key', key: 'a'},
                },
                volume: .3,
            }
            localStorage['data'] = JSON.stringify(MyGame.data);
        }
    }

    //------------------------------------------------------------------
    //
    // Called when all the scripts are loaded, it kicks off the demo app.
    //
    //------------------------------------------------------------------
    function mainComplete() {
        console.log('It is all loaded up');
        MyGame.game.initialize();
    }

    console.log('Loading saved data');
    loadData();

    //
    // Start with loading the assets, then the scripts.
    console.log('Starting to dynamically load project assets');
    loadAssets(assetOrder,
        function (source, asset) {    // Store it on success
            MyGame.assets[source.key] = asset;
        },
        function (error) {
            console.log(error);
        },
        function () {
            console.log('All game assets loaded');
            console.log('Starting to dynamically load project scripts');
            loadScripts(scriptOrder, mainComplete);
        }
    );

}());
